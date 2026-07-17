const db = require('../configs/database.config');
const bcrypt = require('bcryptjs');

const searchUsers = async ({ keyword, role, pageNumber, pageSize }) => {
    const limit = parseInt(pageSize, 10);
    const offset = parseInt(pageNumber, 10) * limit;

    let whereClauses = [];
    let queryParams = [];

    // 1. Lọc theo từ khóa tìm kiếm (Tên, Email, SĐT)
    if (keyword) {
        whereClauses.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
        queryParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // 2. Lọc theo vai trò (MỚI THÊM: ví dụ: 'STAFF', 'USER', 'ADMIN')
    if (role) {
        whereClauses.push('role = ?');
        queryParams.push(role);
    }

    // Ghép các điều kiện lọc lại với nhau
    let whereString = '';
    if (whereClauses.length > 0) {
        whereString = ' WHERE ' + whereClauses.join(' AND ');
    }

    let countQuery = 'SELECT COUNT(id) as total FROM users' + whereString;
    // Lấy thêm cột status để hiển thị trạng thái hoạt động của tài khoản
    let dataQuery = 'SELECT id, name, email, phone, role, status, created_at, updated_at FROM users' + whereString;

    dataQuery += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Thực thi query
    const [countResult] = await db.execute(countQuery, queryParams);
    const totalElements = countResult[0].total;

    const [users] = await db.execute(dataQuery, queryParams);

    if (users.length > 0) {
        const userIds = users.map(u => u.id);
        const placeholders = userIds.map(() => '?').join(',');

        // Chỉ lấy 1 lần duy nhất cho toàn bộ danh sách ID này
        const [perms] = await db.execute(`
            SELECT up.user_id, p.id, p.code, p.description 
            FROM user_permissions up
            JOIN permissions p ON up.permission_id = p.id
            WHERE up.user_id IN (${placeholders})
        `, userIds);

        const permsByUser = perms.reduce((acc, curr) => {
            if (!acc[curr.user_id]) acc[curr.user_id] = [];
            acc[curr.user_id].push({
                id: curr.id,
                code: curr.code,
                description: curr.description
            });
            return acc;
        }, {});

        users.forEach(user => {
            user.permissions = permsByUser[user.id] || [];
        });
    }

    const totalPages = Math.ceil(totalElements / limit);

    return {
        data: users,
        pagination: { pageNumber: parseInt(pageNumber, 10), pageSize: limit, totalElements, totalPages }
    };
};

const getUserById = async (userId) => {
    // 1. Lấy thông tin user (Bỏ password)
    const [users] = await db.execute(
        'SELECT id, name, email, phone, role, status, created_at, updated_at FROM users WHERE id = ?',
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

const changeMyPassword = async (userId, oldPassword, newPassword) => {
    // 1. Lấy thông tin user (để lấy mật khẩu cũ đã mã hóa)
    const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
    if (users.length === 0) throw new Error('USER_NOT_FOUND');
    const user = users[0];

    // 2. So sánh mật khẩu cũ người dùng nhập với mật khẩu trong DB
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error('WRONG_OLD_PASSWORD');
    }

    // 3. Mã hóa mật khẩu mới và cập nhật
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
};

const updateUserByAdmin = async (userId, data) => {
    const { name, phone, role } = data;

    // Xây dựng mảng động để chỉ cập nhật những trường được truyền lên
    let updateFields = [];
    let queryParams = [];

    if (name) {
        updateFields.push('name = ?');
        queryParams.push(name);
    }
    if (phone) {
        updateFields.push('phone = ?');
        queryParams.push(phone);
    }
    if (role) {
        updateFields.push('role = ?');
        queryParams.push(role);
    }

    if (updateFields.length === 0) {
        throw new Error('NO_DATA_TO_UPDATE');
    }

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    queryParams.push(userId);

    await db.execute(updateQuery, queryParams);
};

const toggleUserStatus = async (userId, status) => {
    if (status !== 'ACTIVE' && status !== 'LOCKED') {
        throw new Error('INVALID_STATUS');
    }

    await db.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, userId]
    );
};

// 1. Lấy toàn bộ danh sách quyền có trong hệ thống (để hiện checkbox ở FE)
const getAllPermissions = async () => {
    const [permissions] = await db.execute('SELECT id, code, description FROM permissions');
    return permissions;
};

// 2. Lấy danh sách quyền hiện tại của một nhân viên cụ thể
const getUserPermissions = async (userId) => {
    const [permissions] = await db.execute(`
        SELECT p.id, p.code, p.description 
        FROM permissions p
        JOIN user_permissions up ON p.id = up.permission_id
        WHERE up.user_id = ?
    `, [userId]);
    return permissions;
};

// 3. Cập nhật (gán mới) danh sách quyền cho một nhân viên
const updateUserPermissions = async (userId, permissionIds) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Bước A: Xóa sạch toàn bộ quyền cũ của nhân viên này để tránh trùng lặp
        await connection.execute('DELETE FROM user_permissions WHERE user_id = ?', [userId]);

        // Bước B: Nếu Admin có tích chọn quyền mới, tiến hành lưu lại vào DB
        if (permissionIds && permissionIds.length > 0) {
            const values = permissionIds.map(pId => [userId, pId]);
            await connection.query(
                'INSERT INTO user_permissions (user_id, permission_id) VALUES ?',
                [values]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    searchUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    addMyAddress,
    setAddressDefault,
    updateMyAddress,
    deleteMyAddress,
    changeMyPassword,
    updateUserByAdmin,
    toggleUserStatus,
    getAllPermissions,
    getUserPermissions,
    updateUserPermissions
};