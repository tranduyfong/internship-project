import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { Box, Typography, Button } from '@mui/material';

// Định nghĩa lại interface cho chuẩn (Bổ sung google_map_url)
export interface FacilityData {
    id: number;
    name: string;
    address?: string;
    center_lat: string;
    center_lng: string;
    google_map_url?: string; // Tích hợp thêm trường này
}

interface FacilityPopupProps {
    facility: FacilityData;
    onClose: () => void;
}

const FacilityPopup: React.FC<FacilityPopupProps> = ({ facility, onClose }) => {
    // Hàm xử lý mở Google Maps
    const handleOpenGoogleMaps = () => {
        if (facility.google_map_url) {
            // Mở link ở một tab mới, noopener noreferrer để bảo mật
            window.open(facility.google_map_url, '_blank', 'noopener,noreferrer');
        } else {
            alert('Cơ sở này chưa cập nhật đường dẫn bản đồ chi tiết.');
        }
    };

    return (
        <Popup
            longitude={parseFloat(facility.center_lng)}
            latitude={parseFloat(facility.center_lat)}
            anchor="bottom"
            onClose={onClose}
            closeOnClick={false}
            offset={40} // Đẩy lên không che ghim
        >
            <Box sx={{ p: 1, minWidth: 200, fontFamily: 'Quicksand' }}>
                <Typography sx={{ fontWeight: 900, fontSize: '15px', mb: 0.5, color: '#111' }}>
                    {facility.name}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#666', mb: 2 }}>
                    {facility.address}
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{ bgcolor: '#ffb300', color: '#000', fontWeight: 'bold' }}
                    onClick={handleOpenGoogleMaps} // Gắn sự kiện click
                >
                    Xem đường đi
                </Button>
            </Box>
        </Popup>
    );
};

export default FacilityPopup;