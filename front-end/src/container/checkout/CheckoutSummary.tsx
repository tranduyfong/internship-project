// src/container/checkout/CheckoutSummary.tsx
import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

interface CheckoutItem {
    id: number;
    name: string;
    size: number;
    quantity: number;
    price: number;
    image: string;
}

interface CheckoutSummaryProps {
    items: CheckoutItem[];
    onSubmit: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items, onSubmit }) => {
    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Box sx={{ backgroundColor: '#fafafa', p: 4, borderRadius: 2, border: '1px solid #eee', fontFamily: 'Quicksand', height: '100%' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>Đơn hàng của bạn</Typography>

            {/* Danh sách sản phẩm */}
            <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 3 }}>
                {items.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', mb: 3 }}>
                        <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd', backgroundColor: '#fff', flexShrink: 0 }}>
                            <img src={`http://localhost:8000${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            {/* Đã xóa thẻ Box chứa badge số lượng màu xám đè trên góc ảnh */}
                        </Box>
                        <Box sx={{ ml: 2, flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5, lineHeight: 1.3 }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: '12px', color: '#666' }}>Size: {item.size} | SL: {item.quantity}</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', mt: 0.5 }}>{formatPrice(item.price)}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#666', fontSize: '14px' }}>Tạm tính</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{formatPrice(subTotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ color: '#666', fontSize: '14px' }}>Phí vận chuyển</Typography>
                <Typography sx={{ fontSize: '14px', color: '#666' }}>Miễn phí</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Tổng cộng</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: '#ffb300' }}>{formatPrice(subTotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/gio-hang" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                    ← Quay về giỏ hàng
                </Link>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    sx={{ backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand', px: 4, py: 1.5, '&:hover': { backgroundColor: '#e6a323' } }}
                >
                    ĐẶT HÀNG
                </Button>
            </Box>
        </Box>
    );
};

export default CheckoutSummary;