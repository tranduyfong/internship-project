import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import type { RootState } from '../../app/store';

import { forgotPasswordRequest, verifyOtpRequest, resetPasswordRequest } from '../../store/actions/authActions';
import { setStep } from '../../store/slices/authSlice';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState(''); // Thêm state cho mật khẩu mới

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { step, emailForReset, authLoading: loading } = useSelector((state: RootState) => state.auth);

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(forgotPasswordRequest({ email }));
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailForReset) {
            dispatch(verifyOtpRequest({ email: emailForReset, otp }));
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailForReset) {
            // Truyền lên Object chứa cả email và mật khẩu mới
            dispatch(resetPasswordRequest({ email: emailForReset, password: newPassword }));
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

                        {/* BƯỚC 1: NHẬP EMAIL */}
                        {step === 1 && (
                            <form onSubmit={handleSendEmail}>
                                <InputField label="Tên đăng nhập" name="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                                </button>
                                <div className="text-center">
                                    <span onClick={() => navigate('/dang-nhap')} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Quay lại đăng nhập</span>
                                </div>
                            </form>
                        )}

                        {/* BƯỚC 2: NHẬP OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP}>
                                <p className="text-muted" style={{ fontSize: '14px' }}>Vui lòng nhập mã OTP vừa được gửi đến email <strong>{emailForReset}</strong></p>
                                <InputField label="Mã OTP" name="otp" placeholder="Nhập mã OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                                </button>
                                <div className="text-center">
                                    <span onClick={() => dispatch(setStep(1))} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Thử lại email khác</span>
                                </div>
                            </form>
                        )}

                        {/* BƯỚC 3: NHẬP MẬT KHẨU MỚI (Vừa được bổ sung) */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <p className="text-muted" style={{ fontSize: '14px' }}>Mã OTP đã hợp lệ. Vui lòng tạo mật khẩu mới cho tài khoản của bạn.</p>
                                <InputField label="Mật khẩu mới" name="password" type="password" placeholder="Nhập mật khẩu mới..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">KHÁCH HÀNG MỚI</h6>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                            Bằng cách tạo một tài khoản với cửa hàng của chúng tôi, bạn sẽ có thể thực hiện những quy trình mua hàng nhanh hơn...
                        </p>
                        <button onClick={() => navigate('/dang-ky')} className="btn w-100 fw-bold mt-auto" style={{ backgroundColor: '#ffb300', color: 'black' }}>
                            Tạo tài khoản mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;