import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { bannerService } from '../services/bannerService';
import type { Banner } from '../types/types';

export const useBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchBanners = useCallback(async () => {
        setLoading(true);
        try {
            const res = await bannerService.getBanners();
            // Sắp xếp banner theo display_order để hiển thị đẹp hơn
            const sortedBanners = (res.data || []).sort((a, b) => a.display_order - b.display_order);
            setBanners(sortedBanners);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách Banner!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const addBanner = async (formData: FormData) => {
        try {
            await bannerService.createBanner(formData);
            toast.success("Thêm mới Banner thành công!");
            fetchBanners();
            return true;
        } catch (error) {
            toast.error("Thêm Banner thất bại!");
            return false;
        }
    };

    const updateBanner = async (id: number, data: { status: string; display_order: number; target_link: string }) => {
        try {
            await bannerService.updateBanner(id, data);
            toast.success("Cập nhật Banner thành công!");
            fetchBanners();
            return true;
        } catch (error) {
            toast.error("Cập nhật Banner thất bại!");
            return false;
        }
    };

    const removeBanner = async (id: number) => {
        try {
            await bannerService.deleteBanner(id);
            toast.success("Đã xóa Banner thành công!");
            fetchBanners();
        } catch (error) {
            toast.error("Lỗi khi xóa Banner!");
        }
    };

    return { banners, loading, addBanner, updateBanner, removeBanner };
};