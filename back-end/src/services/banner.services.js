const db = require('../configs/database.config');

const createBanner = async (file, targetLink) => {
    if (!file) {
        throw new Error('NO_IMAGE');
    }

    // Lấy đường dẫn ảnh, hỗ trợ cả trường hợp bạn cấu hình upload dạng req.file hoặc req.files
    const imageUrl = file.filename ? `/uploads/banners/${file.filename}` : `/uploads/banners/${file[0].filename}`;

    const [result] = await db.execute(
        'INSERT INTO banners (image_url, target_link) VALUES (?, ?)',
        [imageUrl, targetLink || null]
    );
    return result.insertId;
};

// Lấy danh sách Banner đang hoạt động (Dành cho trang chủ của Khách hàng)
const getActiveBanners = async () => {
    const [banners] = await db.execute(
        'SELECT * FROM banners ORDER BY display_order ASC, created_at DESC'
    );
    return banners;
};

// Lấy toàn bộ Banner (Dành cho Admin/Staff quản lý)
const getAllBannersAdmin = async () => {
    const [banners] = await db.execute(
        'SELECT * FROM banners ORDER BY display_order ASC, created_at DESC'
    );
    return banners;
};

const updateBanner = async (bannerId, updateData) => {
    const { target_link, display_order, status } = updateData;
    let updateFields = [];
    let queryParams = [];

    if (target_link !== undefined) { updateFields.push('target_link = ?'); queryParams.push(target_link); }
    if (display_order !== undefined) { updateFields.push('display_order = ?'); queryParams.push(display_order); }
    if (status) { updateFields.push('status = ?'); queryParams.push(status); }

    if (updateFields.length === 0) throw new Error('NO_DATA_TO_UPDATE');

    const query = `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`;
    queryParams.push(bannerId);

    const [result] = await db.execute(query, queryParams);
    if (result.affectedRows === 0) throw new Error('BANNER_NOT_FOUND');
};

const deleteBanner = async (bannerId) => {
    const [result] = await db.execute('DELETE FROM banners WHERE id = ?', [bannerId]);
    if (result.affectedRows === 0) throw new Error('BANNER_NOT_FOUND');
};

module.exports = {
    createBanner,
    getActiveBanners,
    getAllBannersAdmin,
    updateBanner,
    deleteBanner
};