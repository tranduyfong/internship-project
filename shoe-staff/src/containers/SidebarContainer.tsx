import { List, ListItem, ListItemButton, ListItemText, Drawer, Box, Typography } from '@mui/material';
import type { Permission } from '../types/types';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tabName: string) => void;
    userPermissions: Permission[];
}

const TAB_CONFIG = [
    { name: 'Quản lý ảnh Banner', requiredCode: 'VIEW_BANNER' },
    { name: 'Quản lý sản phẩm', requiredCode: 'VIEW_PRODUCT' },
    { name: 'Thông tin giới thiệu', requiredCode: 'VIEW_INFO' },
    { name: 'Thông tin liên hệ', requiredCode: 'CHAT_CUSTOMER' },
];

const SidebarContainer = ({ activeTab, onTabChange, userPermissions }: SidebarProps) => {

    return (
        <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0, '& .MuiDrawer-paper': { width: 250 } }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>Admin</Typography>
            </Box>
            <List sx={{ mt: 1 }}>
                {TAB_CONFIG.map((tab, index) => {
                    // Kiểm tra xem user có mã quyền tương ứng với tab này không
                    const hasPermission = userPermissions.some(p => p.code === tab.requiredCode);

                    return (
                        <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={activeTab === tab.name}
                                disabled={!hasPermission} // Vô hiệu hóa click nếu không có quyền
                                onClick={() => {
                                    // Chỉ cho phép chuyển tab nếu có quyền (phòng ngừa thêm)
                                    if (hasPermission) {
                                        onTabChange(tab.name);
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{
                                                fontWeight: activeTab === tab.name ? 700 : 500,
                                                fontSize: '14px',
                                                // Logic màu: Không có quyền -> xám nhạt, Đang chọn -> xanh, Bình thường -> xám đậm
                                                color: !hasPermission ? '#bdbdbd' : (activeTab === tab.name ? '#1976d2' : '#555')
                                            }}
                                        >
                                            {tab.name}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default SidebarContainer;