import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import type { ProductDetailImage } from '../../types/product';

interface ProductImagesProps {
    images: ProductDetailImage[];
    name: string;
}

const IMAGE_BASE_URL = 'http://localhost:8000';

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
    const [mainImage, setMainImage] = useState<string>('');

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(`${IMAGE_BASE_URL}${images[0].image_url}`);
        }
    }, [images]);

    return (
        <Box>
            {/* Khung hiển thị ảnh lớn chính */}
            <Box sx={{ backgroundColor: '#f8f9fa', p: 4, mb: 2, borderRadius: 2, textAlign: 'center', position: 'relative' }}>
                <img src={mainImage} alt={name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
            </Box>

            {/* Danh sách ảnh nhỏ chạy ở dưới (Thumbnails) */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {images.map((img) => {
                    const fullUrl = `${IMAGE_BASE_URL}${img.image_url}`;
                    return (
                        <Box
                            key={img.id}
                            onClick={() => setMainImage(fullUrl)}
                            sx={{
                                width: 60, height: 60,
                                border: mainImage === fullUrl ? '2px solid #ffb300' : '1px solid #ddd',
                                cursor: 'pointer', backgroundColor: '#f8f9fa', borderRadius: 1, overflow: 'hidden'
                            }}
                        >
                            <img src={fullUrl} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ProductImages;