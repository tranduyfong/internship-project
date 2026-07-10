import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import type { RootState } from '../../app/store';

import { forgotPasswordRequest, resetPasswordRequest, verifyOtpRequest } from '../../store/actions/authActions';
import { setStep } from '../../store/slices/authSlice';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy dữ liệu tạm từ Redux (Step và Email đang xử lý)
    const { step, emailForReset, authLoading: loading } = useSelector((state: RootState) => state.auth);

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(forgotPasswordRequest({ email }));
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        // Gửi OTP lên Saga để kiểm tra thực tế
        if (otp.trim() && emailForReset) {
            dispatch(verifyOtpRequest({ email: emailForReset, otp }));
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailForReset && otp && newPassword) {
            dispatch(resetPasswordRequest({
                email: emailForReset,
                otp: otp,
                newPassword: newPassword
            }));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5" style={{ color: '#2c3e50' }}>Quên mật khẩu</h2>
            <div className="row justify-content-center g-4">
                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">
                            {step === 1 ? 'QUÊN MẬT KHẨU' : step === 2 ? 'XÁC NHẬN MÃ OTP' : 'ĐỔI MẬT KHẨU MỚI'}
                        </h6>

                        {/* BƯỚC 1 */}
                        {step === 1 && (
                            <form onSubmit={handleSendEmail}>
                                <InputField label="Email đăng nhập" name="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                                </button>
                                <div className="text-center">
                                    <span onClick={() => navigate('/dang-nhap')} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Quay lại đăng nhập</span>
                                </div>
                            </form>
                        )}

                        {/* BƯỚC 2 */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP}>
                                <p className="text-muted" style={{ fontSize: '14px' }}>Nhập mã OTP vừa được gửi đến <strong>{emailForReset}</strong></p>
                                <InputField label="Mã OTP" name="otp" placeholder="Nhập mã 6 số" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }}>
                                    Tiếp tục
                                </button>
                                <div className="text-center">
                                    <span onClick={() => dispatch(setStep(1))} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Thử lại email khác</span>
                                </div>
                            </form>
                        )}

                        {/* BƯỚC 3 */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <InputField label="Mật khẩu mới" name="password" type="password" placeholder="Nhập mật khẩu mới..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;