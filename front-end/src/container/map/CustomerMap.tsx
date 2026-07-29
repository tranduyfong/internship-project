import React, { useState, useRef } from 'react';
import Map from 'react-map-gl/maplibre';
import { Box } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';

import { facilityMapService } from '../../service/facilityMap';
import RegionClusterMarker from '../../components/map/RegionClusterMarker';
import ExactLocationMarker from '../../components/map/ExactLocationMarker';
import TerritoryMarker from '../../components/map/TerritoryMarker';
import FacilityPopup from '../../components/map/FacilityPopup';
import { osmStyle } from '../../utils/map.style';

interface MapData {
    type: string;
    id?: number;
    name: string;
    address?: string;
    total_facilities?: number;
    center_lat: string;
    center_lng: string;
}

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
                initialViewState={{ longitude: 105.812189, latitude: 21.011906, zoom: 12 }}
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

                    if (item.type === 'REGION_CLUSTER' || item.type === 'GRID_CLUSTER') {
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
                    <FacilityPopup
                        facility={selectedFacility as any}
                        onClose={() => setSelectedFacility(null)}
                    />
                )}
            </Map>
        </Box>
    );
};

export default CustomerMap;