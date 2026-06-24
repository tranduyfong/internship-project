import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Divider } from '@mui/material';

interface FilterState {
    brands: string[];
    sizes: number[];
    priceRange: string;
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (newFilters: FilterState) => void;
}

const BRANDS = ['Nike', 'Adidas', 'Puma'];
const SIZES = [38, 39, 40, 41, 42, 43, 44];
const PRICE_RANGES = [
    { value: 'all', label: 'Tất cả giá' },
    { value: '<200000', label: '< 200.000đ' },
    { value: '200000-500000', label: '200.000đ - 500.000đ' },
    { value: '500000-1000000', label: '500.000đ - 1.000.000đ' },
    { value: '1000000-1500000', label: '1.000.000đ - 1.500.000đ' },
    { value: '>1500000', label: '> 1.500.000đ' },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
    // Xử lý Checkbox Thương hiệu
    const handleBrandChange = (brand: string) => {
        const newBrands = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        onFilterChange({ ...filters, brands: newBrands });
    };

    // Xử lý Box Kích thước
    const handleSizeChange = (size: number) => {
        const newSizes = filters.sizes.includes(size)
            ? filters.sizes.filter(s => s !== size)
            : [...filters.sizes, size];
        onFilterChange({ ...filters, sizes: newSizes });
    };

    // Xử lý Radio Khoảng giá
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, priceRange: (e.target as HTMLInputElement).value });
    };

    return (
        <Box sx={{ p: { xs: 2, lg: 0 }, fontFamily: 'Quicksand' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>BỘ LỌC</Typography>
            <Divider sx={{ mb: 3, borderBottomWidth: 2, backgroundColor: '#000' }} />

            {/* Thương hiệu */}
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Thương hiệu</Typography>
                <FormGroup sx={{ flexDirection: 'row', gap: 1 }}>
                    {BRANDS.map(brand => (
                        <FormControlLabel
                            key={brand}
                            control={<Checkbox checked={filters.brands.includes(brand)} onChange={() => handleBrandChange(brand)} size="small" sx={{ color: '#ccc', '&.Mui-checked': { color: '#000' } }} />}
                            label={<Typography sx={{ fontSize: '0.85rem' }}>{brand}</Typography>}
                        />
                    ))}
                </FormGroup>
            </Box>

            {/* Kích thước */}
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>Kích thước</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {SIZES.map(size => (
                        <Box
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            sx={{
                                width: 35, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid',
                                borderColor: filters.sizes.includes(size) ? '#000' : '#e0e0e0',
                                backgroundColor: filters.sizes.includes(size) ? '#000' : '#fff',
                                color: filters.sizes.includes(size) ? '#fff' : '#000',
                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                transition: 'all 0.2s',
                            }}
                        >
                            {size}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Khoảng giá */}
            <Box>
                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Khoảng giá</Typography>
                <RadioGroup value={filters.priceRange} onChange={handlePriceChange}>
                    {PRICE_RANGES.map(range => (
                        <FormControlLabel
                            key={range.value}
                            value={range.value}
                            control={<Radio size="small" sx={{ color: '#ccc', '&.Mui-checked': { color: '#000' } }} />}
                            label={<Typography sx={{ fontSize: '0.85rem' }}>{range.label}</Typography>}
                        />
                    ))}
                </RadioGroup>
            </Box>
        </Box>
    );
};

export default FilterSidebar;