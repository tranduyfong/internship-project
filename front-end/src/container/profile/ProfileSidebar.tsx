import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';

interface ProfileSidebarProps {
    activeTab: 'info' | 'address';
    setActiveTab: (tab: 'info' | 'address') => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, border: '1px solid #eee', overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'Quicksand' }}>TÀI KHOẢN CỦA BẠN</Typography>
            </Box>
            <List component="nav" sx={{ p: 0 }}>
                <ListItemButton selected={activeTab === 'info'} onClick={() => setActiveTab('info')} sx={{ borderBottom: '1px solid #eee', '&.Mui-selected': { backgroundColor: '#fff8e1', borderLeft: '4px solid #ffb300' } }}>
                    <ListItemText primary={<Typography sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: activeTab === 'info' ? 'bold' : 'normal' }}>Thông tin tài khoản</Typography>} />
                </ListItemButton>
                <ListItemButton selected={activeTab === 'address'} onClick={() => setActiveTab('address')} sx={{ '&.Mui-selected': { backgroundColor: '#fff8e1', borderLeft: '4px solid #ffb300' } }}>
                    <ListItemText primary={<Typography sx={{ fontFamily: 'Quicksand', fontSize: '14px', fontWeight: activeTab === 'address' ? 'bold' : 'normal' }}>Sổ địa chỉ</Typography>} />
                </ListItemButton>
            </List>
        </Box>
    );
};
export default ProfileSidebar;