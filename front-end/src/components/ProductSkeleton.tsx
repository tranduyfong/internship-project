import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ProductSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                p: 2,
            }}
        >
            {/* Khung ảnh giả */}
            <Box sx={{ width: '100%', paddingTop: '100%', position: 'relative', mb: 2 }}>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '4px' }}
                />
            </Box>

            {/* Khung Mã SP giả */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Skeleton variant="text" animation="wave" width="60%" height={20} />
            </Box>

            {/* Khung Giá giả */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Skeleton variant="text" animation="wave" width="40%" height={24} />
            </Box>

            {/* Khung Trạng thái tồn kho giả */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Skeleton variant="text" animation="wave" width="50%" height={20} />
            </Box>

            {/* Khung Size giả */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Skeleton variant="text" animation="wave" width="15%" />
                <Skeleton variant="text" animation="wave" width="15%" />
            </Box>

            {/* Khung Tên sản phẩm giả */}
            <Box sx={{ mt: 'auto' }}>
                <Skeleton variant="text" animation="wave" width="100%" />
                <Skeleton variant="text" animation="wave" width="80%" />
            </Box>
        </Box>
    );
};

export default ProductSkeleton;