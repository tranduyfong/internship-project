// src/components/notifications/PurchaseToast.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import getElapsedTime from '../../utils/elapsed.time';

export interface PurchasePayload {
    customerName?: string;
    productName?: string;
    productImage?: string;
    time?: string;
}

interface PurchaseToastProps {
    data: PurchasePayload;
}

const PurchaseToast: React.FC<PurchaseToastProps> = ({ data }) => {
    const [timeAgo, setTimeAgo] = useState(() => getElapsedTime(data?.time));

    useEffect(() => {
        if (!data?.time) return;
        const interval = setInterval(() => {
            setTimeAgo(getElapsedTime(data.time));
        }, 30000);
        return () => clearInterval(interval);
    }, [data?.time]);

    if (!data) return null;

    const getImageUrl = (src?: string) => {
        if (!src || typeof src !== 'string') return '/placeholder.png';
        return src.startsWith('/') ? `http://localhost:8000${src}` : src;
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: 'Quicksand', p: 1, width: '100%', minWidth: 0, overflow: 'hidden' }}>
            <Avatar
                src={getImageUrl(data.productImage)}
                alt={data.productName || 'Sản phẩm'}
                variant="rounded"
                sx={{ width: 50, height: 50, border: '1px solid #eee', flexShrink: 0 }}
            />
            {/* Box chứa chữ phải có minWidth: 0 và overflow: hidden để khóa chết chiều ngang */}
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <Typography sx={{
                    fontSize: '12px',
                    color: '#666',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.5,
                    minWidth: 0
                }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '6px' }}>
                        Khách <strong>{data.customerName || 'Ẩn danh'}</strong>
                    </span>

                    <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {timeAgo}
                    </span>
                </Typography>

                {/* Đã thêm wordBreak: 'break-word' và whiteSpace: 'normal' để ép ngắt dòng an toàn */}
                <Typography sx={{
                    fontSize: { xs: '12px', sm: '14px' },
                    color: '#000',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                    whiteSpace: 'normal'
                }}>
                    Đã mua: {data.productName || 'Một sản phẩm'}
                </Typography>
            </Box>
        </Box>
    );
};

export default PurchaseToast;