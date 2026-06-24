import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import type { CheckoutFormData } from './CheckoutForm';

interface PaymentMethodFormProps {
    formData: CheckoutFormData;
    setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ formData, setFormData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
    };

    return (
        <Box>
            <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.1rem', fontFamily: 'Quicksand' }}>
                Thanh toán
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                <RadioGroup value={formData.paymentMethod} onChange={handleChange}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
                        <FormControlLabel
                            value="vnpay"
                            control={<Radio size="small" />}
                            label={<Typography sx={{ fontSize: '14px', fontFamily: 'Quicksand' }}>Thanh toán ngay với VNPAY</Typography>}
                        />
                        <img src="https://vnpay.vn/s1/vnpay/logo.svg" alt="vnpay" style={{ height: 20 }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                            value="cod"
                            control={<Radio size="small" />}
                            label={<Typography sx={{ fontSize: '14px', fontFamily: 'Quicksand' }}>Thanh toán khi giao hàng COD tại nhà</Typography>}
                        />
                        <span style={{ fontSize: '24px' }}>💵</span>
                    </Box>

                </RadioGroup>
            </Box>
        </Box>
    );
};

export default PaymentMethodForm;