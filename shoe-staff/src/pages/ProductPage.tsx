import { useState } from 'react';
import { Box } from '@mui/material';
import ProductToolbar from '../containers/product/ProductToolbar';
import ProductTable from '../containers/product/ProductTable';
import CustomPagination from '../components/CustomPagination';
import ConfirmModal from '../components/ConfirmModal';
import ProductFormModal from '../components/ProductFormModal';
import { useProducts } from '../hooks/useProducts'; // Import logic
import type { Product, Permission, ProductDetail } from '../types/types';

interface ProductPageProps {
    userPermissions: Permission[];
}

const ProductPage = ({ userPermissions }: ProductPageProps) => {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetail | null>(null);

    // 2. Kéo Logic API từ Hook
    const { products, totalPages, loading, changeProductStatus, saveProduct, getProductDetail } = useProducts(keyword, page);

    // 3. Xử lý các sự kiện bấm nút
    const handleOpenAdd = () => {
        setSelectedProductDetail(null);
        setOpenFormModal(true);
    };

    const handleOpenEdit = async (productId: number) => {
        const data = await getProductDetail(productId);
        if (data) {
            setSelectedProductDetail(data);
            setOpenFormModal(true);
        }
    };

    const handleConfirmChangeStatus = async () => {
        if (!selectedProduct) return;
        await changeProductStatus(selectedProduct.id, selectedProduct.status);
        setOpenStatusModal(false);
    };

    const handleSubmitForm = async (formData: FormData) => {
        const success = await saveProduct(formData, selectedProductDetail?.id);
        if (success) setOpenFormModal(false);
    };

    const canAdd = userPermissions.some(p => p.code === 'ADD_PRODUCT');
    const canEdit = userPermissions.some(p => p.code === 'EDIT_PRODUCT');
    const canDelete = userPermissions.some(p => p.code === 'DELETE_PRODUCT');

    return (
        <Box className="card p-4 shadow-sm border-0">
            <ProductToolbar keyword={keyword} setKeyword={setKeyword} canAdd={canAdd} onAddClick={handleOpenAdd} />

            <ProductTable loading={loading} products={products} canEdit={canEdit} canDelete={canDelete} onEditClick={handleOpenEdit}
                onStatusClick={(product) => {
                    setSelectedProduct(product); setOpenStatusModal(true);
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <CustomPagination count={totalPages} page={page} onChange={setPage} />
            </Box>

            {/* Các Modal tiện ích */}
            <ConfirmModal open={openStatusModal}
                title={selectedProduct?.status === 'SELLING' ? "Xác nhận dừng bán" : "Xác nhận mở bán"}
                content={`Bạn có chắc chắn muốn ${selectedProduct?.status === 'SELLING' ? 'dừng bán' : 'mở bán lại'} sản phẩm "${selectedProduct?.name_product}"?`}
                onClose={() => setOpenStatusModal(false)}
                onConfirm={handleConfirmChangeStatus}
            />

            <ProductFormModal open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                onSubmit={handleSubmitForm}
                title={selectedProductDetail ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
                initialData={selectedProductDetail}
            />
        </Box>
    );
};

export default ProductPage;