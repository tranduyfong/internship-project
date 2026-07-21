const db = require('../configs/database.config');

const getAllFacilities = async () => {
    const [facilities] = await db.execute('SELECT * FROM facilities ORDER BY created_at DESC');
    return facilities;
};

const createFacility = async (data) => {
    // NHẬN THÊM google_map_url
    const { name, address, region, province, latitude, longitude, google_map_url } = data;

    const [result] = await db.execute(
        `INSERT INTO facilities (name, address, region, province, latitude, longitude, google_map_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, region, province, latitude, longitude, google_map_url || null]
    );
    return result.insertId;
};

const updateFacility = async (id, data) => {
    // NHẬN THÊM google_map_url
    const { name, address, region, province, latitude, longitude, google_map_url } = data;

    const [result] = await db.execute(
        `UPDATE facilities 
         SET name = ?, address = ?, region = ?, province = ?, latitude = ?, longitude = ?, google_map_url = ? 
         WHERE id = ?`,
        [name, address, region, province, latitude, longitude, google_map_url || null, id]
    );

    if (result.affectedRows === 0) throw new Error('FACILITY_NOT_FOUND');
    return true;
};

// HÀM MỚI: XÓA CƠ SỞ
const deleteFacility = async (id) => {
    const [result] = await db.execute('DELETE FROM facilities WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error('FACILITY_NOT_FOUND');
    return true;
};

module.exports = {
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility
};