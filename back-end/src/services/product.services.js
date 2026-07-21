const db = require('../configs/database.config');

const createProduct = async (data, files) => {
    const { name_product, price_product, importPrice, descript_product, brand, sizes } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [existingProduct] = await db.execute(
            'SELECT id FROM products WHERE name_product = ?',
            [name_product]
        );

        if (existingProduct.length > 0) {
            throw new Error('PRODUCT_ALREADY_EXISTS');
        }

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

    //p.status = 'SELLING'
    let whereClauses = [];
    let queryParams = [];

    // Hiển thị sản phẩm trạng thái đang bán
    whereClauses.push("p.status = 'SELLING'");

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

const updateProduct = async (productId, updateData, files) => {
    const { name_product, price_product, importPrice, descript_product, brand, deletedImageIds } = updateData;

    // Lấy connection để dùng Transaction
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [existingProduct] = await db.execute(
            'SELECT id FROM products WHERE name_product = ?',
            [name_product]
        );

        if (existingProduct.length > 0) {
            throw new Error('PRODUCT_ALREADY_EXISTS');
        }

        // 1. Cập nhật thông tin cơ bản (Nếu có truyền lên)
        let updateFields = [];
        let queryParams = [];

        if (name_product) { updateFields.push('name_product = ?'); queryParams.push(name_product); }
        if (price_product) { updateFields.push('price_product = ?'); queryParams.push(price_product); }
        if (importPrice) { updateFields.push('import_price = ?'); queryParams.push(importPrice); }
        if (descript_product) { updateFields.push('descript_product = ?'); queryParams.push(descript_product); }
        if (brand) { updateFields.push('brand = ?'); queryParams.push(brand); }

        if (updateFields.length > 0) {
            const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
            queryParams.push(productId);
            await connection.execute(updateQuery, queryParams);
        }

        // 2. Xóa ảnh cũ nếu FE có gửi danh sách ID ảnh cần xóa
        if (deletedImageIds && deletedImageIds.length > 0) {
            const placeholders = deletedImageIds.map(() => '?').join(',');
            // Chặn thêm điều kiện product_id = ? để tránh hacker gửi ID ảnh của sản phẩm khác
            await connection.execute(
                `DELETE FROM product_images WHERE id IN (${placeholders}) AND product_id = ?`,
                [...deletedImageIds, productId]
            );
        }

        // 3. Thêm ảnh mới nếu có file được upload lên
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

        // 4. Nếu không có gì thay đổi thì quăng lỗi
        if (updateFields.length === 0 && (!deletedImageIds || deletedImageIds.length === 0) && (!files || files.length === 0)) {
            throw new Error('NO_DATA_TO_UPDATE');
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 2. Chuyển trạng thái sản phẩm (Đang bán -> Ngưng bán và ngược lại)
const toggleProductStatus = async (productId, status) => {
    if (status !== 'SELLING' && status !== 'STOPPED') {
        throw new Error('INVALID_STATUS');
    }

    await db.execute('UPDATE products SET status = ? WHERE id = ?', [status, productId]);
};

// Thêm hàm này vào gần cuối file
const getAdminProducts = async ({ keyword, pageNumber, pageSize }) => {
    const limit = parseInt(pageSize, 10);
    const offset = parseInt(pageNumber, 10) * limit;

    let whereClause = '';
    let queryParams = [];

    if (keyword) {
        whereClause = 'WHERE p.name_product LIKE ? OR p.brand LIKE ?';
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    let countQuery = `SELECT COUNT(p.id) as total FROM products p ${whereClause}`;
    let dataQuery = `SELECT p.* FROM products p ${whereClause} ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [countResult] = await db.execute(countQuery, queryParams);
    const totalElements = countResult[0].total;

    const [products] = await db.execute(dataQuery, queryParams);

    // Vẫn lấy ảnh bìa để Admin xem cho trực quan
    if (products.length > 0) {
        const productIds = products.map(p => p.id);
        const placeholders = productIds.map(() => '?').join(',');

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
            const allImages = imagesByProduct[p.id] || [];
            p.cover_image = allImages.slice(0, 2);
        });
    }

    return {
        data: products,
        pagination: {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: limit,
            totalElements,
            totalPages: Math.ceil(totalElements / limit)
        }
    };
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    toggleProductStatus,
    getAdminProducts
};