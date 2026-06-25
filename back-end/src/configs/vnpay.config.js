const { VNPay } = require('vnpay');
require('dotenv').config();

const vnpayInstance = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_HASH_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    // testMode = true sẽ tự động trỏ đến đường dẫn Sandbox (môi trường test) của VNPay
    // Sau này lên production (chạy thật), bạn chỉ cần đổi thành false
    testMode: true,
    hashAlgorithm: 'SHA512',
});

module.exports = vnpayInstance;