import React from 'react';
import { Box, Typography } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';

const policies = [
    {
        icon: <TimerOutlinedIcon sx={{ fontSize: 36, color: '#333' }} />,
        title: 'KHÔNG SỢ HẾT SIZE',
        desc: 'Do chẳng cần đợi nhân viên chốt đơn',
    },
    {
        icon: <TwoWheelerOutlinedIcon sx={{ fontSize: 36, color: '#333' }} />,
        title: 'GIAO HÀNG TOÀN QUỐC',
        desc: 'Gửi hàng đi luôn trong ngày',
    },
    {
        icon: <PaymentsOutlinedIcon sx={{ fontSize: 36, color: '#333' }} />,
        title: 'THANH TOÁN LINH HOẠT',
        desc: 'Tiền mặt/CK/ví điện tử/thẻ',
    },
    {
        icon: <SyncAltOutlinedIcon sx={{ fontSize: 36, color: '#333' }} />,
        title: 'ĐỔI SIZE THOẢI MÁI',
        desc: 'Đến khi anh em hài lòng',
    }
];

const ShopPolicies: React.FC = () => {
    return (
        <Box sx={{
            border: '1px solid #eaeaea',
            bgcolor: '#fff',
            mt: 3,
            mb: 4,
            fontFamily: 'Quicksand',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
        }}>
            {policies.map((policy, index) => (
                <Box key={index} sx={{
                    flex: 1, // Lệnh này bắt buộc 4 khối phải rộng bằng y hệt nhau (25% mỗi khối)
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // Căn giữa cụm Icon + Text trong mỗi khối
                    py: 2.5,
                    px: 2,

                    // Xử lý vạch kẻ phân cách
                    borderRight: {
                        md: index !== policies.length - 1 ? '1px solid #eaeaea' : 'none'
                    },
                    borderBottom: {
                        xs: index !== policies.length - 1 ? '1px solid #eaeaea' : 'none',
                        md: 'none'
                    },

                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: '#fafafa',
                    }
                }}>
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                        {policy.icon}
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '14px', color: '#000', mb: 0.5 }}>
                            {policy.title}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#555', lineHeight: 1.2 }}>
                            {policy.desc}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default ShopPolicies;