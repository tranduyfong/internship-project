import { useState } from 'react';
import { Button, Box, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.warning('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.login(email, password);
            if (res.code === "SUCCESS") {
                const userRole = res.data.user.role;
                if (userRole !== 'admin' && userRole !== 'staff') {
                    toast.error('Bạn không có quyền truy cập vào hệ thống quản trị!');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('access_token', res.data.accessToken);
                localStorage.setItem('user_info', JSON.stringify(res.data.user));

                toast.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                toast.error(res.message || 'Đăng nhập thất bại!');
            }
        } catch (err: any) {
            toast.error(err.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f8' }}>
            <Box className="card p-5 shadow text-center" sx={{ width: 400, borderRadius: 2 }}>

                <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 4 }}>
                    Đăng nhập Admin
                </Typography>

                <TextField fullWidth variant="outlined" label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth variant="outlined" label="Mật khẩu" type="password" margin="normal" sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)} />

                <Button variant="contained" fullWidth onClick={handleLogin} disabled={loading}
                    sx={{ py: 1.5, textTransform: 'none', fontSize: 16 }}
                >
                    {loading ? 'Đang xác thực...' : 'Đăng nhập'}
                </Button>
            </Box>
        </Box>
    );
};

export default LoginPage;