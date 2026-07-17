import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import type { User } from '../types/types';

const HeaderContainer = () => {
    const [user, setUser] = useState<User | null>(null);

    // Lấy thông tin user từ localStorage khi Header vừa render
    useEffect(() => {
        const userInfoString = localStorage.getItem('user_info');
        if (userInfoString) {
            try {
                const userInfoParsed = JSON.parse(userInfoString);
                setUser(userInfoParsed);
            } catch (error) {
                console.error("Lỗi khi đọc thông tin user", error);
            }
        }
    }, []);

    // Hàm chuyển đổi mã chức vụ sang tên tiếng Việt
    const getRoleName = (roleCode?: string) => {
        switch (roleCode) {
            case 'admin':
                return 'Quản lý';
            case 'staff':
                return 'Nhân viên';
            default:
                return 'Không xác định';
        }
    };

    return (
        <AppBar position="static" elevation={0} sx={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Vùng trống bên trái Header để đẩy thông tin user sang bên phải */}
                <Box sx={{ flexGrow: 1 }}></Box>

                {/* Khối thông tin User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#333' }}>
                            Xin chào: {user?.name || 'Đang tải...'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                            {getRoleName(user?.role)}
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderContainer;