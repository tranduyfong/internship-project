const db = require('../configs/database.config');

// 1. Dành cho Khách hàng: Lấy (hoặc tạo mới) phòng chat của chính họ
const getOrCreateRoom = async (customerId) => {
    let [rooms] = await db.execute('SELECT id FROM chat_rooms WHERE user_id = ?', [customerId]);

    if (rooms.length === 0) {
        // Nếu chưa có phòng, tạo phòng mới
        const [result] = await db.execute('INSERT INTO chat_rooms (user_id) VALUES (?)', [customerId]);
        return result.insertId;
    }
    return rooms[0].id;
};

// 2. Dành cho Nhân viên: Lấy danh sách khách hàng đã nhắn tin (Kèm số tin chưa đọc)
const getRoomsForStaff = async () => {
    const [rooms] = await db.execute(`
        SELECT 
            cr.id as room_id, 
            u.id as customer_id, 
            u.name as customer_name, 
            cr.last_message, 
            cr.updated_at,
            (SELECT COUNT(id) FROM chat_messages cm WHERE cm.room_id = cr.id AND cm.is_read = FALSE AND cm.sender_type = 'CUSTOMER') as unread_count
        FROM chat_rooms cr
        JOIN users u ON cr.user_id = u.id
        ORDER BY cr.updated_at DESC
    `);
    return rooms;
};

// 3. Phân trang lịch sử tin nhắn (Load 10 tin một, kéo lên load tiếp)
const getMessages = async (roomId, page = 1) => {
    const limit = 10;
    const offset = (page - 1) * limit;

    // Sắp xếp DESC để lấy 10 tin MỚI NHẤT tính từ mốc offset
    const [messages] = await db.execute(`
        SELECT id, sender_id, sender_type, message, is_read, created_at 
        FROM chat_messages 
        WHERE room_id = ? 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
    `, [roomId]);

    return messages;
    // LƯU Ý CHO FRONTEND: Vì ta lấy DESC nên tin mới nhất đang nằm ở đầu mảng [0]. 
    // Khi nhận data, Frontend cần dùng messages.reverse() để đảo ngược lại cho tin cũ nằm trên, tin mới nằm dưới.
};

// 4. Đánh dấu đã đọc toàn bộ tin nhắn trong phòng
const markMessagesAsRead = async (roomId, readerType) => {
    // Nếu nhân viên đọc -> Cập nhật tin của CUSTOMER thành is_read = TRUE
    // Nếu khách đọc -> Cập nhật tin của STAFF thành is_read = TRUE
    const targetType = readerType === 'staff' ? 'customer' : 'staff';

    await db.execute(
        'UPDATE chat_messages SET is_read = TRUE WHERE room_id = ? AND sender_type = ? AND is_read = FALSE',
        [roomId, targetType]
    );
};

// 5. Lưu tin nhắn mới vào DB (Dùng chung cho cả API và Socket)
const saveMessage = async (roomId, senderId, senderType, message) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Lưu chi tiết tin nhắn
        const [result] = await connection.execute(
            'INSERT INTO chat_messages (room_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
            [roomId, senderId, senderType, message]
        );

        // Cập nhật lại thời gian và đoạn tin nhắn cuối ở bảng phòng chat
        await connection.execute(
            'UPDATE chat_rooms SET last_message = ?, updated_at = NOW() WHERE id = ?',
            [message, roomId]
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

module.exports = {
    getOrCreateRoom,
    getRoomsForStaff,
    getMessages,
    markMessagesAsRead,
    saveMessage
};