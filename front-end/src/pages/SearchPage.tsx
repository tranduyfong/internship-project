// src/pages/SearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import type { RootState } from '../app/store';
import { getProductsRequest } from '../store/actions/productActions';

// Tái sử dụng các thành phần giao diện hiện có
import ProductCard from '../components/ProductCard'; // Thay bằng đường dẫn chuẩn component của bạn
import ProductSkeleton from '../components/ProductSkeleton'; // Thay bằng đường dẫn chuẩn của bạn
import Pagination from '../components/Pagination';
import RecentlyViewedProducts from '../components/product/RecentlyViewedProducts';

const SearchPage: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    // Đọc trường 'keyword' từ URL
    const keyword = searchParams.get('keyword') || '';
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 18; // Đặt kích thước phân trang mặc định

    // Trích xuất dữ liệu từ module product
    const { products, productLoading, totalPages, totalElements } = useSelector((state: RootState) => state.product);

    // Gọi API mỗi khi từ khóa tìm kiếm hoặc trang hiện tại thay đổi
    useEffect(() => {
        dispatch(getProductsRequest({
            keyword: keyword,
            pageNumber: currentPage,
            pageSize: pageSize
        }));
    }, [dispatch, keyword, currentPage]);

    // Reset về trang đầu tiên nếu từ khóa tìm kiếm thay đổi
    useEffect(() => {
        setCurrentPage(0);
    }, [keyword]);

    return (
        <Box className="container" sx={{ mt: 5, mb: 10, fontFamily: 'Quicksand' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>
                KẾT QUẢ TÌM KIẾM
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                Tìm thấy <strong>{totalElements}</strong> sản phẩm khớp với từ khóa "{keyword}"
            </Typography>

            {/* LƯỚI SẢN PHẨM RESPONSIVE CẢ MÁY TÍNH VÀ ĐIỆN THOẠI */}
            <div className="row g-4">
                {productLoading ? (
                    // Hiển thị danh sách Skeleton đang tải
                    <div className="row row-cols-2 row-cols-md-4 row-cols-xl-6 g-3">
                        {Array.from(new Array(12)).map((_, index) => (
                            <div className="col" key={index}>
                                <ProductSkeleton />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <Typography sx={{ color: '#888' }}>Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</Typography>
                    </div>
                ) : (
                    // Hiển thị sản phẩm thật qua Card linh kiện
                    <div className="row row-cols-2 row-cols-md-4 row-cols-xl-6 g-3">
                        {products.map((product) => (
                            <div className="col" key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* TÁI SỬ DỤNG PHÂN TRANG KHỚP CHUẨN */}
            {totalPages > 1 && !productLoading && (
                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Box>
            )}

            <Box sx={{ mt: 8 }}>
                <RecentlyViewedProducts />
            </Box>
        </Box>
    );
};

export default SearchPage;