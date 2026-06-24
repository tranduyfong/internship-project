import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, IconButton, InputBase, MenuItem, MenuList, Typography } from '@mui/material';
import { Search, ShoppingCartOutlined, PersonOutlined } from '@mui/icons-material';

interface HeaderActionsProps {
    user: any;
    cartCount: number;
    isHovered: boolean;
    setIsHovered: (val: boolean) => void;
    onLogout: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ user, cartCount, isHovered, setIsHovered, onLogout }) => {
    return (
        <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Tìm kiếm */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', backgroundColor: '#f1f3f4', borderRadius: '20px', padding: '2px 15px', width: '250px' }}>
                <InputBase placeholder="Tìm kiếm..." sx={{ flex: 1, fontFamily: 'Quicksand', fontSize: '14px' }} />
                <IconButton size="small"><Search fontSize="small" /></IconButton>
            </Box>

            {/* Giỏ hàng */}
            <IconButton component={Link} to="/gio-hang" sx={{ color: 'black' }}>
                <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#ffb300', color: 'black', fontWeight: 'bold' } }}>
                    <ShoppingCartOutlined />
                </Badge>
            </IconButton>

            {/* Hover tài khoản */}
            <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'relative' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <IconButton sx={{ color: 'black', cursor: 'default' }} disableRipple>
                    <PersonOutlined />
                </IconButton>
                <Box sx={{ display: isHovered ? 'block' : 'none', position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 1000, minWidth: '220px', overflow: 'hidden' }}>
                    <MenuList sx={{ p: 0 }}>
                        {user ? (
                            <>
                                <MenuItem disabled sx={{ opacity: '1 !important', py: 1.5, borderBottom: '1px solid #eee' }}>
                                    <Typography style={{ fontFamily: 'Quicksand', fontSize: '14px', color: '#333' }}>
                                        Xin chào, <strong style={{ color: '#000', fontWeight: 'bold' }}>{user.name}</strong>
                                    </Typography>
                                </MenuItem>
                                <MenuItem component={Link} to="/tai-khoan" sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: 600, py: 1.5 }}>Thông tin cá nhân</MenuItem>
                                <MenuItem onClick={onLogout} sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: 600, py: 1.5, color: 'red' }}>Đăng xuất</MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem component={Link} to="/dang-nhap" sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: 600, py: 1.5 }}>Đăng nhập</MenuItem>
                                <MenuItem component={Link} to="/dang-ky" sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: 600, py: 1.5 }}>Đăng ký</MenuItem>
                            </>
                        )}
                    </MenuList>
                </Box>
            </Box>
        </div>
    );
};

export default HeaderActions;