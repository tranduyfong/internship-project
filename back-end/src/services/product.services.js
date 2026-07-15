const db = require('../configs/database.config');

const createProduct = async (data, files) => {
    const { name_product, price_product, importPrice, descript_product, brand, sizes } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [productResult] = await connection.execute(
            'INSERT INTO products (name_product, price_product, import_price, descript_product, brand) VALUES (?, ?, ?, ?, ?)',
            [name_product, price_product, importPrice, descript_product, brand]
        );
        const productId = productResult.insertId;

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

            const logValues = sizes
                .filter(item => (item.quantity || 0) > 0)
                .map(item => [
                    productId,
                    item.size,
                    item.quantity,
                    importPrice,
                    'Nhập kho sản phẩm mới'
                ]);

            if (logValues.length > 0) {
                await connection.query(
                    'INSERT INTO inventory_logs (product_id, size, quantity_added, import_price, reason) VALUES ?',
                    [logValues]
                );
            }
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

const getProducts = async ({ keyword, brands, sizes, minPrice, maxPrice, pageNumber, pageSize }) => {
    const limit = parseInt(pageSize, 10);
    const offset = parseInt(pageNumber, 10) * limit;

    let whereClauses = [];
    let queryParams = [];

    if (keyword) {
        whereClauses.push('(p.name_product LIKE ? OR p.brand LIKE ?)');
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (brands && brands.length > 0) {
        const placeholders = brands.map(() => '?').join(',');
        whereClauses.push(`p.brand IN (${placeholders})`);
        queryParams.push(...brands);
    }

    if (minPrice !== null && minPrice !== undefined) {
        whereClauses.push('p.price_product >= ?');
        queryParams.push(minPrice);
    }
    if (maxPrice !== null && maxPrice !== undefined) {
        whereClauses.push('p.price_product <= ?');
        queryParams.push(maxPrice);
    }

    if (sizes && sizes.length > 0) {
        const placeholders = sizes.map(() => '?').join(',');
        whereClauses.push(`EXISTS (SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id AND ps.size IN (${placeholders}))`);
        queryParams.push(...sizes);
    }

    let whereString = '';
    if (whereClauses.length > 0) {
        whereString = ' WHERE ' + whereClauses.join(' AND ');
    }

    let countQuery = 'SELECT COUNT(p.id) as total FROM products p' + whereString;
    let dataQuery = 'SELECT p.* FROM products p' + whereString + ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [countResult] = await db.execute(countQuery, queryParams);
    const totalElements = countResult[0].total;

    const [products] = await db.execute(dataQuery, queryParams);

    if (products.length > 0) {
        const productIds = products.map(p => p.id);
        const placeholders = productIds.map(() => '?').join(',');

        const [dbSizes] = await db.execute(
            `SELECT product_id, size, quantity FROM product_sizes WHERE product_id IN (${placeholders})`,
            productIds
        );

        const sizesByProduct = dbSizes.reduce((acc, currentSize) => {
            if (!acc[currentSize.product_id]) acc[currentSize.product_id] = [];
            acc[currentSize.product_id].push({
                size: currentSize.size,
                quantity: currentSize.quantity
            });
            return acc;
        }, {});

        const [images] = await db.execute(
            `SELECT product_id, image_url FROM product_images WHERE product_id IN (${placeholders})`,
            productIds
        );

        const imagesByProduct = images.reduce((acc, currentImg) => {
            if (!acc[currentImg.product_id]) acc[currentImg.product_id] = [];
            acc[currentImg.product_id].push(currentImg.image_url);
            return acc;
        }, {});

        products.forEach(p => {
            p.sizes = sizesByProduct[p.id] || [];
            const allImages = imagesByProduct[p.id] || [];
            p.cover_image = allImages.slice(0, 2);
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
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

    if (products.length === 0) {
        throw new Error('PRODUCT_NOT_FOUND');
    }
    const product = products[0];

    const [images] = await db.execute(
        'SELECT id, image_url FROM product_images WHERE product_id = ?',
        [productId]
    );
    product.images = images;

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