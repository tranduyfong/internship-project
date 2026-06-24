import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Typography } from '@mui/material';
import { PersonOutlined, Login, Logout } from '@mui/icons-material';

interface HeaderMobileDrawerProps {
    open: boolean;
    onClose: () => void;
    links: { title: string; path: string }[];
    user: any;
    onLogout: () => void;
}

const HeaderMobileDrawer: React.FC<HeaderMobileDrawerProps> = ({ open, onClose, links, user, onLogout }) => {
    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation" onClick={onClose}>
                <div className="p-3">
                    <h2 style={{ fontWeight: 900, fontStyle: 'italic', margin: 0, fontSize: '2rem' }}>beck.</h2>
                </div>
                <Divider />
                <List sx={{ flexGrow: 1 }}>
                    {links.map((item) => (
                        <ListItem key={item.title} disablePadding>
                            <ListItemButton component={Link} to={item.path}>
                                <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: 'bold', fontSize: '15px' }}>{item.title}</Typography>} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {user ? (
                        <>
                            <ListItem sx={{ py: 1, px: 2 }}>
                                <Typography style={{ fontFamily: 'Quicksand', fontSize: '14px' }}>
                                    Xin chào, <strong style={{ fontWeight: 'bold' }}>{user.name}</strong>
                                </Typography>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/tai-khoan">
                                    <ListItemIcon><PersonOutlined /></ListItemIcon>
                                    <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: '600', fontSize: '14px' }}>Thông tin cá nhân</Typography>} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={onLogout}>
                                    <ListItemIcon><Logout sx={{ color: 'red' }} /></ListItemIcon>
                                    <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', color: 'red', fontWeight: 'bold', fontSize: '14px' }}>Đăng xuất</Typography>} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dang-nhap">
                                <ListItemIcon><Login /></ListItemIcon>
                                <ListItemText primary={<Typography style={{ fontFamily: 'Quicksand', fontWeight: 'bold', fontSize: '14px' }}>Đăng nhập / Đăng ký</Typography>} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Drawer>
    );
};

export default HeaderMobileDrawer;