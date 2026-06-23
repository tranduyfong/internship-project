const db = require('../configs/database.config');

const createProduct = async (data, files) => {
    // Nhận thêm sizes từ data
    const { name_product, price_product, descript_product, brand, sizes } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Thêm vào bảng products
        const [productResult] = await connection.execute(
            'INSERT INTO products (name_product, price_product, descript_product, brand) VALUES (?, ?, ?, ?)',
            [name_product, price_product, descript_product, brand]
        );
        const productId = productResult.insertId;

        // 2. Thêm vào bảng product_images (nếu có ảnh)
        if (files && files.length > 0) {
            const imageValues = files.map(file => [
                productId,
                `/uploads/products/${file.filename}`
            ]);

            await connection.query(
                'INSERT INTO product_images (product_id, image_url) VALUES ?',
                [imageValues]
            );
        }

        // 3. Thêm vào bảng product_sizes (MỚI THÊM)
        if (sizes && sizes.length > 0) {
            const sizeValues = sizes.map(item => [
                productId,
                item.size,
                item.quantity || 0
            ]);

            await connection.query(
                'INSERT INTO product_sizes (product_id, size, quantity) VALUES ?',
                [sizeValues]
            );
        }

        await connection.commit();
        return productId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getProducts = async ({ keyword, pageNumber, pageSize }) => {
    const limit = parseInt(pageSize, 10);
    const offset = parseInt(pageNumber, 10) * limit;

    let countQuery = 'SELECT COUNT(p.id) as total FROM products p';

    let dataQuery = `
        SELECT p.*, 
               (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as cover_image
        FROM products p
    `;

    let queryParams = [];

    if (keyword) {
        const searchPattern = `%${keyword}%`;
        const whereClause = ' WHERE p.name_product LIKE ? OR p.brand LIKE ?';

        countQuery += whereClause;
        dataQuery += whereClause;

        queryParams.push(searchPattern, searchPattern);
    }

    dataQuery += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // 1. Lấy tổng số lượng
    const [countResult] = await db.execute(countQuery, queryParams);
    const totalElements = countResult[0].total;

    // 2. Lấy danh sách sản phẩm
    const [products] = await db.execute(dataQuery, queryParams);

    // 3. XỬ LÝ LẤY SIZE CHO CÁC SẢN PHẨM NÀY
    if (products.length > 0) {
        // Lấy ra danh sách các product_id
        const productIds = products.map(p => p.id);

        // Tạo chuỗi dấu chấm hỏi (?, ?, ?) tương ứng với số lượng ID
        const placeholders = productIds.map(() => '?').join(',');

        // Truy vấn lấy tất cả size của các sản phẩm đang hiển thị trên trang này
        const [sizes] = await db.execute(
            `SELECT product_id, size, quantity FROM product_sizes WHERE product_id IN (${placeholders})`,
            productIds
        );

        // Gom nhóm size theo product_id bằng JavaScript
        const sizesByProduct = sizes.reduce((acc, currentSize) => {
            if (!acc[currentSize.product_id]) {
                acc[currentSize.product_id] = [];
            }
            acc[currentSize.product_id].push({
                size: currentSize.size,
                quantity: currentSize.quantity
            });
            return acc;
        }, {});

        // Gắn mảng sizes vào từng sản phẩm tương ứng
        products.forEach(p => {
            p.sizes = sizesByProduct[p.id] || []; // Nếu không có size thì trả về mảng rỗng []
        });
    }

    const totalPages = Math.ceil(totalElements / limit);

    return {
        data: products,
        pagination: {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: limit,
            totalElements,
            totalPages
        }
    };
};

const getProductById = async (productId) => {
    // 1. Lấy thông tin cơ bản của sản phẩm
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

    if (products.length === 0) {
        throw new Error('PRODUCT_NOT_FOUND');
    }
    const product = products[0];

    // 2. Lấy toàn bộ hình ảnh của sản phẩm
    const [images] = await db.execute(
        'SELECT id, image_url FROM product_images WHERE product_id = ?',
        [productId]
    );
    product.images = images; // Mảng các object ảnh

    // 3. Lấy toàn bộ size và số lượng
    const [sizes] = await db.execute(
        'SELECT id, size, quantity FROM product_sizes WHERE product_id = ?',
        [productId]
    );
    product.sizes = sizes;

    return product;
};

module.exports = {
    createProduct,
    getProducts,
    getProductById
};