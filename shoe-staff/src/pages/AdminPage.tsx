import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarContainer from '../containers/SidebarContainer';
import HeaderContainer from '../containers/HeaderContainer';
import type { Permission } from '../types/types';
import { Box } from '@mui/material';
import { userService } from '../services/userService';
import ProductPage from './ProductPage';
import ChatPage from './ChatPage';

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('Quản lý sản phẩm');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Lấy quyền của nhân viên
        const fetchPermissions = async () => {
            try {
                const res = await userService.getMyPermissions();
                setPermissions(res.data);
            } catch (error) {
                console.error("Lỗi tải quyền", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, [navigate]);

    if (loading) return <div>Đang tải hệ thống...</div>;

    // Render động nội dung theo tab
    const renderContent = () => {
        switch (activeTab) {
            case 'Quản lý sản phẩm':
                return <ProductPage userPermissions={permissions} />;
            case 'Chăm sóc khách hàng':
                return <ChatPage />;
            default:
                return <div className="card p-4">Tính năng {activeTab} đang phát triển.</div>;
        }
    };

    return (
        <div className="d-flex w-100 min-vh-100">
            <SidebarContainer activeTab={activeTab} onTabChange={setActiveTab} userPermissions={permissions} />
            <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f4f6f8' }}>
                <HeaderContainer />
                <Box sx={{ p: 4, overflow: 'auto', flex: 1 }}>
                    {renderContent()}
                </Box>
            </div>
        </div>
    );
};

export default AdminPage;