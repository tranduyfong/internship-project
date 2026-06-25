import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Box } from '@mui/material';
import type { Receipt } from '../../types/receipt';

interface ReceiptTableProps {
    receipts: Receipt[];
    onViewDetail: (receipt: Receipt) => void;
    getStatusColor: (status?: string) => any;
    getVietnameseStatus: (status?: string) => string;
    onRepay: (receipt: Receipt) => void;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ receipts, onViewDetail, getStatusColor, getVietnameseStatus, onRepay }) => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <Table sx={{ minWidth: 600 }}>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Mã ĐH</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Ngày đặt</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Thanh toán</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Tổng tiền</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map((receipt) => {
                        const isUnpaidVNPay = receipt.payment_method.toUpperCase() === 'VNPAY' &&
                            receipt.payment_status.toUpperCase() === 'PENDING';

                        return (
                            <TableRow key={receipt.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>#{receipt.order_code}</TableCell>
                                <TableCell>{new Date(receipt.created_at).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>{receipt.payment_method.toUpperCase()}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                    {Number(receipt.total_amount || 0).toLocaleString('vi-VN')}đ
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getVietnameseStatus(receipt.order_status)}
                                        color={getStatusColor(receipt.order_status)}
                                        size="small"
                                        sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        {/* Nút Chi tiết: Đổi sang dạng Outlined thanh lịch */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: '#ccc',
                                                color: '#333',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                '&:hover': { borderColor: '#999', backgroundColor: '#f5f5f5' }
                                            }}
                                            onClick={() => onViewDetail(receipt)}
                                        >
                                            Chi tiết
                                        </Button>

                                        {/* Nút Thanh toán lại: Đổi sang màu vàng chủ đạo của web */}
                                        {isUnpaidVNPay && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#ffb300',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    boxShadow: 'none',
                                                    textTransform: 'none',
                                                    '&:hover': { backgroundColor: '#e6a100', boxShadow: 'none' }
                                                }}
                                                onClick={() => onRepay(receipt)}
                                            >
                                                Thanh toán lại
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReceiptTable;