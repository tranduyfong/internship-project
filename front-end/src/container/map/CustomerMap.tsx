import React, { useState, useRef } from 'react';
import Map, { Popup } from 'react-map-gl/maplibre';
import { Box, Typography, Button } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';

import { facilityMapService } from '../../service/facilityMap';
import RegionClusterMarker from '../../components/map/RegionClusterMarker';
import ExactLocationMarker from '../../components/map/ExactLocationMarker';
import TerritoryMarker from '../../components/map/TerritoryMarker';

interface MapData {
    type: string;
    id?: number;
    name: string;
    address?: string;
    total_facilities?: number;
    center_lat: string;
    center_lng: string;
}

const osmStyle = {
    version: 8,
    sources: {
        'osm-tiles': {
            type: 'raster',
            tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
        }
    },
    layers: [
        {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
        }
    ]
};

const CustomerMap: React.FC = () => {
    const [mapData, setMapData] = useState<MapData[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<MapData | null>(null);
    const mapRef = useRef<any>(null);

    // Hàm gọi API dựa trên tầm nhìn hiện tại
    const fetchMapData = async () => {
        if (!mapRef.current) return;

        const map = mapRef.current.getMap();
        const bounds = map.getBounds();
        const zoom = Math.floor(map.getZoom());

        const minLng = bounds.getWest();
        const maxLng = bounds.getEast();
        const minLat = bounds.getSouth();
        const maxLat = bounds.getNorth();

        try {
            const res = await facilityMapService.getMapData(zoom, minLat, maxLat, minLng, maxLng);
            if (res.code === 'SUCCESS') {
                setMapData(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bản đồ", error);
        }
    };

    const handleClusterClick = (lat: number, lng: number) => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            const currentZoom = map.getZoom();

            // Lệnh flyTo tạo hiệu ứng máy quay lướt và thu phóng rất đẹp
            map.flyTo({
                center: [lng, lat],
                zoom: currentZoom + 2.5, // Phóng to thêm 2.5 cấp
                duration: 1000, // Bay mượt trong 1 giây
                essential: true
            });
        }
    };

    return (
        <Box sx={{ width: '100%', height: '70vh', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Map
                ref={mapRef}
                initialViewState={{ longitude: 105.812189, latitude: 21.011906, zoom: 5 }}
                mapStyle={osmStyle as any}
                onMoveEnd={fetchMapData}
                onLoad={fetchMapData}
            >
                <TerritoryMarker lat={16.8333} lng={112.3333} name="Quần đảo Hoàng Sa" />
                <TerritoryMarker lat={9} lng={114.2400} name="Quần đảo Trường Sa" />

                {/* LẶP VÀ RENDER CÁC COMPONENT MARKER */}
                {mapData.map((item, index) => {
                    const lat = parseFloat(item.center_lat);
                    const lng = parseFloat(item.center_lng);

                    if (item.type === 'REGION_CLUSTER' || item.type === 'PROVINCE_CLUSTER') {
                        return (
                            <RegionClusterMarker
                                key={`cluster-${index}`}
                                lat={lat} lng={lng}
                                count={item.total_facilities || 0}
                                name={item.name}
                                onClick={() => handleClusterClick(lat, lng)}
                            />
                        );
                    }

                    if (item.type === 'EXACT_LOCATION') {
                        return (
                            <ExactLocationMarker
                                key={`exact-${item.id}`}
                                id={item.id!}
                                lat={lat} lng={lng}
                                name={item.name}
                                onClick={() => setSelectedFacility(item)}
                            />
                        );
                    }

                    return null;
                })}

                {/* POPUP HIỂN THỊ KHI CLICK VÀO CƠ SỞ CHI TIẾT */}
                {selectedFacility && (
                    <Popup
                        longitude={parseFloat(selectedFacility.center_lng)}
                        latitude={parseFloat(selectedFacility.center_lat)}
                        anchor="bottom"
                        onClose={() => setSelectedFacility(null)}
                        closeOnClick={false}
                        offset={40} // Đẩy popup lên một chút để không che mất icon
                    >
                        <Box sx={{ p: 1, minWidth: 200, fontFamily: 'Quicksand' }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '15px', mb: 0.5, color: '#111' }}>
                                {selectedFacility.name}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#666', mb: 2 }}>
                                {selectedFacility.address}
                            </Typography>
                            <Button variant="contained" fullWidth size="small" sx={{ bgcolor: '#ffb300', color: '#000', fontWeight: 'bold' }}>
                                Xem đường đi
                            </Button>
                        </Box>
                    </Popup>
                )}
            </Map>
        </Box>
    );
};

export default CustomerMap;