import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import type { RootState } from '../app/store';
import { getProductsRequest } from '../store/actions/productActions';

// Import các cấu phần biệt lập từ thư mục container mới tạo
import HomeTabs from '../container/home/HomeTabs';
import HomeProductGrid from '../container/home/HomeProductGrid';

const TABS = ['TẤT CẢ CÁC SẢN PHẨM', 'GIÀY NIKE', 'GIÀY ADIDAS', 'GIÀY PUMA'];

const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const dispatch = useDispatch();

    // Trích xuất State sản phẩm toàn cục của Redux Store
    const { products, productLoading } = useSelector((state: RootState) => state.product);

    // Định tuyến bộ lọc truyền tham số Query String chính xác cho API Backend
    const getBrandForApi = (tabName: string) => {
        switch (tabName) {
            case 'GIÀY NIKE': return 'Nike';
            case 'GIÀY ADIDAS': return 'Adidas';
            case 'GIÀY PUMA': return 'Puma';
            default: return undefined;
        }
    };

    // Kích hoạt cơ chế gọi lại dữ liệu thời gian thực mỗi khi Tab hãng thay đổi
    useEffect(() => {
        dispatch(getProductsRequest({
            keyword: '',
            pageNumber: 0,
            pageSize: 20,
            brands: getBrandForApi(activeTab)
        }));
    }, [dispatch, activeTab]);

    // Thuật toán sắp xếp ưu tiên hiển thị hàng còn size lên trước
    const displayProducts = useMemo(() => {
        if (!products) return [];

        return [...products].sort((a, b) => {
            const aIsOutOfStock = !a.sizes || a.sizes.length === 0 || a.sizes.every(s => s.quantity === 0);
            const bIsOutOfStock = !b.sizes || b.sizes.length === 0 || b.sizes.every(s => s.quantity === 0);

            if (aIsOutOfStock && !bIsOutOfStock) return 1;
            if (!aIsOutOfStock && bIsOutOfStock) return -1;
            return 0;
        });
    }, [products]);

    return (
        <Box sx={{ mb: 5 }}>
            {/* Lắp ráp khối thanh Tabs lựa chọn hãng */}
            <HomeTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Lắp ráp khối lưới hiển thị sản phẩm */}
            <HomeProductGrid loading={productLoading} products={displayProducts} />
        </Box>
    );
};

export default HomePage;