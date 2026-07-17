import { useState } from 'react';
import { Button, Box, Typography, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await authService.login(email, password);
            if (res.code === "SUCCESS") {
                // Lưu token
                localStorage.setItem('access_token', res.data.accessToken);
                // Có thể lưu thông tin user để dùng ở Header
                localStorage.setItem('user_info', JSON.stringify(res.data.user));
                navigate('/'); // Điều hướng vào Admin
            } else {
                setError(res.message);
            }
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f8' }}>
            <Box className="card p-5 shadow text-center" sx={{ width: 400, borderRadius: 2 }}>

                {/* Đã sửa: Chuyển fontWeight và mb vào trong sx */}
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 4 }}>
                    Đăng nhập Admin
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Mật khẩu"
                    type="password"
                    margin="normal"
                    sx={{ mb: 3 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ py: 1.5, textTransform: 'none', fontSize: 16 }}
                >
                    {loading ? 'Đang xác thực...' : 'Đăng nhập'}
                </Button>
            </Box>
        </Box>
    );
};

export default LoginPage;