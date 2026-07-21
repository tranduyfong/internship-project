import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Box, Typography } from '@mui/material';

interface RegionClusterProps {
    lat: number;
    lng: number;
    count: number;
    name: string;
    onClick: () => void; // THÊM PROP NÀY
}

const RegionClusterMarker: React.FC<RegionClusterProps> = ({ lat, lng, count, onClick }) => {
    return (
        <Marker
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={(e) => {
                e.originalEvent.stopPropagation(); // Chặn click xuyên xuống map
                onClick();
            }}
        >
            <Box sx={{
                width: 50, height: 50,
                bgcolor: 'rgba(255, 179, 0, 0.9)',
                border: '3px solid #e6a323',
                borderRadius: '50%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' }
            }}>
                <Typography sx={{ fontWeight: 900, color: '#000', lineHeight: 1 }}>
                    {count}
                </Typography>
                <Typography sx={{ fontSize: '9px', color: '#000', fontWeight: 'bold' }}>
                    Cơ sở
                </Typography>
            </Box>
        </Marker>
    );
};

export default RegionClusterMarker;