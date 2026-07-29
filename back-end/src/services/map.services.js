const db = require('../configs/database.config');

const getMapClusters = async (zoom, bounds) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    // 1. ZOOM < 6: Nhìn toàn quốc -> Vẫn gom theo Vùng miền cho tổng quan
    if (zoom < 6) {
        const query = `
            SELECT 
                'REGION_CLUSTER' as type,
                region as name,
                COUNT(id) as total_facilities,
                AVG(latitude) as center_lat,
                AVG(longitude) as center_lng
            FROM facilities
            GROUP BY region
        `;
        const [clusters] = await db.execute(query);
        return clusters;
    }

    // 2. ZOOM 6 ĐẾN 8: Gom cụm theo LƯỚI TO (~11km)
    else if (zoom >= 6 && zoom < 9) {
        const query = `
            SELECT 
                'GRID_CLUSTER' as type,
                COUNT(id) as total_facilities,
                AVG(latitude) as center_lat,
                AVG(longitude) as center_lng
            FROM facilities
            WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?)
            -- Làm tròn 1 chữ số để nhóm các cơ sở trong bán kính 11km lại với nhau
            GROUP BY ROUND(latitude, 1), ROUND(longitude, 1) 
        `;
        const [clusters] = await db.execute(query, [minLat, maxLat, minLng, maxLng]);
        return clusters;
    }

    // 3. ZOOM 9 ĐẾN 11: Gom cụm theo LƯỚI NHỎ (~1.1km)
    else if (zoom >= 9 && zoom < 12) {
        const query = `
            SELECT 
                'GRID_CLUSTER' as type,
                COUNT(id) as total_facilities,
                AVG(latitude) as center_lat,
                AVG(longitude) as center_lng
            FROM facilities
            WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?)
            -- Làm tròn 2 chữ số để tách cụm khi user zoom lại gần hơn
            GROUP BY ROUND(latitude, 2), ROUND(longitude, 2)
        `;
        const [clusters] = await db.execute(query, [minLat, maxLat, minLng, maxLng]);
        return clusters;
    }

    // 4. ZOOM >= 12: Hiện từng cơ sở chính xác
    else {
        const query = `
            SELECT 
                'EXACT_LOCATION' as type,
                id, name, address,
                latitude as center_lat,
                longitude as center_lng,
                google_map_url
            FROM facilities
            WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?)
            LIMIT 200
        `;
        const [locations] = await db.execute(query, [minLat, maxLat, minLng, maxLng]);
        return locations;
    }
};

module.exports = {
    getMapClusters
};