// src/container/Header.tsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, IconButton, Collapse, InputBase } from '@mui/material';
import { Menu as MenuIcon, Search } from '@mui/icons-material';

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

    // Thêm các state cho phần tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

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

    // Hàm điều hướng tìm kiếm chung
    const handleSearchSubmit = () => {
        if (keyword.trim()) {
            navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword.trim())}`);
            setShowMobileSearch(false); // Ẩn dropdown mobile sau khi tìm kiếm
        }
    };

    const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
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

                {/* Truyền thêm các props tìm kiếm xuống HeaderActions */}
                <HeaderActions
                    user={user}
                    cartCount={actualCartCount}
                    isHovered={isHovered}
                    setIsHovered={setIsHovered}
                    onLogout={handleLogout}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    handleSearchSubmit={handleSearchSubmit}
                    toggleMobileSearch={() => setShowMobileSearch(!showMobileSearch)}
                />
            </div>

            {/* Màn hình Mobile: Form tìm kiếm trượt xuống từ Header */}
            <Collapse in={showMobileSearch} timeout="auto" unmountOnExit>
                <Box sx={{ px: 2, py: 2, backgroundColor: '#fdfdfd', borderTop: '1px solid #eee', display: { md: 'none' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f3f4', borderRadius: '20px', padding: '2px 15px' }}>
                        <InputBase
                            placeholder="Nhập tên sản phẩm..."
                            sx={{ flex: 1, fontFamily: 'Quicksand', fontSize: '14px' }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleMobileKeyDown}
                            autoFocus
                        />
                        <IconButton size="small" onClick={handleSearchSubmit}>
                            <Search fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Collapse>

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