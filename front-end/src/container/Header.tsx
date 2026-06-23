import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Box, IconButton, InputBase, MenuItem, MenuList, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Typography } from '@mui/material';
import { Search, ShoppingCartOutlined, PersonOutlined, Menu as MenuIcon, Login, Logout } from '@mui/icons-material';
import type { RootState } from '../app/store';
import { logoutSuccess } from '../store/slice';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutSuccess());
        toast.info('Đã đăng xuất!');
        navigate('/dang-nhap');
    };

    const navLinks = [
        { title: 'TRANG CHỦ', path: '/' },
        { title: 'SẢN PHẨM', path: '/san-pham' },
        { title: 'GIỚI THIỆU', path: '/gioi-thieu' },
        { title: 'LIÊN HỆ', path: '/lien-he' },
        { title: 'KIỂM TRA ĐƠN HÀNG', path: '/kiem-tra-don-hang' },
    ];

    return (
        <header className="bg-white shadow-sm sticky-top">
            <div className="container d-flex align-items-center justify-content-between py-3">

                {/* Hamburger cho Mobile */}
                <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                    <IconButton onClick={() => setMobileOpen(true)} color="inherit">
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                    <h2 style={{ fontWeight: 900, fontStyle: 'italic', margin: 0, fontSize: '2rem' }}>beck.</h2>
                </Link>

                {/* Navigation cho Desktop */}
                <nav className="d-none d-lg-flex gap-4">
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} className="nav-link fw-bold text-dark">{link.title}</Link>
                    ))}
                </nav>

                {/* Actions Desktop */}
                <div className="d-flex align-items-center gap-2 gap-md-3">
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', backgroundColor: '#f1f3f4', borderRadius: '20px', padding: '2px 15px', width: '250px' }}>
                        <InputBase placeholder="Tìm kiếm..." sx={{ flex: 1, fontFamily: 'Quicksand', fontSize: '14px' }} />
                        <IconButton size="small"><Search fontSize="small" /></IconButton>
                    </Box>

                    <IconButton component={Link} to="/gio-hang" sx={{ color: 'black' }}>
                        <Badge badgeContent={0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#ffb300', color: 'black', fontWeight: 'bold' } }}>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>

                    {/* Vùng Hover tài khoản (Desktop) */}
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
                                        <MenuItem onClick={handleLogout} sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: 600, py: 1.5, color: 'red' }}>Đăng xuất</MenuItem>
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
            </div>

            {/* Sidebar Drawer cho Mobile */}
            <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation" onClick={() => setMobileOpen(false)}>
                    <div className="p-3">
                        <h2 style={{ fontWeight: 900, fontStyle: 'italic', margin: 0, fontSize: '2rem' }}>beck.</h2>
                    </div>
                    <Divider />
                    <List sx={{ flexGrow: 1 }}>
                        {navLinks.map((item) => (
                            <ListItem key={item.title} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    <ListItemText
                                        primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: 'bold', fontSize: '15px' }}>{item.title}</Typography>}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {user ? (
                            <>
                                <ListItem sx={{ py: 1, px: 2 }}>
                                    <Typography style={{ fontFamily: 'Quicksand', fontSize: '14px' }}>
                                        Xin chào, <strong style={{ fontWeight: 'bold' }}>{user.name}</strong>
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/tai-khoan">
                                        <ListItemIcon><PersonOutlined /></ListItemIcon>
                                        <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: '600', fontSize: '14px' }}>Thông tin cá nhân</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout}>
                                        <ListItemIcon><Logout sx={{ color: 'red' }} /></ListItemIcon>
                                        <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', color: 'red', fontWeight: 'bold', fontSize: '14px' }}>Đăng xuất</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : (
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/dang-nhap">
                                    <ListItemIcon><Login /></ListItemIcon>
                                    <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: 'bold', fontSize: '14px' }}>Đăng nhập / Đăng ký</Typography>} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </header>
    );
};

export default Header;