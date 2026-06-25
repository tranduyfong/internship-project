import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, FormControlLabel, Checkbox } from '@mui/material';
import LocationSelectGroup, { type LocationState } from '../checkout/LocationSelectGroup';
import InputField from '../../components/InputField';
import type { UserAddress } from '../../types/user';

interface AddressFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (addressData: any) => void;
    initialData?: UserAddress | null; // Có data = Sửa, Null = Thêm mới
}

const AddressFormDialog: React.FC<AddressFormDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [location, setLocation] = useState<LocationState>({ province: null, district: null, ward: null });
    const [more, setMore] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    // Điền sẵn dữ liệu khi mở form Sửa
    useEffect(() => {
        if (initialData && open) {
            setLocation({
                province: initialData.city_code ? { code: initialData.city_code, name: initialData.city } : null,
                district: initialData.district_code ? { code: initialData.district_code, name: initialData.district } : null,
                ward: initialData.ward_code ? { code: initialData.ward_code, name: initialData.village } : null,
            });
            setMore(initialData.more);
            setIsDefault(initialData.is_default === 1);
        } else if (!initialData && open) {
            // Reset khi mở form Thêm mới
            setLocation({ province: null, district: null, ward: null });
            setMore('');
            setIsDefault(true);
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        const payload = {
            city: location.province?.name || '',
            city_code: location.province?.code || '',
            district: location.district?.name || '',
            district_code: location.district?.code || '',
            village: location.ward?.name || '',
            ward_code: location.ward?.code || '',
            more: more,
            is_default: isDefault
        };
        onSubmit(payload);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontFamily: 'Quicksand', fontWeight: 'bold' }}>
                {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                    <LocationSelectGroup locationData={location} onChange={(field, val) => setLocation(prev => ({ ...prev, [field]: val }))} />
                </Box>
                <InputField label="Địa chỉ cụ thể (Số nhà, ngõ, tên đường...)" name="more" value={more} onChange={(e) => setMore(e.target.value)} />
                <FormControlLabel
                    control={<Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} color="warning" />}
                    label={<span style={{ fontFamily: 'Quicksand', fontSize: '14px' }}>Đặt làm địa chỉ mặc định</span>}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ color: '#666', fontFamily: 'Quicksand', fontWeight: 'bold' }}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!location.province || !location.district || !location.ward || !more} sx={{ backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand' }}>
                    {initialData ? 'Cập nhật' : 'Lưu địa chỉ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddressFormDialog;