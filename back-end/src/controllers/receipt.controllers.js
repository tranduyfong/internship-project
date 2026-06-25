const receiptService = require('../services/receipt.services');
const { successResponse, errorResponse } = require('../utils/response.util');
const vnpayInstance = require('../configs/vnpay.config');
const { ProductCode } = require('vnpay'); // Sử dụng Enum chuẩn của thư viện

const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const formData = req.body;

        const orderData = await receiptService.createReceipt(userId, formData);

        if (formData.paymentMethod.toUpperCase() === 'VNPAY') {

            // Xử lý IP: Chuyển IPv6 local thành IPv4 chuẩn để VNPay không báo lỗi
            let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            if (ipAddr === '::1') {
                ipAddr = '127.0.0.1';
            }

            const vnpUrl = vnpayInstance.buildPaymentUrl({
                vnp_Amount: orderData.totalAmount,
                vnp_IpAddr: ipAddr,
                vnp_ReturnUrl: process.env.VNP_RETURN_URL,
                vnp_TxnRef: orderData.orderCode,
                vnp_OrderInfo: `Thanh toan don hang ${orderData.orderCode}`,
                vnp_OrderType: ProductCode.Other // Dùng chuẩn Enum thay vì truyền string cứng
            });

            return successResponse(res, {
                redirectUrl: vnpUrl,
                orderCode: orderData.orderCode
            }, null, 'Chuyển hướng đến VNPay');
        }

        return successResponse(res, { orderCode: orderData.orderCode }, null, 'Đặt hàng thành công');

    } catch (error) {
        return errorResponse(res, 'CHECKOUT_FAILED', error.message, 400);
    }
};

const vnpayIpn = async (req, res) => {
    try {
        const verify = vnpayInstance.verifyIpnCall(req.query);

        if (!verify.isVerified) {
            return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }

        // BÓC TÁCH: Lấy mã đơn hàng gốc bằng cách tách chuỗi tại ký tự '_'
        // Ví dụ: "DH123456_17192736" -> "DH123456"
        const orderCode = verify.vnp_TxnRef.split('_')[0];

        if (verify.isSuccess) {
            await receiptService.updatePaymentSuccess(orderCode);
            return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
        } else {
            // Khách hàng hủy thanh toán hoặc lỗi thẻ -> Chạy hàm hoàn kho an toàn
            await receiptService.restoreInventory(orderCode);
            return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
        }
    } catch (error) {
        return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

const repay = async (req, res) => {
    try {
        const userId = req.user.userId;
        const receiptId = req.params.id;

        // Gọi service xử lý cập nhật trạng thái/trừ kho lại nếu cần
        const receipt = await receiptService.initiateRepay(userId, receiptId);

        let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        if (ipAddr === '::1') ipAddr = '127.0.0.1';

        // Tạo mã giao dịch VNPay mới cho hóa đơn cũ để không bị trùng lặp cổng thanh toán
        const vnpTxnRef = `${receipt.order_code}_${Date.now()}`;

        const vnpUrl = vnpayInstance.buildPaymentUrl({
            vnp_Amount: receipt.total_amount,
            vnp_IpAddr: ipAddr,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
            vnp_TxnRef: vnpTxnRef,
            vnp_OrderInfo: `Thanh toan lai don hang ${receipt.order_code}`,
            vnp_OrderType: ProductCode.Other
        });

        return successResponse(res, { redirectUrl: vnpUrl, orderCode: receipt.order_code }, null, 'Tạo link thanh toán lại thành công');
    } catch (error) {
        return errorResponse(res, 'REPAY_FAILED', error.message, 400);
    }
};

const getMyReceipts = async (req, res) => {
    try {
        const userId = req.user.userId; // Trích xuất từ Token

        const receipts = await receiptService.getMyReceipts(userId);

        return successResponse(res, receipts, null, 'Lấy danh sách đơn hàng thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const vnpayReturn = async (req, res) => {
    try {
        // 1. Thư viện tự động đọc các tham số vnp_Amount, vnp_BankCode... từ URL
        const verify = vnpayInstance.verifyReturnUrl(req.query);

        // 2. Kiểm tra xem có ai cố tình sửa URL để hack tiền không
        if (!verify.isVerified) {
            return errorResponse(res, 'VNPAY_FAILED', 'Dữ liệu không hợp lệ (Sai checksum)', 400);
        }

        // 3. Tách lấy mã đơn hàng gốc (Bỏ cái đoạn _1782390525410 đi)
        const orderCode = verify.vnp_TxnRef.split('_')[0];

        // 4. Nếu vnp_ResponseCode == '00' (isSuccess = true)
        if (verify.isSuccess) {
            // Cập nhật trạng thái 'Paid' vào Database
            await receiptService.updatePaymentSuccess(orderCode);
            return successResponse(res, { orderCode }, null, 'Thanh toán thành công');
        } else {
            // Khách bấm hủy -> Hủy đơn và trả lại số lượng kho
            await receiptService.restoreInventory(orderCode);
            return errorResponse(res, 'PAYMENT_FAILED', 'Thanh toán bị hủy hoặc thất bại', 400);
        }
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    checkout,
    vnpayIpn,
    getMyReceipts,
    repay,
    vnpayReturn
};