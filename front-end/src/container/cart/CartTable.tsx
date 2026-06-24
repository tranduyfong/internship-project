import React from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { Add, Remove, DeleteOutlined } from '@mui/icons-material';
import type { CartItem } from '../../types/cart';

interface CartTableProps {
    cartItems: CartItem[];
    selectedIds: number[];
    onSelect: (cartId: number) => void;
    onSelectAll: () => void;
    onUpdateQuantity: (cartId: number, qty: number) => void;
    onDelete: (cartId: number) => void;
}

const IMAGE_BASE_URL = 'http://localhost:8000';

const CartTable: React.FC<CartTableProps> = ({ cartItems, selectedIds, onSelect, onSelectAll, onUpdateQuantity, onDelete }) => {
    const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

    const formatPrice = (priceStr: string) => {
        return new Intl.NumberFormat('vi-VN').format(parseFloat(priceStr)) + ' đ';
    };

    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, mb: 4, overflow: 'hidden', fontFamily: 'Quicksand' }}>

            {/* Tiêu đề bảng (Chỉ hiển thị trên Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', p: 2, borderBottom: '1px solid #f0f0f0', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>
                <Box sx={{ width: '5%', textAlign: 'center' }}>
                    <Checkbox checked={isAllSelected} onChange={onSelectAll} size="small" />
                </Box>
                <Box sx={{ width: '40%' }}>Tên sản phẩm</Box>
                <Box sx={{ width: '10%', textAlign: 'center' }}>Size</Box>
                <Box sx={{ width: '15%', textAlign: 'center' }}>Đơn giá</Box>
                <Box sx={{ width: '15%', textAlign: 'center' }}>Số lượng</Box>
                <Box sx={{ width: '10%', textAlign: 'center' }}>Thành tiền</Box>
                <Box sx={{ width: '5%', textAlign: 'center' }}>Xóa</Box>
            </Box>

            {/* THANH CÔNG CỤ CHỌN TẤT CẢ (Chỉ hiển thị trên Mobile) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', p: 1.5, borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                <Checkbox checked={isAllSelected} onChange={onSelectAll} size="small" sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    Chọn tất cả ({cartItems.length} sản phẩm)
                </Typography>
            </Box>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item) => (
                <Box key={item.cart_id} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, p: 2, borderBottom: '1px solid #f0f0f0', position: 'relative' }}>

                    {/* Cột 1: Checkbox */}
                    <Box sx={{ width: { xs: 'auto', md: '5%' }, textAlign: 'center', mb: { xs: 1, md: 0 } }}>
                        <Checkbox checked={selectedIds.includes(item.cart_id)} onChange={() => onSelect(item.cart_id)} size="small" />
                    </Box>

                    {/* Cột 2: Hình ảnh & Tên */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: '40%' }, mb: { xs: 2, md: 0 }, pr: { md: 2 } }}>
                        <img src={`${IMAGE_BASE_URL}${item.cover_image}`} alt={item.name_product} style={{ width: 80, height: 80, objectFit: 'contain', backgroundColor: '#f8f9fa', borderRadius: 4, marginRight: 15 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.name_product}
                        </Typography>
                    </Box>

                    {/* Cột 3: Size */}
                    <Box sx={{ width: { xs: '100%', md: '10%' }, textAlign: { xs: 'left', md: 'center' }, mb: { xs: 1, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: { md: 'center' } }}>
                        <Typography sx={{ display: { md: 'none' }, fontSize: '13px', color: '#888', width: '80px' }}>Size:</Typography>
                        <Box sx={{ backgroundColor: '#e3f2fd', color: '#1e88e5', fontSize: '12px', fontWeight: 'bold', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                            {item.size}
                        </Box>
                    </Box>

                    {/* Cột 4: Đơn giá */}
                    <Box sx={{ width: { xs: '100%', md: '15%' }, textAlign: { xs: 'left', md: 'center' }, mb: { xs: 1, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: { md: 'center' } }}>
                        <Typography sx={{ display: { md: 'none' }, fontSize: '13px', color: '#888', width: '80px' }}>Đơn giá:</Typography>
                        <Typography sx={{ color: '#d32f2f', fontWeight: 600, fontSize: '14px' }}>{formatPrice(item.price_product)}</Typography>
                    </Box>

                    {/* Cột 5: Số lượng */}
                    <Box sx={{ width: { xs: '100%', md: '15%' }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' }, mb: { xs: 1, md: 0 } }}>
                        <Typography sx={{ display: { md: 'none' }, fontSize: '13px', color: '#888', width: '80px' }}>Số lượng:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1, width: 'max-content' }}>
                            <IconButton onClick={() => onUpdateQuantity(item.cart_id, Math.max(1, item.quantity - 1))} size="small" sx={{ p: 0.5, borderRadius: 0 }}><Remove fontSize="small" /></IconButton>
                            <Typography sx={{ px: 2, fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</Typography>
                            <IconButton onClick={() => onUpdateQuantity(item.cart_id, item.quantity + 1)} size="small" sx={{ p: 0.5, borderRadius: 0 }}><Add fontSize="small" /></IconButton>
                        </Box>
                    </Box>

                    {/* Cột 6: Thành tiền */}
                    <Box sx={{ width: { xs: '100%', md: '10%' }, textAlign: { xs: 'left', md: 'center' }, mb: { xs: 1, md: 0 }, display: 'flex', alignItems: 'center', justifyContent: { md: 'center' } }}>
                        <Typography sx={{ display: { md: 'none' }, fontSize: '13px', color: '#888', width: '80px' }}>Thành tiền:</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{formatPrice((parseFloat(item.price_product) * item.quantity).toString())}</Typography>
                    </Box>

                    {/* Cột 7: Nút Xóa */}
                    <Box sx={{ width: { xs: '100%', md: '5%' }, textAlign: { xs: 'right', md: 'center' }, position: { xs: 'absolute', md: 'static' }, top: 15, right: 15 }}>
                        <IconButton onClick={() => onDelete(item.cart_id)} sx={{ color: '#d32f2f' }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Box>

                </Box>
            ))}
        </Box>
    );
};

export default CartTable;