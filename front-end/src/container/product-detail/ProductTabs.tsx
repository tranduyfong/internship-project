import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

interface ProductTabsProps {
    activeTab: number;
    setActiveTab: (val: number) => void;
    description: string;
    brand: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ activeTab, setActiveTab, description, brand }) => {
    return (
        <Box sx={{ mt: 8 }}>
            <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    '& .MuiTab-root': { fontFamily: 'Quicksand', fontWeight: 'bold', color: '#666', backgroundColor: '#f5f5f5', mr: 1, borderRadius: '4px 4px 0 0' },
                    '& .Mui-selected': { color: '#000 !important', backgroundColor: '#ffb300' },
                    '& .MuiTabs-indicator': { display: 'none' }
                }}
            >
                <Tab label="CHI TIẾT SẢN PHẨM" />
                <Tab label="HƯỚNG DẪN MUA HÀNG" />
                <Tab label="CÁCH CHỌN SIZE" />
                <Tab label="CHÍNH SÁCH HOÀN TRẢ" />
            </Tabs>

            <Box sx={{ border: '1px solid #ddd', p: 3, backgroundColor: '#fff', borderTop: 'none', minHeight: '200px', fontFamily: 'Quicksand' }}>
                {activeTab === 0 && <Typography dangerouslySetInnerHTML={{ __html: description }} />}
                {activeTab === 1 && <Typography>Để mua hàng, vui lòng chọn size, số lượng và ấn thêm vào giỏ hàng. Nhập địa chỉ và xác nhận thanh toán.</Typography>}
                {activeTab === 2 && <Typography>Bạn có thể đo chiều dài bàn chân từ gót đến ngón chân dài nhất, sau đó tra bảng quy đổi size tiêu chuẩn của thương hiệu {brand}.</Typography>}
                {activeTab === 3 && <Typography>Sản phẩm được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu phát hiện lỗi sản xuất hoặc nhầm kích thước.</Typography>}
            </Box>
        </Box>
    );
};

export default ProductTabs;