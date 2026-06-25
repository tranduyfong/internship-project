const db = require('../configs/database.config');

const searchUsers = async ({ keyword, pageNumber, pageSize }) => {
    // Ép kiểu chắc chắn thành số nguyên
    const limit = parseInt(pageSize, 10);
    const offset = parseInt(pageNumber, 10) * limit;

    let countQuery = 'SELECT COUNT(id) as total FROM users';
    let dataQuery = 'SELECT id, name, email, phone, role, created_at, updated_at FROM users';

    // Dùng chung một mảng params cho cả 2 query vì LIMIT/OFFSET đã nối thẳng vào chuỗi
    let queryParams = [];

    // Xử lý tìm kiếm nếu có keyword
    if (keyword) {
        const searchPattern = `%${keyword}%`;
        const whereClause = ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';

        countQuery += whereClause;
        dataQuery += whereClause;

        // Truyền 3 tham số tương ứng với 3 dấu ?
        queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    // Nối trực tiếp LIMIT và OFFSET thành chuỗi (An toàn tuyệt đối do đã parseInt)
    dataQuery += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Thực thi query đếm tổng số lượng bản ghi
    const [countResult] = await db.execute(countQuery, queryParams);
    const totalElements = countResult[0].total;

    // Thực thi query lấy danh sách dữ liệu
    const [users] = await db.execute(dataQuery, queryParams);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalElements / limit);

    return {
        data: users,
        pagination: {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: limit,
            totalElements,
            totalPages
        }
    };
};

const getUserById = async (userId) => {
    // 1. Lấy thông tin user (Bỏ password)
    const [users] = await db.execute(
        'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
        [userId]
    );

    if (users.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }
    const user = users[0];

    // 2. Lấy danh sách địa chỉ của user này
    const [addresses] = await db.execute(
        'SELECT id, city, district, village, more, is_default FROM user_addresses WHERE user_id = ?',
        [userId]
    );
    user.addresses = addresses;

    return user;
};

const getMyProfile = async (userId) => {
    const [users] = await db.execute(
        'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
        [userId]
    );

    if (users.length === 0) throw new Error('USER_NOT_FOUND');
    const user = users[0];

    // Cập nhật câu lệnh SELECT để lấy thêm city_code, district_code, ward_code
    const [addresses] = await db.execute(
        'SELECT id, city, city_code, district, district_code, village, ward_code, more, is_default FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
        [userId]
    );
    user.addresses = addresses;

    return user;
};

const updateMyProfile = async (userId, data) => {
    const { name, phone } = data;
    await db.execute(
        'UPDATE users SET name = ?, phone = ? WHERE id = ?',
        [name, phone, userId]
    );
};

const addMyAddress = async (userId, data) => {
    // Nhận thêm 3 trường code từ data
    const { city, city_code, district, district_code, village, ward_code, more, is_default } = data;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.execute('SELECT id FROM user_addresses WHERE user_id = ?', [userId]);

        let isDefault = existing.length === 0 ? true : (is_default || false);

        if (isDefault && existing.length > 0) {
            await connection.execute('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
        }

        // Cập nhật câu lệnh INSERT
        const [result] = await connection.execute(
            'INSERT INTO user_addresses (user_id, city, city_code, district, district_code, village, ward_code, more, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, city, city_code, district, district_code, village, ward_code, more, isDefault]
        );

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const setAddressDefault = async (userId, addressId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Kiểm tra địa chỉ có tồn tại và thuộc về user này không
        const [address] = await connection.execute('SELECT id FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
        if (address.length === 0) throw new Error('ADDRESS_NOT_FOUND');

        // B1: Gỡ mặc định toàn bộ địa chỉ của user này
        await connection.execute('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);

        // B2: Đặt địa chỉ được chọn thành mặc định
        await connection.execute('UPDATE user_addresses SET is_default = TRUE WHERE id = ?', [addressId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateMyAddress = async (userId, addressId, data) => {
    const { city, city_code, district, district_code, village, ward_code, more, is_default } = data;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Kiểm tra địa chỉ có tồn tại và thuộc về user này không
        const [existing] = await connection.execute('SELECT id FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
        if (existing.length === 0) throw new Error('ADDRESS_NOT_FOUND');

        // Nếu cập nhật thành mặc định, gỡ các địa chỉ khác
        if (is_default) {
            await connection.execute('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
        }

        await connection.execute(
            `UPDATE user_addresses 
             SET city = ?, city_code = ?, district = ?, district_code = ?, village = ?, ward_code = ?, more = ?, is_default = ? 
             WHERE id = ? AND user_id = ?`,
            [city, city_code, district, district_code, village, ward_code, more, is_default, addressId, userId]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 6. Xóa địa chỉ cá nhân
const deleteMyAddress = async (userId, addressId) => {
    const [existing] = await db.execute('SELECT id FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId]);

    if (existing.length === 0) throw new Error('ADDRESS_NOT_FOUND');

    await db.execute('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
};

module.exports = {
    searchUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    addMyAddress,
    setAddressDefault,
    updateMyAddress,
    deleteMyAddress
};