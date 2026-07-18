import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useBanners } from '../hooks/useBanners';
import BannerTable from '../containers/banner/BannerTable';
import BannerFormModal from '../components/BannerFormModal';
import ConfirmModal from '../components/ConfirmModal';
import { AuthButton } from '../components/ActionButtons';
import type { Banner, Permission } from '../types/types';

interface BannerPageProps {
    userPermissions: Permission[];
}

const BannerPage = ({ userPermissions }: BannerPageProps) => {
    const { banners, loading, addBanner, updateBanner, removeBanner } = useBanners();

    // State cho Modals
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

    // Quyền truy cập
    const canAdd = userPermissions.some(p => p.code === 'VIEW_BANNER'); // Thay bằng mã quyền ADD_BANNER nếu BE có quy định cụ thể
    const canEdit = userPermissions.some(p => p.code === 'VIEW_BANNER');
    const canDelete = userPermissions.some(p => p.code === 'VIEW_BANNER');

    // Mở Form
    const handleOpenAdd = () => {
        setSelectedBanner(null);
        setOpenFormModal(true);
    };

    const handleOpenEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setOpenFormModal(true);
    };

    // Xử lý Submit chung (Component con sẽ truyền `isEditMode` ra)
    const handleSubmitForm = async (data: any, isEditMode: boolean) => {
        let success = false;
        if (isEditMode && selectedBanner) {
            success = await updateBanner(selectedBanner.id, data);
        } else {
            success = await addBanner(data as FormData);
        }

        if (success) {
            setOpenFormModal(false);
        }
    };

    // Xử lý Xóa
    const handleConfirmDelete = async () => {
        if (!bannerToDelete) return;
        await removeBanner(bannerToDelete.id);
        setOpenDeleteModal(false);
    };

    return (
        <Box className="card p-4 shadow-sm border-0">
            {/* Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>Quản lý Ảnh Banner</Typography>
                <AuthButton
                    hasPermission={canAdd}
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ textTransform: 'none', backgroundColor: canAdd ? '#1976d2' : undefined }}
                >
                    Thêm Banner
                </AuthButton>
            </Box>

            {/* Bảng Dữ Liệu */}
            <BannerTable
                loading={loading}
                banners={banners}
                canEdit={canEdit}
                canDelete={canDelete}
                onEditClick={handleOpenEdit}
                onDeleteClick={(banner) => {
                    setBannerToDelete(banner);
                    setOpenDeleteModal(true);
                }}
            />

            {/* Modal Thêm/Sửa */}
            <BannerFormModal
                open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                onSubmit={handleSubmitForm}
                initialData={selectedBanner}
            />

            {/* Modal Xác nhận xóa */}
            <ConfirmModal
                open={openDeleteModal}
                title="Xác nhận xóa Banner"
                content="Bạn có chắc chắn muốn xóa ảnh Banner này khỏi hệ thống? Hành động này không thể hoàn tác."
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default BannerPage;