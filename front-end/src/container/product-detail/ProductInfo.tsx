// src/container/product-detail/ProductInfo.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import type { ProductDetailSize } from '../../types/product';

interface ProductInfoProps {
    id: number;
    name: string;
    price: string;
    sizes: ProductDetailSize[];
    onAction: (type: 'buy' | 'cart', size: number | null, qty: number) => void;
    onScrollToSizeGuide: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ id, name, price, sizes, onAction, onScrollToSizeGuide }) => {
    const [selectedSizeObj, setSelectedSizeObj] = useState<ProductDetailSize | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const formatPrice = (priceStr: string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(priceStr)).replace('₫', 'đ');
    };

    const handleSizeSelect = (sizeObj: ProductDetailSize) => {
        setSelectedSizeObj(sizeObj);
        if (quantity > sizeObj.quantity) {
            setQuantity(sizeObj.quantity);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'Quicksand', mb: 1, color: '#333' }}>
                {name}
            </Typography>
            <Typography sx={{ color: '#777', fontSize: '14px', mb: 2 }}>
                MÃ SẢN PHẨM: <span style={{ color: '#333', fontWeight: 600 }}>{id}</span>
            </Typography>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold', mb: 3 }}>
                {formatPrice(price)}
            </Typography>

            {/* Chọn Size giày */}
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '14px', mb: 1, fontWeight: 600 }}>CHỌN SIZE:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    {sizes.map((s) => {
                        const isOutOfStock = s.quantity === 0;
                        const isSelected = selectedSizeObj?.size === s.size;
                        return (
                            <Button
                                key={s.id}
                                disabled={isOutOfStock}
                                onClick={() => handleSizeSelect(s)} // Gọi hàm select có xử lý kiểm tra lượng tồn
                                sx={{
                                    minWidth: 45, height: 40, border: '1px solid',
                                    borderColor: isSelected ? '#000' : (isOutOfStock ? '#eee' : '#ccc'),
                                    color: isSelected ? '#fff' : (isOutOfStock ? '#aaa' : '#000'),
                                    backgroundColor: isSelected ? '#000' : (isOutOfStock ? '#f5f5f5' : '#fff'),
                                    fontFamily: 'Quicksand', fontWeight: 'bold',
                                    textDecoration: isOutOfStock ? 'line-through' : 'none',
                                    '&:hover': { backgroundColor: isOutOfStock ? '#f5f5f5' : (isSelected ? '#000' : '#f0f0f0') }
                                }}
                            >
                                {s.size}
                            </Button>
                        );
                    })}
                </Box>

                {selectedSizeObj && (
                    <Typography sx={{ fontSize: '13px', color: '#2e7d32', fontWeight: 'bold', mt: 1, mb: 1, fontFamily: 'Quicksand' }}>
                        Kho hàng: Còn lại {selectedSizeObj.quantity} sản phẩm cho size {selectedSizeObj.size}
                    </Typography>
                )}

                <Typography
                    onClick={onScrollToSizeGuide}
                    sx={{ display: 'inline-block', backgroundColor: '#222', color: '#fff', fontSize: '11px', px: 2, py: 0.5, borderRadius: 10, cursor: 'pointer', mt: 1 }}
                >
                    Hướng dẫn chọn size
                </Typography>
            </Box>

            {/* Tăng giảm số lượng mua */}
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: '14px', mb: 1, fontWeight: 600 }}>CHỌN SỐ LƯỢNG:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', width: 'max-content', borderRadius: 1 }}>
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        <Remove fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 3, fontWeight: 'bold' }}>{quantity}</Typography>

                    {/* LOGIC MỚI: Tự động khóa nút tăng (+) nếu chạm mốc giới hạn tồn kho của size đang chọn */}
                    <IconButton
                        onClick={() => setQuantity(q => q + 1)}
                        disabled={selectedSizeObj ? quantity >= selectedSizeObj.quantity : false}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Cụm nút Đặt hàng */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    onClick={() => onAction('buy', selectedSizeObj ? selectedSizeObj.size : null, quantity)}
                    variant="contained"
                    sx={{ flex: 1, backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand', height: 50, '&:hover': { backgroundColor: '#e6a323' } }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontSize: '16px' }}>MUA NGAY</span>
                        <span style={{ fontSize: '10px', fontWeight: 'normal' }}>FREE SHIP</span>
                    </Box>
                </Button>
                <Button
                    onClick={() => onAction('cart', selectedSizeObj ? selectedSizeObj.size : null, quantity)}
                    variant="contained"
                    sx={{ backgroundColor: '#ffb300', color: '#000', height: 50, width: 50, minWidth: 50, '&:hover': { backgroundColor: '#e6a323' } }}
                >
                    <ShoppingCart />
                </Button>
            </Box>
        </Box>
    );
};

export default ProductInfo;