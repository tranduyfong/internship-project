const getProvinces = async () => {
    // Gọi API lấy danh sách toàn bộ 63 Tỉnh/Thành phố
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    if (!response.ok) throw new Error('API_FETCH_FAILED');
    return await response.json();
};

const getDistrictsByProvince = async (provinceCode) => {
    // Gọi API lấy Tỉnh kèm theo danh sách các Quận/Huyện (depth=2) bên trong nó
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    if (!response.ok) {
        if (response.status === 404) throw new Error('PROVINCE_NOT_FOUND');
        throw new Error('API_FETCH_FAILED');
    }
    const data = await response.json();
    return data.districts || [];
};

const getWardsByDistrict = async (districtCode) => {
    // Gọi API lấy Quận/Huyện kèm theo danh sách Phường/Xã (depth=2) bên trong nó
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    if (!response.ok) {
        if (response.status === 404) throw new Error('DISTRICT_NOT_FOUND');
        throw new Error('API_FETCH_FAILED');
    }
    const data = await response.json();
    return data.wards || [];
};

module.exports = {
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict
};