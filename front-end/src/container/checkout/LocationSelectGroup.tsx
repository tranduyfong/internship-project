// src/container/checkout/LocationSelectGroup.tsx
import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Box } from '@mui/material';
import { addressService } from '../../service/address';
import type { LocationItem } from '../../types/address';

// Định nghĩa Interface chuẩn hóa cho dữ liệu vị trí dùng chung
export interface LocationState {
    province: LocationItem | null;
    district: LocationItem | null;
    ward: LocationItem | null;
}

interface LocationSelectGroupProps {
    locationData: LocationState;
    onChange: (field: keyof LocationState, value: LocationItem | null) => void;
}

const dropdownMenuProps = {
    PaperProps: { style: { maxHeight: 200 } },
    anchorOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const },
    transformOrigin: { vertical: 'top' as const, horizontal: 'left' as const },
};

const LocationSelectGroup: React.FC<LocationSelectGroupProps> = ({ locationData, onChange }) => {
    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [wards, setWards] = useState<LocationItem[]>([]);

    useEffect(() => { addressService.getProvinces().then(res => setProvinces(res.data || [])); }, []);

    useEffect(() => {
        if (locationData.province) addressService.getDistricts(locationData.province.code).then(res => setDistricts(res.data || []));
        else setDistricts([]);
    }, [locationData.province]);

    useEffect(() => {
        if (locationData.district) addressService.getWards(locationData.district.code).then(res => setWards(res.data || []));
        else setWards([]);
    }, [locationData.district]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
                <Select
                    displayEmpty value={locationData.province?.code || ''} MenuProps={dropdownMenuProps} sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = provinces.find(p => p.code === e.target.value) || null;
                        onChange('province', selected);
                        onChange('district', null); // Reset các cấp dưới
                        onChange('ward', null);
                    }}
                >
                    <MenuItem value="" disabled><em>Chọn tỉnh thành</em></MenuItem>
                    {provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={!locationData.province}>
                <Select
                    displayEmpty value={locationData.district?.code || ''} MenuProps={dropdownMenuProps} sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = districts.find(d => d.code === e.target.value) || null;
                        onChange('district', selected);
                        onChange('ward', null);
                    }}
                >
                    <MenuItem value="" disabled><em>Chọn quận huyện</em></MenuItem>
                    {districts.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={!locationData.district}>
                <Select
                    displayEmpty value={locationData.ward?.code || ''} MenuProps={dropdownMenuProps} sx={{ borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' }}
                    onChange={(e) => {
                        const selected = wards.find(w => w.code === e.target.value) || null;
                        onChange('ward', selected);
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