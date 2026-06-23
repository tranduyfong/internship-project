import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import { registerRequest } from '../../store/actions';
import type { RootState } from '../../app/store';

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerRequest(form));
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: '500px' }}>
                <h2 className="text-center fw-bold mb-4" style={{ color: '#2c3e50' }}>Đăng ký tài khoản</h2>
                <div className="card border-0 shadow-sm p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <InputField label="Họ và tên" name="name" placeholder="Ví dụ: Nguyễn Văn A" value={form.name} onChange={handleChange} />
                        <InputField label="Số điện thoại" name="phone" placeholder="Ví dụ: 0987654321" value={form.phone} onChange={handleChange} />
                        <InputField label="Email" name="email" placeholder="Ví dụ: abc@gmail.com" value={form.email} onChange={handleChange} />
                        <InputField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} />

                        <button type="submit" className="btn w-100 fw-bold mt-3 mb-3" style={{ backgroundColor: '#ffb300', color: 'black' }} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                        <div className="text-center" style={{ fontSize: '14px' }}>
                            <span className="text-muted">Đã có tài khoản? </span>
                            <Link to="/dang-nhap" className="text-decoration-none" style={{ color: '#007bff' }}>Đăng nhập</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;