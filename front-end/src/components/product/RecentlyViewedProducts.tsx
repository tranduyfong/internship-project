import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getViewedProducts } from '../../utils/recentlyViewed';
import ProductCard from '../../components/ProductCard';

const RecentlyViewedProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);

    const loadProducts = () => {
        setProducts(getViewedProducts());
    };

    useEffect(() => {
        loadProducts();
        window.addEventListener('recentlyViewedProductsUpdated', loadProducts);
        return () => window.removeEventListener('recentlyViewedProductsUpdated', loadProducts);
    }, []);

    if (products.length === 0) return null;

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: '900', mb: 3, textTransform: 'uppercase', fontFamily: 'Quicksand' }}>
                Sản phẩm bạn vừa xem
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 2.5,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '10px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }
            }}>
                {products.map((product) => (
                    <Box key={product.id} sx={{
                        width: { xs: '160px', sm: '200px', md: '220px' },
                        flex: '0 0 auto'
                    }}>
                        <ProductCard product={product} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RecentlyViewedProducts;