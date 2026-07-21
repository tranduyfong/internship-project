import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Box, Typography } from '@mui/material';

interface TerritoryMarkerProps {
    lat: number;
    lng: number;
    name: string;
}

const TerritoryMarker: React.FC<TerritoryMarkerProps> = ({ lat, lng, name }) => {
    return (
        <Marker longitude={lng} latitude={lat} anchor="center">
            <Box sx={{
                bgcolor: '#aad3df', // Màu xanh giả lập màu nước biển của OSM
                border: '2px solid #d32f2f', // Viền đỏ nổi bật
                borderRadius: 1,
                px: 2, py: 1,
                boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 999 // Ép khối này nổi lên trên cùng
            }}>
                <Typography sx={{ fontWeight: 900, color: '#d32f2f', fontSize: '14px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {name}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '11px' }}>
                    (Việt Nam)
                </Typography>
            </Box>
        </Marker>
    );
};

export default TerritoryMarker;