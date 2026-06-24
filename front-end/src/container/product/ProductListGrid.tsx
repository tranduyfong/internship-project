import React from 'react';
import ProductCard from '../../components/ProductCard';
import ProductSkeleton from '../../components/ProductSkeleton';
import type { Product } from '../../types/product';

interface ProductListGridProps {
    loading: boolean;
    products: Product[];
}

const ProductListGrid: React.FC<ProductListGridProps> = ({ loading, products }) => {
    if (loading) {
        return (
            <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                {Array.from(new Array(8)).map((_, index) => (
                    <div className="col" key={index}><ProductSkeleton /></div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return <p className="text-center text-muted py-5">Không có sản phẩm nào phù hợp với bộ lọc.</p>;
    }

    return (
        <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
            {products.map((product) => (
                <div className="col" key={product.id}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductListGrid;