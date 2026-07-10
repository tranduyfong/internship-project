import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

import type { RootState } from '../app/store';
import { getMyReceiptsRequest, repayRequest } from '../store/actions/receiptActions';
import type { Receipt } from '../types/receipt';

import ReceiptTable from '../container/receipt/ReceiptTable';
import ReceiptDetailModal from '../container/receipt/ReceiptDetailModal';

const ReceiptPage: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { receipts, receiptLoading, totalPages } = useSelector((state: RootState) => state.receipt);

    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Kéo dữ liệu khi có user
    useEffect(() => {
        if (user) {
            dispatch(getMyReceiptsRequest({ page: currentPage + 1, limit: 5 }));
        }
    }, [dispatch, user, currentPage]);

    if (!user) {
        return <Navigate to="/dang-nhap" replace />;
    }

    const getStatusColor = (status?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getVietnameseStatus = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Chờ thanh toán';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy';
            default: return status || 'Không rõ';
        }
    };

    const handleRepay = (receipt: Receipt) => {
        dispatch(repayRequest(receipt.id));
    };

    return (
        <Box className="container" sx={{ mt: 5, mb: 10, fontFamily: 'Quicksand' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
                Kiểm tra đơn hàng
            </Typography>

            {receiptLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress sx={{ color: '#ffb300' }} />
                </Box>
            ) : receipts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography>Bạn chưa có đơn hàng nào.</Typography>
                </Box>
            ) : (
                <>
                    <ReceiptTable
                        receipts={receipts}
                        onViewDetail={(receipt) => setSelectedReceipt(receipt)}
                        getStatusColor={getStatusColor}
                        getVietnameseStatus={getVietnameseStatus}
                        onRepay={handleRepay}
                    />

                    {/* HIỂN THỊ PHÂN TRANG */}
                    {totalPages > 1 && (
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </Box>
                    )}
                </>
            )}

            <ReceiptDetailModal
                open={!!selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                receipt={selectedReceipt}
                getStatusColor={getStatusColor}
                getVietnameseStatus={getVietnameseStatus}
                onRepay={handleRepay}
            />
        </Box>
    );
};

export default ReceiptPage;