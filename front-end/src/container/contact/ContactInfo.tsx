import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const ContactInfo: React.FC = () => {
    return (
        <Box sx={{ p: { xs: 4, md: 6 }, bgcolor: '#fff', height: '100%', fontFamily: 'Quicksand' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>
                Thông tin liên hệ
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOnIcon sx={{ color: '#ffb300', mt: 0.5 }} />
                    <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Địa chỉ cửa hàng</Typography>
                        <Typography sx={{ color: '#666', mt: 0.5 }}>57 Cầu Vồng, Phường Đức Thắng, Quận Bắc Từ Liêm, Thành phố Hà Nội</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#ffb300', mt: 0.5 }} />
                    <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Số điện thoại</Typography>
                        <Typography sx={{ color: '#666', mt: 0.5 }}>0862.885.143 (Hỗ trợ 24/7)</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <EmailIcon sx={{ color: '#ffb300', mt: 0.5 }} />
                    <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Email hỗ trợ</Typography>
                        <Typography sx={{ color: '#666', mt: 0.5 }}>support@store.vn</Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 5, borderColor: '#eee' }} />

            {/* PHẦN CHÍNH SÁCH ĐỔI TRẢ */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <AutorenewIcon sx={{ color: '#ffb300', fontSize: 32 }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                        Chính sách đổi trả hàng
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>
                        Chúng tôi cam kết mang lại trải nghiệm mua sắm an tâm nhất:
                    </Typography>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#666', fontSize: '15px', lineHeight: '1.8' }}>
                        <li>Hỗ trợ đổi trả trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng.</li>
                        <li>Sản phẩm đổi trả phải còn nguyên tem mác, hộp đựng và chưa qua sử dụng.</li>
                        <li>Miễn phí vận chuyển 2 chiều đối với các sản phẩm lỗi do nhà sản xuất.</li>
                        <li>Vui lòng mang theo hóa đơn hoặc cung cấp mã đơn hàng (Ví dụ: DH168382975) khi yêu cầu hỗ trợ.</li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
};

export default ContactInfo;