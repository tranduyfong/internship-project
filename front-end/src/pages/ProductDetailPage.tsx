import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, colors } from '@mui/material';
import { toast } from 'react-toastify';

import { getProductDetailRequest } from '../store/actions';
import { addToCartRequest } from '../store/actions';
import type { RootState } from '../app/store';

// Import 4 khối container vừa được tách rời
import ProductImages from '../container/product-detail/ProductImages';
import ProductInfo from '../container/product-detail/ProductInfo';
import ProductPolicy from '../container/product-detail/ProductPolicy';
import ProductTabs from '../container/product-detail/ProductTabs';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentProduct: product, detailLoading, user } = useSelector((state: RootState) => state.auth);

    const [activeTab, setActiveTab] = useState(0);
    const tabsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) dispatch(getProductDetailRequest(id));
        window.scrollTo(0, 0);
    }, [id, dispatch]);

    if (detailLoading || !product) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#ffb300' }} /></Box>;
    }

    // Điều khiển cuộn mượt xuống phần Hướng dẫn bảng size
    const handleScrollToSizeGuide = () => {
        setActiveTab(2); // Vị trí index số 2 là tab "CÁCH CHỌN SIZE"
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Hàm xử lý logic kiểm tra Đăng nhập & Đặt hàng tập trung tại file Page gốc
    const handleCartAction = (type: 'buy' | 'cart', size: number | null, qty: number) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thực hiện thao tác này!');
            return;
        }
        if (!size) {
            toast.warning('Vui lòng lựa chọn kích thước size giày trước!');
            return;
        }
        if (type === 'buy') {
            navigate('/thanh-toan', {
                state: {
                    checkoutItems: [{
                        id: product.id,
                        name: product.name_product,
                        size: size,
                        quantity: qty,
                        price: parseFloat(product.price_product),
                        image: product.images[0]?.image_url
                    }]
                }
            });
        } else {
            dispatch(addToCartRequest({ productId: product.id, size: size, quantity: qty }));
        }
    };

    return (
        <Box sx={{ mb: 5, mt: 3 }}>
            <Typography sx={{ color: '#666', fontSize: '13px', mb: 3, fontFamily: 'Quicksand', display: 'flex' }}>
                <Link to={"/"} style={{ textDecoration: 'none', marginRight: '3px' }}>Trang chủ</Link> /
                <Typography sx={{ color: '#666', fontSize: '13px', marginLeft: '3px', fontWeight: 'bold' }}>{product.name_product}</Typography>
            </Typography>

            {/* Lưới phân chia layout của Bootstrap */}
            <div className="row g-4">
                {/* Khối 1: Ảnh (Trái) */}
                <div className="col-12 col-md-5">
                    <ProductImages images={product.images} name={product.name_product} />
                </div>

                {/* Khối 2: Thông tin & Đặt hàng (Giữa) */}
                <div className="col-12 col-md-4">
                    <ProductInfo
                        id={product.id}
                        name={product.name_product}
                        price={product.price_product}
                        sizes={product.sizes}
                        onAction={handleCartAction}
                        onScrollToSizeGuide={handleScrollToSizeGuide}
                    />
                </div>

                {/* Khối 3: Các chính sách phụ (Phải) */}
                <div className="col-12 col-md-3">
                    <ProductPolicy />
                </div>
            </div>

            {/* Khối 4: Hệ thống Tabs thông tin mở rộng (Dưới) */}
            <div ref={tabsRef}>
                <ProductTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    description={product.descript_product}
                    brand={product.brand}
                />
            </div>
        </Box>
    );
};

export default ProductDetailPage;