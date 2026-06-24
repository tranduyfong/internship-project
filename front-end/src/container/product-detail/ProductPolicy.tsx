import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductPolicy: React.FC = () => {
    const policies = [
        { title: "KHÔNG SỢ HẾT SIZE", desc: "Do shop cần gọi điện nhân viên chốt đơn" },
        { title: "GIAO HÀNG TOÀN QUỐC", desc: "Gửi hàng đi luôn trong ngày" },
        { title: "THANH TOÁN LINH HOẠT", desc: "Tiền mặt/CK/ví điện tử/thẻ" },
        { title: "ĐỔI SIZE THOẢI MÁI", desc: "Đến khi anh em hài lòng" },
        { title: "BẢO HÀNH TRỌN ĐỜI", desc: "Lỗi dễ dàng chỉ cần đọc SĐT" },
        { title: "LUÔN LUÔN TRI ÂN", desc: "100% tích điểm, giảm giá lần sau" },
    ];

    return (
        <Box sx={{ border: '1px solid #eee', p: 3, backgroundColor: '#fcfcfc', fontFamily: 'Quicksand' }}>
            {policies.map((p, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <span style={{ color: '#ffb300', fontSize: '16px' }}>•</span> {p.title}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#666', pl: 2 }}>{p.desc}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default ProductPolicy;