import React from 'react';
import { Box, Typography, Container, Grid, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ButtonNavigateProduct } from '../components/ButtonProductNavigate';

export const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    const coreValues = [
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 50, color: '#ffb300' }} />,
            title: 'Chất lượng hàng đầu',
            desc: 'Mọi sản phẩm đều được kiểm định nghiêm ngặt trước khi đến tay khách hàng, đảm bảo sự bền bỉ và độ hoàn thiện tuyệt đối.'
        },
        {
            icon: <RocketLaunchIcon sx={{ fontSize: 50, color: '#ffb300' }} />,
            title: 'Tốc độ vượt trội',
            desc: 'Quy trình xử lý đơn hàng tự động hóa giúp sản phẩm được giao đến tận cửa nhà bạn trong thời gian ngắn nhất.'
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 50, color: '#ffb300' }} />,
            title: 'Hỗ trợ tận tâm',
            desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng lắng nghe, tư vấn và giải quyết mọi vấn đề của bạn 24/7.'
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 50, color: '#ffb300' }} />,
            title: 'Uy tín thương hiệu',
            desc: 'Nhiều năm liền được khách hàng bình chọn là điểm đến tin cậy số 1 cho những người đam mê thể thao và thời trang.'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Khách hàng tin dùng' },
        { number: '5+', label: 'Năm kinh nghiệm' },
        { number: '24/7', label: 'Hỗ trợ khách hàng' },
    ];

    return (
        <Box sx={{ fontFamily: 'Quicksand', pb: 10 }}>
            {/* 1. HERO SECTION */}
            <Box sx={{
                bgcolor: '#111',
                color: '#fff',
                py: { xs: 8, md: 14 },
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <Container maxWidth="md">
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                        Bước chạy của bạn, <br />
                        <span style={{ color: '#ffb300' }}>Đam mê của chúng tôi</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ddd', mb: 4, fontWeight: 400, lineHeight: 1.8 }}>
                        Chúng tôi không chỉ bán những đôi giày. Chúng tôi trao cho bạn sự tự tin, phong cách và sức mạnh để chinh phục mọi thử thách trên mọi hành trình.
                    </Typography>
                </Container>
            </Box>

            {/* 2. CÂU CHUYỆN THƯƠNG HIỆU */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Grid sx={{ alignItems: 'center' }} container spacing={6}>
                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Box sx={{ position: 'relative' }}>
                            <img
                                src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80"
                                alt="Our Story"
                                style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            />
                            {/* Khung trang trí */}
                            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderTop: '4px solid #ffb300', borderLeft: '4px solid #ffb300', zIndex: -1 }}></Box>
                            <Box sx={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderBottom: '4px solid #ffb300', borderRight: '4px solid #ffb300', zIndex: -1 }}></Box>
                        </Box>
                    </Grid>
                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Typography variant="overline" sx={{ color: '#ffb300', fontWeight: 'bold', fontSize: '16px', letterSpacing: 2 }}>
                            CÂU CHUYỆN CỦA CHÚNG TÔI
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 3, color: '#111' }}>
                            Khởi nguồn từ một <br /> tình yêu thể thao mãnh liệt.
                        </Typography>
                        <Typography sx={{ color: '#555', fontSize: '17px', mb: 2, lineHeight: 1.8 }}>
                            Bắt đầu từ một cửa hàng nhỏ lẻ, chúng tôi mang trong mình khát vọng mang đến những sản phẩm thể thao chất lượng quốc tế cho người tiêu dùng Việt Nam. Trải qua nhiều thăng trầm, điều giữ chúng tôi đứng vững chính là lòng tin của khách hàng.
                        </Typography>
                        <Typography sx={{ color: '#555', fontSize: '17px', lineHeight: 1.8 }}>
                            Sứ mệnh của chúng tôi rất đơn giản: Cung cấp trải nghiệm mua sắm hoàn hảo, nơi mỗi đôi giày bạn chọn không chỉ vừa vặn với đôi chân, mà còn vừa vặn với chính cá tính và phong cách sống của bạn.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

            {/* 3. THỐNG KÊ (STATS) */}
            <Box sx={{ bgcolor: '#ffb300', py: 8 }}>
                <Container>
                    <Grid sx={{ textSpacingTrim: 4 }} container>
                        {stats.map((stat, index) => (
                            <Grid key={index} sx={{ textAlign: 'center', xs: 6, md: 3, p: 3, ml: 10 }}>
                                <Typography variant="h2" sx={{ fontWeight: 900, color: '#111', mb: 1 }}>{stat.number}</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: '#333', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 4. GIÁ TRỊ CỐT LÕI */}
            <Box sx={{ bgcolor: '#f9f9f9', py: { xs: 8, md: 12 } }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#111', mb: 2 }}>
                            Giá trị cốt lõi
                        </Typography>
                        <Typography sx={{ color: '#666', maxWidth: '600px', mx: 'auto', fontSize: '16px' }}>
                            Những nguyên tắc định hình nên văn hóa và cách chúng tôi phục vụ bạn mỗi ngày.
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {coreValues.map((value, index) => (
                            <Grid sx={{ xs: 12, md: 6 }} key={index}>
                                <Card elevation={0} sx={{ height: '100%', p: 3, borderRadius: 4, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' } }}>
                                    <Box sx={{ mb: 2 }}>{value.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {value.title}
                                    </Typography>
                                    <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                                        {value.desc}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 5. CALL TO ACTION */}
            <Container sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Box sx={{ maxWidth: '800px', mx: 'auto', bgcolor: '#111', borderRadius: 4, p: { xs: 4, md: 8 }, color: '#fff' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
                        Sẵn sàng để bắt đầu hành trình mới?
                    </Typography>
                    <Typography sx={{ color: '#ccc', mb: 5, fontSize: '18px' }}>
                        Khám phá bộ sưu tập mới nhất của chúng tôi và tìm cho mình một người bạn đồng hành hoàn hảo ngay hôm nay.
                    </Typography>
                    <ButtonNavigateProduct />
                </Box>
            </Container>
        </Box>
    );
};