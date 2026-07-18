import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';
import FormInput from './FormInput';
import type { Banner } from '../types/types';

interface BannerFormModalProps {
    open: boolean;
    onClose: () => void;
    // Hàm Submit sẽ trả về type là any vì lúc thì là FormData (POST), lúc là Object JSON (PUT)
    onSubmit: (data: any, isEditMode: boolean) => Promise<void>;
    initialData?: Banner | null;
}

const BannerFormModal = ({ open, onClose, onSubmit, initialData }: BannerFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;

    const [formValues, setFormValues] = useState({
        target_link: '',
        display_order: 0,
        status: 'ACTIVE'
    });

    // File upload chỉ dùng cho Thêm mới
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (open && initialData) {
            setFormValues({
                target_link: initialData.target_link || '',
                display_order: initialData.display_order || 0,
                status: initialData.status || 'ACTIVE'
            });
            // Hiển thị ảnh cũ để xem tạm
            setPreviewUrl(`http://localhost:8000${initialData.image_url}`);
            setImageFile(null);
        } else if (open && !initialData) {
            setFormValues({ target_link: '', display_order: 0, status: 'ACTIVE' });
            setImageFile(null);
            setPreviewUrl('');
        }
    }, [open, initialData]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Tạo URL ảo để preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isEditMode && !imageFile) {
            toast.warning("Vui lòng chọn ảnh Banner!");
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                // SỬA: Gửi Object JSON
                const updatePayload = {
                    target_link: formValues.target_link,
                    display_order: Number(formValues.display_order),
                    status: formValues.status
                };
                await onSubmit(updatePayload, true);
            } else {
                // THÊM: Gửi FormData
                const formData = new FormData();
                formData.append('file', imageFile as File);
                formData.append('target_link', formValues.target_link);
                await onSubmit(formData, false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
                {isEditMode ? "Cập nhật Banner" : "Thêm Banner mới"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, backgroundColor: '#fafafa' }}>
                    <Box className="card p-4 shadow-sm border-0 mb-3">

                        {/* Chỉ hiện nút Upload khi Thêm Mới */}
                        {!isEditMode && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Ảnh Banner *</Typography>
                                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth sx={{ textTransform: 'none', py: 1.5, borderStyle: 'dashed' }}>
                                    Tải ảnh lên
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </Button>
                            </Box>
                        )}

                        {/* Hiển thị ảnh xem trước */}
                        {previewUrl && (
                            <Box sx={{ mb: 3, width: '100%', height: 120, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
                                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        )}

                        <FormInput label="Đường link đích (Target Link) *" name="target_link" value={formValues.target_link} onChange={handleTextChange} required />

                        {/* Các trường trạng thái, thứ tự chỉ hiện khi Cập nhật (theo API) */}
                        {isEditMode && (
                            <>
                                <FormInput label="Thứ tự hiển thị (Ví dụ: 0, 1, 2...)" name="display_order" type="number" value={formValues.display_order} onChange={handleTextChange} required />

                                <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                                    <FormLabel component="legend" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary' }}>Trạng thái</FormLabel>
                                    <RadioGroup row name="status" value={formValues.status} onChange={handleTextChange}>
                                        <FormControlLabel value="ACTIVE" control={<Radio size="small" />} label="Đang bật" />
                                        <FormControlLabel value="INACTIVE" control={<Radio size="small" />} label="Đang ẩn" />
                                    </RadioGroup>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
                    <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', px: 3 }}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none', px: 4 }}>
                        {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BannerFormModal;