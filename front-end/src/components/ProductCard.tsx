import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format.price';

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const IMAGE_BASE_URL = 'http://localhost:8000';

    const numericPrice = parseFloat(product.price_product || '0');
    const isCompletelyOutOfStock = !product.sizes || product.sizes.length === 0 || product.sizes.every((s: any) => s.quantity === 0);

    let imageList: string[] = [];

    if (product.cover_image && product.cover_image.length > 0) {
        imageList = product.cover_image;
    } else if (product.images && product.images.length > 0) {
        imageList = product.images.map((img: any) => img.image_url);
    }

    const hasMultipleImages = imageList.length > 1;
    const firstImage = imageList.length > 0 ? `${IMAGE_BASE_URL}${imageList[0]}` : '';
    const secondImage = hasMultipleImages ? `${IMAGE_BASE_URL}${imageList[1]}` : '';

    return (
        <Box
            onClick={() => navigate(`/san-pham/${product.id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '10px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', border: '1px solid #f0f0f0', backgroundColor: '#fff',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }
            }}
        >
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#f8f9fa', overflow: 'hidden', borderRadius: '10px 10px 0px 0px' }}>
                {firstImage && (
                    <img
                        src={firstImage}
                        alt={product.name_product}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain',
                            transition: hasMultipleImages ? 'opacity 0.4s ease' : 'transform 0.5s ease',
                            opacity: (isHovered && hasMultipleImages) ? 0 : 1,
                            transform: (isHovered && !hasMultipleImages) ? 'scale(1.05)' : 'scale(1)',
                        }}
                    />
                )}

                {hasMultipleImages && (
                    <img
                        src={secondImage}
                        alt={`${product.name_product} hover`}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain',
                            transition: 'opacity 0.4s ease',
                            opacity: isHovered ? 1 : 0,
                        }}
                    />
                )}
            </Box>

            <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666', mb: 1, fontWeight: 500 }}>
                    Mã SP: {product.id}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: '#d32f2f', fontWeight: 'bold', mb: 0.5 }}>
                    {formatPrice(numericPrice)}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: isCompletelyOutOfStock ? '#999' : '#000', mb: 1 }}>
                    {isCompletelyOutOfStock ? 'HẾT HÀNG' : 'HÀNG CÓ SẴN'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    {product.sizes && product.sizes.map((sizeObj: any, index: number) => (
                        <Typography
                            key={index}
                            sx={{
                                fontSize: '0.75rem', fontWeight: sizeObj.quantity > 0 ? 'bold' : 'normal',
                                color: sizeObj.quantity > 0 ? '#000' : '#ccc',
                                textDecoration: sizeObj.quantity > 0 ? 'none' : 'line-through',
                            }}
                        >
                            {sizeObj.size}
                        </Typography>
                    ))}
                </Box>
                <Typography sx={{ fontSize: '1rem', color: '#777', mt: 'auto', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name_product}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductCard;