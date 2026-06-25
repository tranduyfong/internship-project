import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';

import type { RootState } from '../app/store';
import { getMyReceiptsRequest, repayRequest } from '../store/actions/receiptActions';
import type { Receipt } from '../types/receipt';

import ReceiptTable from '../container/receipt/ReceiptTable';
import ReceiptDetailModal from '../container/receipt/ReceiptDetailModal';

const ReceiptPage: React.FC = () => {
    const dispatch = useDispatch();
    const { receipts, receiptLoading } = useSelector((state: RootState) => state.receipt);

    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

    useEffect(() => {
        dispatch(getMyReceiptsRequest());
    }, [dispatch]);

    // Hàm quy định màu sắc cho Chip
    const getStatusColor = (status?: string) => {
        if (!status) return 'default';
        switch (status.toUpperCase()) {
            case 'PENDING': return 'warning';
            case 'PROCESSING': return 'info';
            case 'PAID': return 'success';
            case 'SHIPPING': return 'info';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    // BỘ DỊCH THUẬT: Chuyển đổi tiếng Anh của Backend sang tiếng Việt
    const getVietnameseStatus = (status?: string) => {
        if (!status) return 'Không xác định';
        switch (status.toUpperCase()) {
            case 'PENDING': return 'Chờ xử lý';
            case 'PROCESSING': return 'Đang xử lý';
            case 'PAID': return 'Đã thanh toán';
            case 'UNPAID': return 'Chưa thanh toán';
            case 'SHIPPING': return 'Đang giao hàng';
            case 'COMPLETED': return 'Đã hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
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
                <ReceiptTable
                    receipts={receipts}
                    onViewDetail={(receipt) => setSelectedReceipt(receipt)}
                    getStatusColor={getStatusColor}
                    getVietnameseStatus={getVietnameseStatus}
                    onRepay={handleRepay}
                />
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