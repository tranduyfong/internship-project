import React from 'react';
import ProductCard from '../../components/ProductCard';
import ProductSkeleton from '../../components/ProductSkeleton';
import type { Product } from '../../types/product';

interface HomeProductGridProps {
    loading: boolean;
    products: Product[];
}

const HomeProductGrid: React.FC<HomeProductGridProps> = ({ loading, products }) => {
    // Hiển thị 12 khung xương trống lượn sóng xám khi API đang phản hồi
    if (loading) {
        return (
            <div className="row row-cols-2 row-cols-md-4 row-cols-xl-6 g-3">
                {Array.from(new Array(12)).map((_, index) => (
                    <div className="col" key={index}>
                        <ProductSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    // Trường hợp kho hàng trống hoặc không có hãng sản phẩm tương ứng
    if (products.length === 0) {
        return (
            <p className="text-center text-muted py-5" style={{ fontFamily: 'Quicksand' }}>
                Không tìm thấy sản phẩm nào thuộc hãng này.
            </p>
        );
    }

    return (
        <div className="row row-cols-2 row-cols-md-4 row-cols-xl-6 g-3">
            {products.map((product) => (
                <div className="col" key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default HomeProductGrid;