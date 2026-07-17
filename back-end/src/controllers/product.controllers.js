const productService = require('../services/product.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const create = async (req, res) => {
    try {
        const { name_product, price_product, importPrice, descript_product, brand } = req.body;
        let sizes = [];

        if (req.body.sizes) {
            try {
                sizes = JSON.parse(req.body.sizes);
            } catch (e) {
                return errorResponse(res, 'VALIDATION_FAILED', 'Định dạng sizes không hợp lệ', 400);
            }
        }

        if (!name_product || !price_product || !importPrice) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tên, giá bán và giá nhập là bắt buộc', 400);
        }

        const productId = await productService.createProduct(
            { name_product, price_product, importPrice, descript_product, brand, sizes },
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

        // Mặc định pageSize là 20 theo đúng ý bạn
        const pageNumber = req.query.pageNumber !== undefined && req.query.pageNumber !== '' ? parseInt(req.query.pageNumber, 10) : 0;
        const pageSize = req.query.pageSize !== undefined && req.query.pageSize !== '' ? parseInt(req.query.pageSize, 10) : 20;

        // Xử lý mảng Brands: Tách chuỗi "Nike,Adidas" thành ['Nike', 'Adidas']
        let brands = [];
        if (req.query.brands) {
            brands = req.query.brands.split(',').map(item => item.trim());
        }

        // Xử lý mảng Sizes: Tách chuỗi "39,40" thành [39, 40]
        let sizes = [];
        if (req.query.sizes) {
            sizes = req.query.sizes.split(',').map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num));
        }

        // Xử lý giá tiền
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

        if (pageNumber < 0 || pageSize <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tham số phân trang không hợp lệ', 400);
        }

        // Truyền toàn bộ object điều kiện xuống Service
        const result = await productService.getProducts({
            keyword,
            brands,
            sizes,
            minPrice,
            maxPrice,
            pageNumber,
            pageSize
        });

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

const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name_product, price_product, importPrice, descript_product, brand } = req.body;

        // Mảng chứa ID các ảnh người dùng muốn xóa
        let deletedImageIds = [];
        if (req.body.deletedImageIds) {
            try {
                deletedImageIds = JSON.parse(req.body.deletedImageIds);
            } catch (e) {
                return errorResponse(res, 'VALIDATION_FAILED', 'Định dạng deletedImageIds không hợp lệ', 400);
            }
        }

        if (!productId) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID sản phẩm', 400);
        }

        // Truyền thêm deletedImageIds và req.files xuống Service
        await productService.updateProduct(productId, {
            name_product, price_product, importPrice, descript_product, brand, deletedImageIds
        }, req.files);

        return successResponse(res, null, null, 'Cập nhật sản phẩm thành công');
    } catch (error) {
        if (error.message === 'NO_DATA_TO_UPDATE') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Không có dữ liệu cập nhật', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const changeStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { status } = req.body; // Bắt buộc là 'SELLING' hoặc 'STOPPED'

        if (!productId || !status) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID hoặc trạng thái sản phẩm', 400);
        }

        await productService.toggleProductStatus(productId, status);

        return successResponse(
            res, null, null,
            status === 'STOPPED' ? 'Đã ngưng bán sản phẩm' : 'Đã mở bán lại sản phẩm'
        );
    } catch (error) {
        if (error.message === 'INVALID_STATUS') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Trạng thái chỉ được là SELLING hoặc STOPPED', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getAdminList = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const pageNumber = req.query.pageNumber !== undefined && req.query.pageNumber !== '' ? parseInt(req.query.pageNumber, 10) : 0;
        const pageSize = req.query.pageSize !== undefined && req.query.pageSize !== '' ? parseInt(req.query.pageSize, 10) : 20;

        if (pageNumber < 0 || pageSize <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tham số phân trang không hợp lệ', 400);
        }

        const result = await productService.getAdminProducts({ keyword, pageNumber, pageSize });
        return successResponse(res, result.data, result.pagination, 'Lấy danh sách Admin thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    create,
    getList,
    getDetail,
    editProduct,
    changeStatus,
    getAdminList
};