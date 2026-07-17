import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import type { Product, ProductDetail } from '../types/types';

export const useProducts = (keyword: string, page: number) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.searchAdminProducts(keyword, page - 1, 7);
            setProducts(res.data);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi page hoặc keyword thay đổi (Đã fix lỗi chuyển trang chậm ở bước trước)
    useEffect(() => {
        setLoading(true);
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, keyword ? 500 : 0); // Chỉ delay khi gõ phím
        return () => clearTimeout(delayDebounce);
    }, [keyword, page]);

    const changeProductStatus = async (productId: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'SELLING' ? 'STOPPED' : 'SELLING';
            await productService.changeStatus(productId, newStatus);
            toast.success(`Đã ${newStatus === 'SELLING' ? 'mở bán' : 'dừng bán'} sản phẩm thành công!`);
            fetchProducts();
        } catch (error) {
            toast.error("Thay đổi trạng thái thất bại!");
        }
    };

    const saveProduct = async (formData: FormData, existingId?: number) => {
        try {
            if (existingId) {
                await productService.updateProduct(existingId, formData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                await productService.createProduct(formData);
                toast.success("Thêm mới sản phẩm thành công!");
            }
            fetchProducts();
            return true; // Trả về true nếu thành công để đóng Modal
        } catch (error) {
            toast.error("Lưu sản phẩm thất bại. Vui lòng thử lại!");
            return false;
        }
    };

    const getProductDetail = async (productId: number): Promise<ProductDetail | null> => {
        try {
            const res = await productService.getProductDetail(productId);
            return res.data;
        } catch (error) {
            toast.error("Không tải được chi tiết sản phẩm!");
            return null;
        }
    };

    return { products, totalPages, loading, changeProductStatus, saveProduct, getProductDetail };
};