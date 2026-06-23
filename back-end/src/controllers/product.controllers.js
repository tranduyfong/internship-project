const productService = require('../services/product.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const create = async (req, res) => {
    try {
        const { name_product, price_product, descript_product, brand } = req.body;
        let sizes = [];

        // Kiểm tra và dịch ngược chuỗi sizes từ form-data thành mảng
        if (req.body.sizes) {
            try {
                sizes = JSON.parse(req.body.sizes);
            } catch (e) {
                return errorResponse(res, 'VALIDATION_FAILED', 'Định dạng sizes không hợp lệ (Phải là JSON string)', 400);
            }
        }

        if (!name_product || !price_product) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tên và giá sản phẩm là bắt buộc', 400);
        }

        // Truyền thêm sizes vào service
        const productId = await productService.createProduct(
            { name_product, price_product, descript_product, brand, sizes },
            req.files
        );

        return successResponse(res, { id: productId }, null, 'Tạo sản phẩm thành công', 201);
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getList = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const pageNumber = req.query.pageNumber !== undefined && req.query.pageNumber !== '' ? parseInt(req.query.pageNumber, 10) : 0;
        const pageSize = req.query.pageSize !== undefined && req.query.pageSize !== '' ? parseInt(req.query.pageSize, 10) : 20;

        if (pageNumber < 0 || pageSize <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tham số phân trang không hợp lệ', 400);
        }

        const result = await productService.getProducts({ keyword, pageNumber, pageSize });

        return successResponse(res, result.data, result.pagination, 'Lấy danh sách sản phẩm thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);

        return successResponse(res, product, null, 'Lấy chi tiết sản phẩm thành công');
    } catch (error) {
        if (error.message === 'PRODUCT_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy sản phẩm', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    create,
    getList,
    getDetail
};