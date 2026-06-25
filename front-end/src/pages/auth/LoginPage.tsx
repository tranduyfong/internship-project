import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import type { RootState } from '../../app/store';
import { loginRequest } from '../../store/actions/authActions';

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authLoading: loading, user } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        // Nếu user đã tồn tại (đăng nhập thành công hoặc đã có phiên đăng nhập từ trước)
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginRequest(form));
    };

    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5" style={{ color: '#2c3e50' }}>Đăng nhập</h2>
            <div className="row justify-content-center g-4">
                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">ĐĂNG NHẬP</h6>
                        <form onSubmit={handleSubmit}>
                            <InputField label="Tên đăng nhập" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <InputField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} required />
                            <div className="mb-3">
                                <Link to="/quen-mat-khau" className="text-decoration-none" style={{ fontSize: '14px', color: '#007bff' }}>Quên mật khẩu?</Link>
                            </div>
                            <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">KHÁCH HÀNG MỚI</h6>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                            Bằng cách tạo một tài khoản với cửa hàng của chúng tôi, bạn sẽ có thể thực hiện những quy trình mua hàng nhanh hơn, lưu trữ nhiều địa chỉ gửi hàng, xem và theo dõi đơn đặt hàng của bạn và nhiều hơn nữa.
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

export default LoginPage;