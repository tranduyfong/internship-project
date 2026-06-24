import React from 'react';
import { Box, Typography } from '@mui/material';
import type { LocationItem } from '../../types/address';

// Import các khối con đã được bóc tách
import DeliveryInfoForm from './DeliveryInfoForm';
import PaymentMethodForm from './PaymentMethodForm';

export interface CheckoutFormData {
    email: string;
    fullName: string;
    phone: string;
    addressDetail: string;
    province: LocationItem | null;
    district: LocationItem | null;
    ward: LocationItem | null;
    note: string;
    paymentMethod: string;
}

interface CheckoutFormProps {
    formData: CheckoutFormData;
    setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ formData, setFormData }) => {
    return (
        <Box sx={{ pr: { lg: 5 }, fontFamily: 'Quicksand' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
                SOCCER BECK - GIÀY BÓNG ĐÁ
            </Typography>

            <div className="row g-4">
                {/* Gọi Component Nhập thông tin (Bao gồm form và chọn vị trí) */}
                <div className="col-12 col-md-6">
                    <DeliveryInfoForm formData={formData} setFormData={setFormData} />
                </div>

                {/* Gọi Component Chọn phương thức thanh toán */}
                <div className="col-12 col-md-6">
                    <PaymentMethodForm formData={formData} setFormData={setFormData} />
                </div>
            </div>

            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                <Typography sx={{ fontWeight: 'bold', fontStyle: 'italic', mb: 1 }}>SOCCER BECK MIỄN PHÍ VẬN CHUYỂN</Typography>
                <Typography sx={{ fontSize: '14px', fontStyle: 'italic', mb: 1, fontWeight: 'bold' }}>- Đối với đơn hàng hoả tốc, SOCCER BECK sẽ sử dụng đối tác Ahamove hoặc Grab để đảm bảo tốc độ, chi phí thường khá cao tuy nhiên chúng tôi luôn hỗ trợ một phần chi phí.</Typography>
                <Typography sx={{ fontSize: '14px', fontStyle: 'italic', fontWeight: 'bold' }}>- Đối với các đơn hàng toàn quốc, đối tác giao hàng là C.ty GHN, phí ship là 40.000vnđ và được BECK hỗ trợ hoàn toàn.</Typography>
            </Box>
        </Box>
    );
};

export default CheckoutForm;