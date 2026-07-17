import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';

const HeaderContainer = () => {
    return (
        <AppBar position="static" elevation={0} sx={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}></Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=47" sx={{ width: 35, height: 35 }} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderContainer;