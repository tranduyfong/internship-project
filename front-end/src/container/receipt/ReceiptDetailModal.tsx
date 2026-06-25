import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Chip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Receipt } from '../../types/receipt';

interface ReceiptDetailModalProps {
    open: boolean;
    onClose: () => void;
    receipt: Receipt | null;
    getStatusColor: (status?: string) => any;
    getVietnameseStatus: (status?: string) => string;
    onRepay: (receipt: Receipt) => void;
}

const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({ open, onClose, receipt, getStatusColor, getVietnameseStatus, onRepay }) => {
    if (!receipt) return null;

    const isUnpaidVNPay = receipt.payment_method.toUpperCase() === 'VNPAY' &&
        receipt.payment_status.toUpperCase() === 'PENDING';

    const getImageUrl = (src: string) => src.startsWith('/') ? `http://localhost:8000${src}` : src;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontFamily: 'Quicksand', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Chi tiết đơn hàng #{receipt.order_code}
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>Thông tin người nhận:</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}><strong>{receipt.shipping_full_name}</strong> - {receipt.shipping_phone}</Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>{receipt.shipping_address}</Typography>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                        <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>Trạng thái đơn hàng:</Typography>
                        <Chip
                            label={getVietnameseStatus(receipt.order_status)}
                            color={getStatusColor(receipt.order_status)}
                            sx={{ fontWeight: 'bold', borderRadius: '6px', mb: 1 }}
                        />

                        <Typography sx={{ fontSize: '13px', color: '#666' }}>
                            Thanh toán: <strong style={{ color: receipt.payment_status.toUpperCase() === 'PENDING' ? '#d32f2f' : '#2e7d32' }}>
                                {getVietnameseStatus(receipt.payment_status)}
                            </strong>
                        </Typography>
                    </div>
                </div>

                <Typography sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>Sản phẩm đã đặt:</Typography>
                {(!receipt.items || receipt.items.length === 0) && (
                    <Typography variant="body2" color="error">Không tải được danh sách sản phẩm.</Typography>
                )}

                {(receipt.items || []).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 2, pb: 2, borderBottom: '1px dashed #eee' }}>
                        <img
                            src={getImageUrl(item.img_src)}
                            alt={item.name_product}
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16, border: '1px solid #f5f5f5' }}
                            onError={(e) => { e.currentTarget.src = '/placeholder.png' }}
                        />
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{item.name_product}</Typography>
                            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Size: {item.size} | Số lượng: x{item.quantity}</Typography>
                            <Typography sx={{ fontWeight: 'bold', color: '#d32f2f', mt: 1 }}>
                                {Number(item.price_at_time || 0).toLocaleString('vi-VN')}đ
                            </Typography>
                        </Box>
                    </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <Box>
                        {isUnpaidVNPay && (
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ffb300',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    boxShadow: 'none',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#e6a100' }
                                }}
                                onClick={() => onRepay(receipt)}
                            >
                                Tiếp tục thanh toán VNPay
                            </Button>
                        )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: '900', color: '#333' }}>
                        Tổng cộng: <span style={{ color: '#d32f2f' }}>{Number(receipt.total_amount || 0).toLocaleString('vi-VN')}đ</span>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptDetailModal;