import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import ProfileSidebar from '../container/profile/ProfileSidebar';
import ProfileInfoForm from '../container/profile/ProfileInfoForm';
import AddressList from '../container/profile/AddressList';
import AddressFormDialog from '../container/profile/AddressFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';

import { fetchProfileRequest, updateProfileRequest, addAddressRequest, updateAddressRequest, deleteAddressRequest, setDefaultAddressRequest } from '../store/actions';
import type { RootState } from '../app/store';
import type { UserAddress } from '../types/user';

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const { user, fullProfile } = useSelector((state: RootState) => state.auth);

    const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

    // State quản lý Form thêm/sửa
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

    // State quản lý Xóa
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (user) dispatch(fetchProfileRequest());
    }, [dispatch, user]);

    const handleOpenAdd = () => {
        setEditingAddress(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (address: UserAddress) => {
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const handleSubmitAddress = (data: any) => {
        if (editingAddress) {
            dispatch(updateAddressRequest({ id: editingAddress.id, data }));
        } else {
            dispatch(addAddressRequest(data));
        }
        setDialogOpen(false);
    };

    const confirmDelete = (id: number) => {
        setAddressToDelete(id);
        setConfirmDeleteOpen(true);
    };

    const executeDelete = () => {
        if (addressToDelete !== null) dispatch(deleteAddressRequest(addressToDelete));
        setConfirmDeleteOpen(false);
        setAddressToDelete(null);
    };

    if (!user) return <Navigate to="/dang-nhap" />;
    if (!fullProfile) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#ffb300' }} /></Box>;

    return (
        <Box sx={{ mt: 5, mb: 10, fontFamily: 'Quicksand' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>TÀI KHOẢN</Typography>
            <div className="row g-4">
                <div className="col-12 col-md-4 col-lg-3">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="col-12 col-md-8 col-lg-9">
                    {activeTab === 'info' && (
                        <ProfileInfoForm profile={fullProfile} onUpdate={(name, phone) => dispatch(updateProfileRequest({ name, phone }))} />
                    )}
                    {activeTab === 'address' && (
                        <AddressList
                            addresses={fullProfile.addresses || []}
                            onSetDefault={(id) => dispatch(setDefaultAddressRequest(id))}
                            onOpenAdd={handleOpenAdd}
                            onEdit={handleOpenEdit}
                            onDelete={confirmDelete}
                        />
                    )}
                </div>
            </div>

            <AddressFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmitAddress}
                initialData={editingAddress}
            />

            {/* Tái sử dụng ConfirmDialog để xác nhận xóa */}
            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Xóa địa chỉ"
                content="Bạn có chắc chắn muốn xóa địa chỉ này khỏi sổ địa chỉ không?"
                onConfirm={executeDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
                confirmText="Đồng ý xóa"
            />
        </Box>
    );
};

export default ProfilePage;