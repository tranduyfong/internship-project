import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CartTable from '../container/cart/CartTable';
import CartSummary from '../container/cart/CartSummary';
import ConfirmDialog from '../components/ConfirmDialog'; // Import Component dùng chung vừa tạo

import { fetchCartRequest, updateCartItemRequest, deleteCartItemRequest } from '../store/actions/cartActions';
import type { RootState } from '../app/store';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { cartItems, cartLoading } = useSelector((state: RootState) => state.cart);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // State quản lý việc mở Popup xác nhận xóa
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchCartRequest());
        }
    }, [dispatch, user]);

    useEffect(() => {
        const validIds = selectedIds.filter(id => cartItems.some(item => item.cart_id === id));
        if (validIds.length !== selectedIds.length) setSelectedIds(validIds);
    }, [cartItems]);

    const handleSelect = (cartId: number) => {
        setSelectedIds(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === cartItems.length) setSelectedIds([]);
        else setSelectedIds(cartItems.map(item => item.cart_id));
    };

    const totalAmount = useMemo(() => {
        return cartItems
            .filter(item => selectedIds.includes(item.cart_id))
            .reduce((sum, item) => sum + (parseFloat(item.price_product) * item.quantity), 0);
    }, [cartItems, selectedIds]);

    // Logic gọi Hộp thoại Xóa
    const confirmDelete = (cartId: number) => {
        setItemToDelete(cartId);
        setDeleteDialogOpen(true);
    };

    const executeDelete = () => {
        if (itemToDelete !== null) {
            dispatch(deleteCartItemRequest(itemToDelete));
            setSelectedIds(prev => prev.filter(id => id !== itemToDelete));
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ fontFamily: 'Quicksand', mb: 2 }}>Vui lòng đăng nhập để xem giỏ hàng</Typography>
                <Link to="/dang-nhap" className="btn btn-dark">Đăng nhập</Link>
            </Box>
        );
    }

    // Hàm xử lý nút MUA NGAY trong giỏ hàng
    const handleGoToCheckout = () => {
        // Lọc ra các sản phẩm đã được tích chọn trong bảng
        const itemsToCheckout = cartItems
            .filter(item => selectedIds.includes(item.cart_id))
            .map(item => ({
                id: item.product_id,
                name: item.name_product,
                size: item.size,
                quantity: item.quantity,
                price: parseFloat(item.price_product),
                image: item.cover_image
            }));

        navigate('/thanh-toan', { state: { checkoutItems: itemsToCheckout } });
    };

    return (
        <Box sx={{ mb: 10, mt: 3, fontFamily: 'Quicksand' }}>
            <Typography sx={{ color: '#666', fontSize: '13px', mb: 3 }}>
                <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Trang chủ</Link> | <span style={{ fontWeight: 'bold', color: '#ffb300' }}>Giỏ hàng</span>
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>
                GIỎ HÀNG
            </Typography>

            {cartLoading && cartItems.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: '#ffb300' }} /></Box>
            ) : cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: 2 }}>
                    <Typography sx={{ color: '#888', mb: 3 }}>Giỏ hàng của bạn đang trống</Typography>
                    <Link to="/" className="btn" style={{ backgroundColor: '#ffb300', fontWeight: 'bold' }}>Tiếp tục mua sắm</Link>
                </Box>
            ) : (
                <>
                    <CartTable
                        cartItems={cartItems}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                        onUpdateQuantity={(cartId, quantity) => dispatch(updateCartItemRequest({ cartId, quantity }))}
                        onDelete={confirmDelete}
                    />
                    <CartSummary
                        totalAmount={totalAmount}
                        totalSelectedItems={selectedIds.length}
                        onSubmit={handleGoToCheckout}
                    />
                </>
            )}

            {/* Gọi Component Tái sử dụng ở đây */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Xóa sản phẩm"
                content="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
                onConfirm={executeDelete}
                onCancel={cancelDelete}
                confirmText="Đồng ý xóa"
            />
        </Box>
    );
};

export default CartPage;