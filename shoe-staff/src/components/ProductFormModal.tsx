import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, Alert,
    Grid, Radio, RadioGroup, FormControlLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';
import FormInput from './FormInput';
import ImagePreview from './ImagePreview';
import type { ProductImage } from '../types/types';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    title?: string;
    initialData?: any;
}

const ProductFormModal = ({ open, onClose, onSubmit, title = "Thêm mới sản phẩm", initialData }: ProductFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const [sizeError, setSizeError] = useState<string>('');
    // BỔ SUNG: State lưu trữ lỗi liên quan đến giá bán và giá nhập
    const [priceError, setPriceError] = useState<string>('');

    const [formValues, setFormValues] = useState({
        name_product: '',
        price_product: '',
        importPrice: '',
        descript_product: '',
        brand: 'Nike'
    });
    const [sizes, setSizes] = useState<{ size: string, quantity: string }[]>([{ size: '', quantity: '' }]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    useEffect(() => {
        setSizeError('');
        setPriceError(''); // BỔ SUNG: Reset lỗi giá khi mở/đóng modal

        if (initialData && open) {
            setFormValues({
                name_product: initialData.name_product || '',
                price_product: initialData.price_product || '',
                importPrice: initialData.import_price || '',
                descript_product: initialData.descript_product || '',
                brand: initialData.brand || 'Nike'
            });

            if (initialData.sizes && initialData.sizes.length > 0) {
                setSizes(initialData.sizes.map((s: any) => ({ size: s.size.toString(), quantity: s.quantity.toString() })));
            } else {
                setSizes([{ size: '', quantity: '' }]);
            }

            setExistingImages(initialData.images || []);
            setNewImages([]);
            setDeletedImageIds([]);
        } else if (!open) {
            setFormValues({ name_product: '', price_product: '', importPrice: '', descript_product: '', brand: 'Nike' });
            setSizes([{ size: '', quantity: '' }]);
            setNewImages([]);
            setExistingImages([]);
            setDeletedImageIds([]);
        }
    }, [initialData, open]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));

        // BỔ SUNG: Tự động xóa cảnh báo lỗi khi người dùng đang chỉnh sửa lại ô Giá nhập hoặc Giá bán
        if (name === 'importPrice' || name === 'price_product') {
            setPriceError('');
        }
    };

    const handleSizeChange = (index: number, field: 'size' | 'quantity', value: string) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const addSizeRow = () => setSizes([...sizes, { size: '', quantity: '' }]);
    const removeSizeRow = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...newFiles]);
            e.target.value = '';
        }
    };

    const handleRemoveNewImage = (indexToRemove: number) => {
        setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveExistingImage = (imageId: number) => {
        setDeletedImageIds(prev => [...prev, imageId]);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // BỔ SUNG: Chuyển đổi sang số thực để kiểm tra hợp lệ Giá Bán và Giá Nhập[cite: 17]
        const importPriceNum = Number(formValues.importPrice);
        const sellingPriceNum = Number(formValues.price_product);

        // Kiểm tra xem giá bán có thấp hơn giá nhập hay không
        if (sellingPriceNum < importPriceNum) {
            const errorMsg = "Giá bán không được phép thấp hơn Giá nhập vào!";
            setPriceError(errorMsg);
            toast.error(errorMsg); // Hiển thị thông báo toast lỗi cho người dùng[cite: 17]
            return; // Chặn không cho lưu xuống Backend[cite: 17]
        }

        const sizeValues = sizes
            .filter(item => item.size.trim() !== '')
            .map(item => item.size);

        const hasDuplicates = new Set(sizeValues).size !== sizeValues.length;

        if (hasDuplicates) {
            toast.error("Không được nhập các Size trùng nhau. Vui lòng kiểm tra lại!");
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('name_product', formValues.name_product);
        data.append('price_product', formValues.price_product);
        data.append('importPrice', formValues.importPrice);
        data.append('descript_product', formValues.descript_product);
        data.append('brand', formValues.brand);

        const formattedSizes = sizes
            .filter(s => s.size && s.quantity)
            .map(s => ({ size: Number(s.size), quantity: Number(s.quantity) }));
        data.append('sizes', JSON.stringify(formattedSizes));

        newImages.forEach(img => {
            data.append('images', img);
        });

        if (deletedImageIds.length > 0) {
            data.append('deletedImageIds', JSON.stringify(deletedImageIds));
        }

        await onSubmit(data);
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>{title}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, backgroundColor: '#fafafa' }}>
                    <Grid container spacing={5}>
                        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                            <Box className="card p-4 shadow-sm border-0">
                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Thông tin cơ bản</Typography>

                                <FormInput label="Tên sản phẩm" name="name_product" value={formValues.name_product} onChange={handleTextChange} required />

                                <FormControl component="fieldset" sx={{ width: '100%', mt: 1, mb: 2, px: 1 }}>
                                    <RadioGroup row name="brand" value={formValues.brand} onChange={handleTextChange}>
                                        <FormControlLabel value="Nike" control={<Radio size="small" />} label="Nike" />
                                        <FormControlLabel value="Adidas" control={<Radio size="small" />} label="Adidas" />
                                        <FormControlLabel value="Puma" control={<Radio size="small" />} label="Puma" />
                                    </RadioGroup>
                                </FormControl>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                    <FormInput label="Giá nhập" name="importPrice" type="number" value={formValues.importPrice} onChange={handleTextChange} required />
                                    <FormInput label="Giá bán" name="price_product" type="number" value={formValues.price_product} onChange={handleTextChange} required />
                                </Box>

                                {/* BỔ SUNG: Hiển thị thông báo Alert màu đỏ nếu nhập sai giá[cite: 17] */}
                                {priceError && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {priceError}
                                    </Alert>
                                )}

                                <FormInput label="Mô tả sản phẩm" name="descript_product" value={formValues.descript_product} onChange={handleTextChange} multiline rows={5} sx={{ mb: 0 }} />
                            </Box>
                        </Grid>

                        <Grid sx={{ width: { xs: '100%', md: '41.6667%' } }}>
                            <Box className="card p-4 shadow-sm border-0 mb-4">
                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Phân loại Kích cỡ</Typography>

                                {sizeError && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {sizeError}
                                    </Alert>
                                )}

                                {sizes.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                                        <FormInput label="Size" type="number" value={item.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} sx={{ mt: 0, mb: 0 }} required />
                                        <FormInput label="Số lượng" type="number" value={item.quantity} onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)} sx={{ mt: 0, mb: 0 }} required />
                                        {sizes.length > 1 && (
                                            <IconButton color="error" size="small" onClick={() => removeSizeRow(index)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                                <Button size="small" onClick={addSizeRow} sx={{ textTransform: 'none', mt: 1, fontWeight: 600 }}>
                                    + Thêm phân loại kích cỡ
                                </Button>
                            </Box>

                            <Box className="card p-4 shadow-sm border-0">
                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Hình ảnh sản phẩm</Typography>

                                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth sx={{ textTransform: 'none', py: 1.5, borderStyle: 'dashed' }}>
                                    Chọn ảnh (Upload)
                                    <input type="file" multiple hidden accept="image/*" onChange={handleImageChange} />
                                </Button>

                                <ImagePreview
                                    existingImages={existingImages}
                                    newFiles={newImages}
                                    onRemoveExisting={handleRemoveExistingImage}
                                    onRemoveNew={handleRemoveNewImage}
                                />

                                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                                    Đã chọn: {newImages.length + existingImages.length} ảnh
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
                    <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', px: 3 }}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none', px: 4, py: 1 }}>
                        {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductFormModal;