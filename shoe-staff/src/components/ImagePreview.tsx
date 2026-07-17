import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ProductImage } from '../types/types';

// Xử lý ảnh mới tải lên (tạo URL ảo)
const NewImagePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return <PreviewCard src={previewUrl} onRemove={onRemove} />;
};

// Khung chứa dùng chung cho cả ảnh cũ và mới
const PreviewCard = ({ src, onRemove }: { src: string; onRemove: () => void }) => (
    <Box sx={{ position: 'relative', width: 80, height: 80 }}>
        <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
        <IconButton
            size="small"
            onClick={onRemove}
            sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', border: '1px solid #eee', padding: '2px', '&:hover': { backgroundColor: '#ffebee' } }}
        >
            <CloseIcon sx={{ fontSize: 14, color: '#d32f2f' }} />
        </IconButton>
    </Box>
);

interface ImagePreviewProps {
    existingImages?: ProductImage[];
    newFiles?: File[];
    onRemoveExisting?: (imageId: number) => void;
    onRemoveNew?: (index: number) => void;
}

const ImagePreview = ({ existingImages = [], newFiles = [], onRemoveExisting, onRemoveNew }: ImagePreviewProps) => {
    if (existingImages.length === 0 && newFiles.length === 0) return null;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {/* Hiển thị ảnh cũ có sẵn trên DB */}
            {existingImages.map((img) => (
                <PreviewCard
                    key={`existing-${img.id}`}
                    src={`http://localhost:8000${img.image_url}`}
                    onRemove={() => onRemoveExisting && onRemoveExisting(img.id)}
                />
            ))}

            {/* Hiển thị ảnh mới chọn */}
            {newFiles.map((file, index) => (
                <NewImagePreview key={`new-${file.name}-${index}`} file={file} onRemove={() => onRemoveNew && onRemoveNew(index)} />
            ))}
        </Box>
    );
};

export default ImagePreview;