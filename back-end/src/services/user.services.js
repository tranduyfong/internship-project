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

module.exports = {
    searchUsers,
    getUserById
};