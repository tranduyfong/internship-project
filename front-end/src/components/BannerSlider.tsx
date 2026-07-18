// src/components/BannerSlider.tsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import CSS bắt buộc của Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { bannerService } from '../service/banner';

interface BannerItem {
    id: number;
    image_url: string;
    target_link: string;
    display_order: number;
    status: string;
}

const BannerSlider: React.FC = () => {
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await bannerService.getBanners();

                // Lọc ra các banner đang ACTIVE và sắp xếp theo display_order
                const activeBanners = data
                    .filter((item: BannerItem) => item.status === 'ACTIVE')
                    .sort((a: BannerItem, b: BannerItem) => a.display_order - b.display_order);

                setBanners(activeBanners);
            } catch (error) {
                console.error('Lỗi khi tải banner:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Hàm nối chuỗi URL ảnh giống như bạn đã làm ở các phần trước
    const getImageUrl = (src: string) => src.startsWith('/') ? `http://localhost:8000${src}` : src;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress sx={{ color: '#ffb300' }} />
            </Box>
        );
    }

    if (banners.length === 0) return null;

    return (
        <Box sx={{ width: '100%', mb: 10, borderRadius: 2, overflow: 'hidden' }}>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true} // Vòng lặp vô tận
                autoplay={{
                    delay: 3500, // Tự động chuyển slide sau 3.5s
                    disableOnInteraction: false
                }}
                pagination={{
                    clickable: true, // Cho phép click vào các dấu chấm để chuyển ảnh
                    dynamicBullets: true
                }}
                navigation={true} // Bật mũi tên trái phải
                style={{
                    '--swiper-pagination-color': '#ffb300', // Đổi màu dấu chấm sang vàng của bạn
                    '--swiper-navigation-color': '#ffb300', // Đổi màu mũi tên
                } as React.CSSProperties}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        {/* Bọc thẻ a để khi click vào ảnh sẽ chuyển hướng đến target_link */}
                        <a href={banner.target_link} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                            <img
                                src={getImageUrl(banner.image_url)}
                                alt={`Banner ${banner.id}`}
                                style={{
                                    width: '100%',
                                    minHeight: "250px",
                                    maxHeight: '650px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default BannerSlider;