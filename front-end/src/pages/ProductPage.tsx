// src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Drawer } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import ProductListGrid from '../container/product/ProductListGrid'; // Import lưới vừa bóc tách

import { getProductsRequest } from '../store/actions';
import type { RootState } from '../app/store';

const ProductPage: React.FC = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ brands: [] as string[], sizes: [] as number[], priceRange: 'all' });

    const { products, productLoading, totalPages, totalElements } = useSelector((state: RootState) => state.auth);

    const parsePriceRange = (range: string) => {
        switch (range) {
            case '<200000': return { minPrice: 0, maxPrice: 200000 };
            case '200000-500000': return { minPrice: 200000, maxPrice: 500000 };
            case '500000-1000000': return { minPrice: 500000, maxPrice: 1000000 };
            case '1000000-1500000': return { minPrice: 1000000, maxPrice: 1500000 };
            case '>1500000': return { minPrice: 1500000, maxPrice: undefined };
            default: return { minPrice: undefined, maxPrice: undefined };
        }
    };

    useEffect(() => {
        const { minPrice, maxPrice } = parsePriceRange(filters.priceRange);
        dispatch(getProductsRequest({
            keyword: '', pageNumber: currentPage, pageSize: 20,
            brands: filters.brands.length > 0 ? filters.brands.join(',') : undefined,
            sizes: filters.sizes.length > 0 ? filters.sizes.join(',') : undefined,
            minPrice, maxPrice
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch, currentPage, filters]);

    return (
        <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                    TÌM ĐƯỢC {totalElements} SẢN PHẨM
                </Typography>
                <Button variant="outlined" onClick={() => setMobileFilterOpen(true)} startIcon={<FilterListIcon />} sx={{ display: { lg: 'none' }, borderColor: '#ccc', color: '#000', fontFamily: 'Quicksand', fontWeight: 'bold' }}>Lọc</Button>
            </Box>

            <div className="row">
                <div className="col-lg-3 d-none d-lg-block">
                    <Box sx={{ position: 'sticky', top: '100px' }}>
                        <FilterSidebar filters={filters} onFilterChange={(f) => { setFilters(f); setCurrentPage(0); }} />
                    </Box>
                </div>
                <div className="col-12 col-lg-9">
                    {/* Lắp ráp lưới sản phẩm độc lập */}
                    <ProductListGrid loading={productLoading} products={products} />
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
            </div>

            <Drawer anchor="right" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)}>
                <Box sx={{ width: 280, p: 2 }}>
                    <FilterSidebar filters={filters} onFilterChange={(f) => { setFilters(f); setCurrentPage(0); }} />
                </Box>
            </Drawer>
        </Box>
    );
};

export default ProductPage;