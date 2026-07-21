const db = require('../configs/database.config');

const getMapClusters = async (zoom, bounds) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    // =========================================
    // CẤP ĐỘ 1: ZOOM < 6 (Nhìn Toàn Quốc)
    // Gom cụm theo Vùng Miền (Region)
    // =========================================
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

    // =========================================
    // CẤP ĐỘ 2: 6 <= ZOOM < 12 (Nhìn Cấp Tỉnh/Thành)
    // Gom cụm theo Tỉnh (Province) VÀ CHỈ TRONG MÀN HÌNH
    // =========================================
    else if (zoom >= 6 && zoom < 12) {
        const query = `
            SELECT 
                'PROVINCE_CLUSTER' as type,
                province as name,
                COUNT(id) as total_facilities,
                AVG(latitude) as center_lat,
                AVG(longitude) as center_lng
            FROM facilities
            WHERE (latitude BETWEEN ? AND ?) 
              AND (longitude BETWEEN ? AND ?)
            GROUP BY province
        `;
        const [clusters] = await db.execute(query, [minLat, maxLat, minLng, maxLng]);
        return clusters;
    }

    // =========================================
    // CẤP ĐỘ 3: ZOOM >= 12 (Nhìn Chi Tiết Đường/Phố)
    // Lấy tọa độ chính xác của từng cơ sở TRONG MÀN HÌNH
    // =========================================
    else {
        const query = `
            SELECT 
                'EXACT_LOCATION' as type,
                id,
                name,
                address,
                latitude as center_lat,
                longitude as center_lng
            FROM facilities
            WHERE (latitude BETWEEN ? AND ?) 
              AND (longitude BETWEEN ? AND ?)
            LIMIT 200 -- Giới hạn an toàn chống tràn RAM
        `;
        const [locations] = await db.execute(query, [minLat, maxLat, minLng, maxLng]);
        return locations;
    }
};

module.exports = {
    getMapClusters
};