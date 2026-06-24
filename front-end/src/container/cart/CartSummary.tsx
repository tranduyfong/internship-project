import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface CartSummaryProps {
    totalAmount: number;
    totalSelectedItems: number;
    onSubmit: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalAmount, totalSelectedItems, onSubmit }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: 'Quicksand', pt: 3 }}>
            <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '16px', mb: 2 }}>
                TỔNG THANH TOÁN:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Tổng:</Typography>
                <Typography sx={{ fontSize: '22px', fontWeight: 'bold', color: '#d32f2f' }}>
                    {formatPrice(totalAmount)}
                </Typography>
            </Box>
            <Button
                variant="contained"
                disabled={totalSelectedItems === 0}
                onClick={onSubmit}
                sx={{
                    backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontSize: '16px',
                    width: { xs: '100%', md: '300px' }, height: '50px',
                    '&:hover': { backgroundColor: '#e6a323' },
                    '&:disabled': { backgroundColor: '#eee' }
                }}
            >
                MUA NGAY ({totalSelectedItems})
            </Button>
        </Box>
    );
};

export default CartSummary;