import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmModal = ({ open, title, content, onClose, onConfirm }: ConfirmModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
            <DialogContent>
                <Typography>{content}</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>Hủy</Button>
                <Button onClick={onConfirm} variant="contained" color="error" sx={{ textTransform: 'none' }}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;