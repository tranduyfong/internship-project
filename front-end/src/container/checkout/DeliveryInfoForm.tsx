import React from 'react';
import { Box, Typography } from '@mui/material';
import InputField from '../../components/InputField';
import LocationSelectGroup from './LocationSelectGroup';
import type { CheckoutFormData } from './CheckoutForm';

interface DeliveryInfoFormProps {
    formData: CheckoutFormData;
    setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const DeliveryInfoForm: React.FC<DeliveryInfoFormProps> = ({ formData, setFormData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.1rem', fontFamily: 'Quicksand' }}>
                Thông tin nhận hàng
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <InputField label="" name="email" placeholder="Nhập email..." value={formData.email} onChange={handleChange} />
                <InputField label="" name="fullName" placeholder="Nhập họ và tên..." value={formData.fullName} onChange={handleChange} />
                <InputField label="" name="phone" placeholder="Nhập số điện thoại, ví dụ: +84123..." value={formData.phone} onChange={handleChange} />
                <InputField label="" name="addressDetail" placeholder="Nhập địa chỉ chi tiết..." value={formData.addressDetail} onChange={handleChange} />

                {/* Component Nhóm chọn địa chỉ API */}
                <Box sx={{ mb: 3 }}>
                    <LocationSelectGroup formData={formData} setFormData={setFormData} />
                </Box>

                <textarea
                    className="form-control"
                    name="note"
                    rows={3}
                    placeholder="Ghi chú (Tùy chọn)"
                    value={formData.note}
                    onChange={handleChange}
                    style={{ fontFamily: 'Quicksand', fontSize: '14px', borderRadius: '6px', padding: '10px' }}
                />
            </Box>
        </Box>
    );
};

export default DeliveryInfoForm;