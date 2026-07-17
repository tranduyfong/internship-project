import { Box, Typography } from '@mui/material';

interface ContentAreaProps {
    currentTab: string;
}

const ContentArea = ({ currentTab }: ContentAreaProps) => {
    return (
        <Box sx={{ p: 4 }}>
            {/* Sử dụng Bootstrap class 'card' và 'p-4' để tạo khối trắng bo góc */}
            <div className="card p-4 shadow-sm border-0">
                <Typography variant="h5" color="textSecondary">
                    Bạn hiện tại đang ở tab {currentTab}
                </Typography>
            </div>
        </Box>
    );
};

export default ContentArea;