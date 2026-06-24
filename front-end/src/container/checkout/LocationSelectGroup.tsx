import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Box } from '@mui/material';
import { addressService } from '../../service/address';
import type { LocationItem } from '../../types/address';
import type { CheckoutFormData } from './CheckoutForm';

interface LocationSelectGroupProps {
    formData: CheckoutFormData;
    setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

// Cấu hình ép Menu xổ xuống và giới hạn chiều cao
const dropdownMenuProps = {
    PaperProps: { style: { maxHeight: 200 } },
    anchorOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const },
    transformOrigin: { vertical: 'top' as const, horizontal: 'left' as const },
};

const LocationSelectGroup: React.FC<LocationSelectGroupProps> = ({ formData, setFormData }) => {
    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [wards, setWards] = useState<LocationItem[]>([]);

    useEffect(() => {
        addressService.getProvinces().then(res => setProvinces(res.data || []));
    }, []);

    useEffect(() => {
        if (formData.province) {
            addressService.getDistricts(formData.province.code).then(res => setDistricts(res.data || []));
        } else {
            setDistricts([]);
        }
    }, [formData.province]);

    useEffect(() => {
        if (formData.district) {
            addressService.getWards(formData.district.code).then(res => setWards(res.data || []));
        } else {
            setWards([]);
        }
    }, [formData.district]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Tỉnh / Thành phố */}
            <FormControl fullWidth size="small">
                <Select
                    displayEmpty
                    value={formData.province?.code || ''}
                    MenuProps={dropdownMenuProps}
                    sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = provinces.find(p => p.code === e.target.value) || null;
                        setFormData(prev => ({ ...prev, province: selected, district: null, ward: null }));
                    }}
                >
                    <MenuItem value="" disabled><em>Chọn tỉnh thành</em></MenuItem>
                    {provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}
                </Select>
            </FormControl>

            {/* Quận / Huyện */}
            <FormControl fullWidth size="small" disabled={!formData.province}>
                <Select
                    displayEmpty
                    value={formData.district?.code || ''}
                    MenuProps={dropdownMenuProps}
                    sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = districts.find(d => d.code === e.target.value) || null;
                        setFormData(prev => ({ ...prev, district: selected, ward: null }));
                    }}
                >
                    <MenuItem value="" disabled><em>Chọn quận huyện</em></MenuItem>
                    {districts.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}
                </Select>
            </FormControl>

            {/* Phường / Xã */}
            <FormControl fullWidth size="small" disabled={!formData.district}>
                <Select
                    displayEmpty
                    value={formData.ward?.code || ''}
                    MenuProps={dropdownMenuProps}
                    sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = wards.find(w => w.code === e.target.value) || null;
                        setFormData(prev => ({ ...prev, ward: selected }));
                    }}
                >
                    <MenuItem value="" disabled><em>Chọn phường xã</em></MenuItem>
                    {wards.map(w => <MenuItem key={w.code} value={w.code}>{w.name}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
};

export default LocationSelectGroup;