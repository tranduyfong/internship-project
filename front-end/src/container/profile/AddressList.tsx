import React from 'react';
import { Box, Typography, Button, Divider, Chip, IconButton } from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material';
import type { UserAddress } from '../../types/user';

interface AddressListProps {
    addresses: UserAddress[];
    onSetDefault: (id: number) => void;
    onOpenAdd: () => void;
    onEdit: (address: UserAddress) => void;
    onDelete: (id: number) => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onSetDefault, onOpenAdd, onEdit, onDelete }) => {
    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, border: '1px solid #eee', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Quicksand' }}>Sổ địa chỉ</Typography>
                <Button variant="outlined" onClick={onOpenAdd} sx={{ borderColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand' }}>+ Thêm địa chỉ</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {addresses.map((addr) => (
                <Box key={addr.id} sx={{ mb: 3, pb: 3, borderBottom: '1px dashed #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '15px', mb: 0.5, fontFamily: 'Quicksand' }}>
                            {addr.more}
                            {addr.is_default === 1 && <Chip label="Mặc định" size="small" sx={{ ml: 2, backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', height: 20, fontSize: '11px' }} />}
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '14px', fontFamily: 'Quicksand' }}>{addr.village}, {addr.district}, {addr.city}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {addr.is_default !== 1 && (
                            <Button size="small" onClick={() => onSetDefault(addr.id)} sx={{ color: '#1976d2', fontFamily: 'Quicksand', fontWeight: 'bold', border: '1px solid #1976d2', mr: 1 }}>
                                Thiết lập mặc định
                            </Button>
                        )}
                        <IconButton onClick={() => onEdit(addr)} size="small" sx={{ color: '#ffb300' }}><EditOutlined fontSize="small" /></IconButton>
                        <IconButton onClick={() => onDelete(addr.id)} size="small" sx={{ color: '#d32f2f' }}><DeleteOutlined fontSize="small" /></IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};
export default AddressList;