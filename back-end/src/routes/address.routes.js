const express = require('express');
const addressController = require('../controllers/address.controllers');

const router = express.Router();

// Lấy danh sách toàn bộ Tỉnh/Thành phố
router.get('/provinces', addressController.getAllProvinces);

// Lấy danh sách Quận/Huyện dựa vào mã Tỉnh/Thành phố
router.get('/provinces/:provinceCode/districts', addressController.getDistricts);

// Lấy danh sách Phường/Xã dựa vào mã Quận/Huyện
router.get('/districts/:districtCode/wards', addressController.getWards);

module.exports = router;