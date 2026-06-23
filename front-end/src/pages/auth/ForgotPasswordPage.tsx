import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import { forgotPasswordRequest, verifyOtpRequest } from '../../store/actions';
import type { RootState } from '../../app/store';
import { setStep } from '../../store/slice';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { step, emailForReset, loading } = useSelector((state: RootState) => state.auth);

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(forgotPasswordRequest(email));
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailForReset) {
            dispatch(verifyOtpRequest({ email: emailForReset, otp }));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5" style={{ color: '#2c3e50' }}>Đăng nhập</h2>
            <div className="row justify-content-center g-4">
                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">{step === 1 ? 'QUÊN MẬT KHẨU' : 'XÁC NHẬN MÃ OTP'}</h6>

                        {step === 1 ? (
                            <form onSubmit={handleSendEmail}>
                                <InputField label="Tên đăng nhập" name="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi'}
                                </button>
                                <div className="text-center">
                                    <span onClick={() => navigate('/dang-nhap')} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Quay lại</span>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP}>
                                <p className="text-muted" style={{ fontSize: '14px' }}>Vui lòng nhập mã OTP vừa được gửi đến email của bạn</p>
                                <InputField label="Mã OTP" name="otp" placeholder="Nhập mã OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                <button type="submit" className="btn w-100 fw-bold mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                    {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                                </button>
                                <div className="text-center">
                                    <span onClick={() => dispatch(setStep(1))} style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer' }}>Thử lại email khác</span>
                                </div>
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