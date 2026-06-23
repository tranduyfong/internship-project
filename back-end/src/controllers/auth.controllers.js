const authService = require('../services/auth.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const register = async (req, res) => {
    try {
        // Có thể thêm validation thư viện Joi/Zod ở đây sau
        const { name, email, password, phone } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Email and password are required', 400);
        }

        const result = await authService.registerUser({ name, email, password, phone });

        return successResponse(res, result, null, 'User registered successfully', 201);
    } catch (error) {
        if (error.message === 'USER_ALREADY_EXISTS') {
            return errorResponse(res, 'USER_ALREADY_EXISTS', 'User already exists', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Something went wrong', 500, null, error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Email and password are required', 400);
        }

        const result = await authService.loginUser(email, password);

        return successResponse(res, result, null, 'Login successful', 200);
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Something went wrong', 500, null, error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Email là bắt buộc', 400);
        }

        await authService.requestPasswordReset(email);

        return successResponse(res, null, null, 'Mã OTP đã được gửi đến email của bạn');
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Email không tồn tại trong hệ thống', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống khi gửi email', 500, null, error.message);
    }
};

const verifyOtpForgotPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Email và OTP là bắt buộc', 400);
        }

        await authService.verifyResetOtp(email, otp);

        return successResponse(res, null, null, 'Xác thực OTP thành công');
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Email không tồn tại trong hệ thống', 404);
        }
        if (error.message === 'INVALID_OTP') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Mã OTP không chính xác', 400);
        }
        if (error.message === 'OTP_EXPIRED') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Mã OTP đã hết hạn', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyOtpForgotPassword
};
