import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CheckoutForm from '../container/checkout/CheckoutForm';
import type { CheckoutFormData } from '../container/checkout/CheckoutForm';
import CheckoutSummary from '../container/checkout/CheckoutSummary';
import { fetchProfileRequest } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const CheckoutPage: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    // Nhận dữ liệu truyền từ trang Giỏ Hàng hoặc Chi Tiết SP
    const checkoutItems = location.state?.checkoutItems || [];
    const { fullProfile, user } = useSelector((state: RootState) => state.auth);

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
        // Validate cơ bản
        if (!formData.fullName || !formData.phone || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
            toast.error('Vui lòng điền đầy đủ thông tin nhận hàng!');
            return;
        }

        const totalAmount = checkoutItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        // Xử lý IN RA CONSOLE rõ ràng bằng tên chữ (Không dùng ID/Code)
        console.log("============= ĐƠN HÀNG MỚI =============");
        console.log("1. THÔNG TIN KHÁCH HÀNG:");
        console.log(`- Họ tên: ${formData.fullName}`);
        console.log(`- Điện thoại: ${formData.phone}`);
        console.log(`- Email: ${formData.email}`);
        console.log(`- Ghi chú: ${formData.note}`);
        console.log(`- Phương thức thanh toán: ${formData.paymentMethod.toUpperCase()}`);
        console.log("");
        console.log("2. ĐỊA CHỈ GIAO HÀNG:");
        console.log(`- ${formData.addressDetail}, ${formData.ward?.name}, ${formData.district?.name}, ${formData.province?.name}`);
        console.log("");
        console.log("3. CHI TIẾT SẢN PHẨM:");
        checkoutItems.forEach((item: any, idx: number) => {
            console.log(`[SP ${idx + 1}] ${item.name} | Size: ${item.size} | Số lượng: ${item.quantity} | Giá: ${item.price}đ`);
        });
        console.log("----------------------------------------");
        console.log(`=> TỔNG THANH TOÁN: ${totalAmount}đ`);
        console.log("========================================");

        toast.success('Đặt hàng thành công! Vui lòng kiểm tra Console log.');
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