import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CheckoutForm from '../container/checkout/CheckoutForm';
import type { CheckoutFormData } from '../container/checkout/CheckoutForm';
import CheckoutSummary from '../container/checkout/CheckoutSummary';
import { fetchProfileRequest } from '../store/actions/profileActions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { checkoutRequest } from '../store/actions/receiptActions';

const CheckoutPage: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    // Nhận dữ liệu truyền từ trang Giỏ Hàng hoặc Chi Tiết SP
    const checkoutItems = location.state?.checkoutItems || [];
    const { user } = useSelector((state: RootState) => state.auth);
    const { fullProfile } = useSelector((state: RootState) => state.profile);

    const [formData, setFormData] = useState<CheckoutFormData>({
        email: '', fullName: '', phone: '', addressDetail: '',
        province: null, district: null, ward: null, note: '',
        paymentMethod: 'cod'
    });

    // Gọi API lấy hồ sơ nếu chưa có
    useEffect(() => {
        if (user && !fullProfile) dispatch(fetchProfileRequest());
    }, [dispatch, user, fullProfile]);

    // LOGIC TỰ ĐỘNG ĐIỀN THÔNG TIN (PRE-FILL)
    useEffect(() => {
        if (fullProfile) {
            // Tìm địa chỉ được set mặc định
            const defaultAddr = fullProfile.addresses?.find(a => a.is_default === 1);

            setFormData(prev => {
                // Biến kiểm tra xem đây là địa chỉ chuẩn mới hay địa chỉ cũ thiếu code
                const isNewAddressFormat = defaultAddr && defaultAddr.city_code !== null;

                return {
                    ...prev,
                    email: fullProfile.email || prev.email,
                    fullName: fullProfile.name || prev.fullName,
                    phone: fullProfile.phone || prev.phone,

                    // XỬ LÝ ĐỊA CHỈ CHI TIẾT:
                    // Nếu là form chuẩn mới: Chỉ điền phần ngõ/số nhà (more).
                    // Nếu là form cũ (null code): Nối toàn bộ Tỉnh, Huyện, Xã cũ vào đây để khách không bị mất dữ liệu.
                    addressDetail: defaultAddr
                        ? (isNewAddressFormat
                            ? defaultAddr.more
                            : `${defaultAddr.more}, ${defaultAddr.village}, ${defaultAddr.district}, ${defaultAddr.city}`)
                        : prev.addressDetail,

                    // XỬ LÝ DROPDOWN SELECT:
                    // Nếu có code thì tự động gán vào để Dropdown nhận diện. Nếu null thì bỏ qua, để nguyên trạng thái "Chọn..."
                    province: isNewAddressFormat ? { code: defaultAddr.city_code!, name: defaultAddr.city } : prev.province,
                    district: isNewAddressFormat ? { code: defaultAddr.district_code!, name: defaultAddr.district } : prev.district,
                    ward: isNewAddressFormat ? { code: defaultAddr.ward_code!, name: defaultAddr.village } : prev.ward,
                };
            });
        }
    }, [fullProfile]);

    // Nếu truy cập URL trực tiếp mà không có sản phẩm -> Đẩy về giỏ hàng
    if (checkoutItems.length === 0) {
        return <Navigate to="/gio-hang" />;
    }

    const handlePlaceOrder = () => {
        // Validate form (Bỏ qua nếu đã đủ thông tin)
        if (!formData.fullName || !formData.phone || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
            toast.error('Vui lòng điền đầy đủ thông tin nhận hàng!');
            return;
        }

        // Tính toán tổng tiền
        const totalAmount = checkoutItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        // XÂY DỰNG PAYLOAD KHỚP 100% VỚI POSTMAN CỦA BẠN
        const payload = {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            note: formData.note,
            paymentMethod: formData.paymentMethod.toUpperCase(), // Ép kiểu in hoa "COD" hoặc "VNPAY"
            addressDetail: formData.addressDetail,
            province: { name: formData.province.name, code: formData.province.code },
            district: { name: formData.district.name, code: formData.district.code },
            ward: { name: formData.ward.name, code: formData.ward.code },
            checkoutItems: checkoutItems.map((item: any) => ({
                id: item.id,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                cover_image: item.image // Đổi tên trường cho khớp với BE
            })),
            totalAmount: totalAmount
        };

        // Bắn request gọi Saga
        dispatch(checkoutRequest(payload));
    };

    return (
        <Box sx={{ mb: 10, mt: 5 }}>
            <div className="row g-5">
                {/* Khối Form chiếm 7 cột (Bên trái) */}
                <div className="col-12 col-lg-7">
                    <CheckoutForm formData={formData} setFormData={setFormData} />
                </div>

                {/* Khối Summary chiếm 5 cột (Bên phải) */}
                <div className="col-12 col-lg-5">
                    <CheckoutSummary items={checkoutItems} onSubmit={handlePlaceOrder} />
                </div>
            </div>
        </Box>
    );
};

export default CheckoutPage;