import { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomInput from '../components/CustomInput';
import ConfirmModal from '../components/ConfirmModal';
import TableSkeleton from '../components/TableSkeleton'; // <-- Import component Skeleton
import { productService } from '../services/productService';
import type { Product } from '../types/types';
import { formatCurrency } from '../utils/formatters';

const ProductContainer = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true); // <-- Thêm state loading

    const [openStopModal, setOpenStopModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true); // Bật loading trước khi gọi API
        try {
            const res = await productService.searchAdminProducts(keyword, page - 1, 7);
            setProducts(res.data);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
        } finally {
            setLoading(false); // Tắt loading khi API trả về xong (dù thành công hay lỗi)
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [keyword, page]);

    const handleStopSelling = () => {
        setOpenStopModal(false);
        // Xử lý API dừng bán ở đây...
    };

    return (
        <Box className="card p-4 shadow-sm border-0">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>Danh sách sản phẩm</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <CustomInput placeholder="Tìm sản phẩm..." value={keyword} onChange={setKeyword} />
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none', backgroundColor: '#1976d2' }}>
                        Thêm mới
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Ảnh</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: '30%' }}>Tên sản phẩm</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Thương hiệu</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Giá nhập</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Giá bán</TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Logic render: Nếu đang tải thì hiện Skeleton, nếu xong thì hiện dữ liệu */}
                        {loading ? (
                            <TableSkeleton columns={7} rows={5} />
                        ) : products.length > 0 ? (
                            products.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        <img src={`http://localhost:8000${row.cover_image[0]}`} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                    </TableCell>
                                    <TableCell>{row.name_product}</TableCell>
                                    <TableCell>{row.brand}</TableCell>
                                    <TableCell>{formatCurrency(row.import_price)}</TableCell>
                                    <TableCell>{formatCurrency(row.price_product)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                setSelectedProduct(row);
                                                setOpenStopModal(true);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    Không tìm thấy sản phẩm nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </Box>

            <ConfirmModal
                open={openStopModal}
                title="Xác nhận dừng bán"
                content={`Bạn có chắc chắn muốn dừng bán sản phẩm "${selectedProduct?.name_product}"?`}
                onClose={() => setOpenStopModal(false)}
                onConfirm={handleStopSelling}
            />
        </Box>
    );
};

export default ProductContainer;