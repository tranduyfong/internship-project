// src/pages/VNPayReturnPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { receiptService } from '../service/receipt';

const VNPayReturnPage: React.FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 3 Trạng thái của trang: Đang tải -> Thành công HOẶC Thất bại
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang đồng bộ dữ liệu thanh toán...');

    // Khóa chống gọi API 2 lần trong React 18 Strict Mode
    const hasCalledAPI = useRef(false);

    // Lấy thông tin cơ bản để hiển thị ra UI
    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');
    const displayAmount = amount ? (Number(amount) / 100).toLocaleString('vi-VN') : '0';

    useEffect(() => {
        // Nếu không có query string hoặc đã gọi API rồi thì dừng lại
        if (!location.search || hasCalledAPI.current) return;

        hasCalledAPI.current = true; // Khóa lại ngay lập tức

        const processPayment = async () => {
            try {
                // Đẩy nguyên đuôi URL xuống Backend xử lý
                const data = await receiptService.verifyVnPayReturn(location.search);

                if (data.code === 'SUCCESS') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đơn hàng của bạn đã được cập nhật.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Thanh toán thất bại hoặc đã bị hủy.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Có lỗi xảy ra khi xác thực thanh toán với hệ thống.');
            }
        };

        processPayment();
    }, [location.search]);

    return (
        <Box className="container" sx={{ mt: 10, mb: 10, display: 'flex', justifyContent: 'center', fontFamily: 'Quicksand' }}>
            <Paper elevation={0} sx={{ p: 5, maxWidth: 600, width: '100%', textAlign: 'center', border: '1px solid #eee', borderRadius: 3 }}>

                {/* TRẠNG THÁI 1: ĐANG GỌI API */}
                {status === 'loading' && (
                    <Box sx={{ py: 4 }}>
                        <CircularProgress sx={{ color: '#ffb300', mb: 3 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#666' }}>
                            {message}
                        </Typography>
                        <Typography sx={{ color: '#999', fontSize: '14px', mt: 1 }}>
                            Vui lòng không đóng trình duyệt lúc này...
                        </Typography>
                    </Box>
                )}

                {/* TRẠNG THÁI 2: BE BÁO THÀNH CÔNG */}
                {status === 'success' && (
                    <>
                        <Typography sx={{ fontSize: 80, mb: 2 }}>🎉</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>
                            THANH TOÁN THÀNH CÔNG!
                        </Typography>
                        <Typography sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                            {message} <br />
                            Đơn hàng <strong>{orderInfo?.replace(/\+/g, ' ')}</strong> của bạn đã được ghi nhận.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 4 }}>
                            {displayAmount}đ
                        </Typography>
                    </>
                )}

                {/* TRẠNG THÁI 3: BE BÁO LỖI HOẶC HỦY */}
                {status === 'error' && (
                    <>
                        <Typography sx={{ fontSize: 80, mb: 2 }}>❌</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#d32f2f', mb: 2 }}>
                            THANH TOÁN THẤT BẠI
                        </Typography>
                        <Typography sx={{ color: '#666', mb: 4, lineHeight: 1.6 }}>
                            {message}
                        </Typography>
                    </>
                )}

                {/* CÁC NÚT ĐIỀU HƯỚNG (Chỉ hiện khi đã xử lý xong) */}
                {status !== 'loading' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{ borderColor: '#ccc', color: '#333', fontWeight: 'bold' }}
                            onClick={() => navigate('/')}
                        >
                            Về trang chủ
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', boxShadow: 'none' }}
                            onClick={() => navigate('/kiem-tra-don-hang')}
                        >
                            Xem đơn hàng
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default VNPayReturnPage;