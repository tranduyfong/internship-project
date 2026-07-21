import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// TẠO HIỆU ỨNG NẢY NHẸ (BOUNCE)
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

interface ExactLocationProps {
    id: number;
    lat: number;
    lng: number;
    name: string;
    onClick: () => void;
}

const ExactLocationMarker: React.FC<ExactLocationProps> = ({ lat, lng, name, onClick }) => {
    return (
        <Marker longitude={lng} latitude={lat} anchor="bottom" onClick={(e) => {
            e.originalEvent.stopPropagation();
            onClick();
        }}>
            <Box sx={{
                cursor: 'pointer',
                animation: `${bounce} 2s infinite ease-in-out`, // Gắn hiệu ứng vào Box
                bgcolor: '#fff',
                border: '2px solid #ffb300',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                position: 'relative',
                transition: 'all 0.3s ease',

                // Tạo cái đuôi nhọn chỉ xuống dưới cho ô vuông
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '6px 6px 0',
                    borderStyle: 'solid',
                    borderColor: '#ffb300 transparent transparent transparent',
                    display: 'block',
                    width: 0,
                    transition: 'border-color 0.3s ease'
                },

                // Khi trỏ chuột vào: Dừng nháy, đổi thành nền vàng
                '&:hover': {
                    bgcolor: '#ffb300',
                    animationPlayState: 'paused',
                    '&::after': {
                        borderColor: '#e6a323 transparent transparent transparent',
                    },
                    '& .marker-text': {
                        color: '#000'
                    }
                }
            }}>
                <Typography className="marker-text" sx={{ fontWeight: 'bold', fontSize: '13px', color: '#333', whiteSpace: 'nowrap' }}>
                    {name}
                </Typography>
            </Box>
        </Marker>
    );
};

export default ExactLocationMarker;