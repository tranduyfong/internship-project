const express = require('express');
const mapController = require('../controllers/map.controllers');
const facilityController = require('../controllers/facility.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');

const router = express.Router();

router.get('/map', mapController.getFacilitiesOnMap);
router.get('/', verifyToken, requirePermission('VIEW_FACILITY'), facilityController.getAll);
router.post('/', verifyToken, requirePermission('ADD_FACILITY'), facilityController.create);
router.put('/:id', verifyToken, requirePermission('EDIT_FACILITY'), facilityController.update);
router.delete('/:id', verifyToken, requirePermission('DELETE_FACILITY'), facilityController.remove);

module.exports = router;