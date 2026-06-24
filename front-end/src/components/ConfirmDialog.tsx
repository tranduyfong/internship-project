import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string | React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onConfirm,
    onCancel,
    confirmText = 'Đồng ý',
    cancelText = 'Hủy',
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            sx={{ '& .MuiPaper-root': { fontFamily: 'Quicksand', borderRadius: 2, padding: 1, minWidth: '300px' } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontFamily: 'Quicksand', color: '#555' }}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ pb: 2, pr: 3 }}>
                <Button onClick={onCancel} sx={{ color: '#666', fontWeight: 'bold', fontFamily: 'Quicksand' }}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontFamily: 'Quicksand',
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;