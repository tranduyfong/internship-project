const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../configs/database.config');
const transporter = require('../configs/mailer.config');
const { getOtpEmailTemplate } = require('../utils/mail.util');

const registerUser = async (data) => {
    const { name, email, password, phone } = data;

    // 1. Kiểm tra xem email đã tồn tại chưa
    const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUsers.length > 0) {
        throw new Error('USER_ALREADY_EXISTS');
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Thực hiện insert user mới vào DB
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone]
    );

    // 4. Lấy thông tin user vừa tạo để trả về (chỉ SELECT các trường cần thiết, bỏ qua password)
    const [newUsers] = await db.execute(
        'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
    );

    return newUsers[0];
};

const loginUser = async (email, password) => {
    // 1. Tìm user theo email
    const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const user = users[0];

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Tạo payload và ký JWT
    const payload = {
        userId: user.id.toString(),
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    // 4. Xóa thuộc tính password trước khi trả data ra ngoài
    delete user.password;

    return {
        user,
        accessToken: token
    };
};

const requestPasswordReset = async (email) => {
    // 1. Kiểm tra email có tồn tại không
    const [users] = await db.execute('SELECT id, name FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    // 2. Tạo mã OTP ngẫu nhiên 6 chữ số
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Tính thời gian hết hạn (10 phút kể từ hiện tại)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Lưu OTP và thời hạn vào database
    await db.execute(
        'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE email = ?',
        [otpCode, expiresAt, email]
    );

    // 5. Gửi email
    const mailOptions = {
        from: `"Hệ Thống" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Mã OTP khôi phục mật khẩu',
        html: getOtpEmailTemplate(otpCode)
    };

    await transporter.sendMail(mailOptions);
};

const verifyResetOtp = async (email, otp) => {
    // 1. Lấy thông tin reset của user
    const [users] = await db.execute(
        'SELECT id, password_reset_token, password_reset_expires FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const user = users[0];

    // 2. Kiểm tra mã OTP có khớp không và đã được tạo chưa
    if (!user.password_reset_token || user.password_reset_token !== otp) {
        throw new Error('INVALID_OTP');
    }

    // 3. Kiểm tra OTP có bị quá hạn không (So sánh thời gian hiện tại với thời gian trong DB)
    const now = new Date();
    const expiresAt = new Date(user.password_reset_expires);

    if (now > expiresAt) {
        throw new Error('OTP_EXPIRED');
    }

    // 4. Nếu hợp lệ, cho phép đi tiếp (thường là trả về một token tạm thời hoặc cho phép đổi mật khẩu luôn)
    // Ở đây ta chỉ xác nhận thành công, việc đổi mật khẩu sẽ làm ở API sau
    return true;
};

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    verifyResetOtp
};