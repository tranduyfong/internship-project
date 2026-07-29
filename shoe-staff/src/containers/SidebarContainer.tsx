import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Drawer, Box, Typography, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LogoutIcon from '@mui/icons-material/Logout';
import type { Permission } from '../types/types';
import { TAB_CONFIG } from '../utils/tab.configs';
import { chatService } from '../services/chatService';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tabName: string) => void;
    userPermissions: Permission[];
}

const SidebarContainer = ({ activeTab, onTabChange, userPermissions }: SidebarProps) => {
    const navigate = useNavigate();
    const [totalUnread, setTotalUnread] = useState(0);

    useEffect(() => {
        const hasChatPermission = userPermissions.some(p => p.code === 'CHAT_CUSTOMER');
        const fetchUnread = async () => {
            try {
                if (hasChatPermission) {
                    const res = await chatService.getUnreadCount();
                    setTotalUnread(res.data.unreadCount);
                }
            } catch (error) {
                console.error("Lỗi đếm tin nhắn:", error);
            }
        };
        fetchUnread();
        if (hasChatPermission) {
            const token = localStorage.getItem('access_token');
            const socket = io('http://localhost:8000', {
                auth: { token }
            });

            // Lắng nghe sự kiện khách nhắn tin tới quầy trực ban
            socket.on('new_customer_message', () => {
                setTotalUnread(prev => prev + 1);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userPermissions]);

    useEffect(() => {
        const refreshUnread = async () => {
            const res = await chatService.getUnreadCount();
            setTotalUnread(res.data.unreadCount);
        };
        if (userPermissions.some(p => p.code === 'CHAT_CUSTOMER')) {
            refreshUnread();
        }
    }, [activeTab, userPermissions]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        toast.info('Đã đăng xuất khỏi hệ thống');
        navigate('/login');
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: 250, display: 'flex', flexDirection: 'column' }
            }}
        >
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>Hệ thống nhân viên Beck.</Typography>
            </Box>

            <List sx={{ mt: 1 }}>
                {TAB_CONFIG.map((tab, index) => {
                    const hasPermission = userPermissions.some(p => p.code === tab.requiredCode);
                    const isActive = activeTab === tab.name;

                    return (
                        <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                disabled={!hasPermission}
                                onClick={() => { if (hasPermission) onTabChange(tab.name); }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: '14px', color: !hasPermission ? '#bdbdbd' : (isActive ? '#1976d2' : '#555') }}>
                                            {tab.requiredCode === 'CHAT_CUSTOMER' ? (
                                                <Badge badgeContent={totalUnread} color="error" max={99}>
                                                    {tab.name}
                                                </Badge>
                                            ) : (
                                                tab.name
                                            )}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Vùng đáy Sidebar cho nút Đăng xuất (Dùng mt: 'auto' để đẩy nó xuống kịch sàn) */}
            <Box sx={{ mt: 'auto', borderTop: '1px solid #f0f0f0', p: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, backgroundColor: '#fff5f5', '&:hover': { backgroundColor: '#ffebee' } }}>
                        <ListItemIcon sx={{ minWidth: 40, color: '#d32f2f' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#d32f2f' }}>
                                    Đăng xuất
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
};

export default SidebarContainer;