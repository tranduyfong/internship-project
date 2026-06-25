// src/container/Header.tsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import HeaderNav from './header/HeaderNav';
import HeaderActions from './header/HeaderActions';
import HeaderMobileDrawer from './header/HeaderMobileDrawer';

import useHideOnScroll from '../hooks/useHideOnScroll';
import { logoutSuccess } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import type { RootState } from '../app/store';

const Header: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const headerRef = useRef<HTMLElement>(null);
    useHideOnScroll(headerRef);

    // Lấy danh sách cartItems thật từ Redux
    const { user } = useSelector((state: RootState) => state.auth);
    const { cartItems } = useSelector((state: RootState) => state.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Tính số lượng hiển thị trên icon giỏ hàng
    const actualCartCount = cartItems ? cartItems.length : 0;

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
        <header ref={headerRef} className="bg-white shadow-sm sticky-top">
            <div className="container d-flex align-items-center justify-content-between py-3">
                <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                    <IconButton onClick={() => setMobileOpen(true)} color="inherit"><MenuIcon /></IconButton>
                </Box>

                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                    <h2 style={{ fontWeight: 900, fontStyle: 'italic', margin: 0, fontSize: '2rem' }}>beck.</h2>
                </Link>

                <HeaderNav links={navLinks} />

                {/* Truyền số lượng thực tế xuống Component con để hiển thị */}
                <HeaderActions
                    user={user}
                    cartCount={actualCartCount}
                    isHovered={isHovered}
                    setIsHovered={setIsHovered}
                    onLogout={handleLogout}
                />
            </div>

            <HeaderMobileDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                links={navLinks}
                user={user}
                onLogout={handleLogout}
            />
        </header>
    );
};

export default Header;