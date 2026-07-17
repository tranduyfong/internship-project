import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TableSkeleton from '../../components/TableSkeleton';
import { AuthIconButton } from '../../components/ActionButtons';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types/types';

interface ProductTableProps {
    loading: boolean;
    products: Product[];
    canEdit: boolean;
    canDelete: boolean;
    onEditClick: (id: number) => void;
    onStatusClick: (product: Product) => void;
}

const ProductTable = ({ loading, products, canEdit, canDelete, onEditClick, onStatusClick }: ProductTableProps) => (
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
                {loading ? (
                    <TableSkeleton columns={7} rows={5} />
                ) : products.length > 0 ? (
                    products.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                backgroundColor: row.status === 'STOPPED' ? '#e9ecef' : 'inherit',
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}
                        >
                            <TableCell>{row.id}</TableCell>
                            <TableCell>
                                <img src={`http://localhost:8000${row.cover_image[0]}`} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                            </TableCell>
                            <TableCell>{row.name_product}</TableCell>
                            <TableCell>{row.brand}</TableCell>
                            <TableCell>{formatCurrency(row.import_price)}</TableCell>
                            <TableCell>{formatCurrency(row.price_product)}</TableCell>
                            <TableCell align="right">
                                <AuthIconButton hasPermission={canEdit} onClick={() => onEditClick(row.id)} color="primary" size="small">
                                    <EditIcon fontSize="small" />
                                </AuthIconButton>
                                <AuthIconButton
                                    hasPermission={canDelete}
                                    color={row.status === 'SELLING' ? 'error' : 'success'}
                                    size="small"
                                    onClick={() => onStatusClick(row)}
                                >
                                    {row.status === 'SELLING' ? <DeleteIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                                </AuthIconButton>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>Không tìm thấy sản phẩm nào</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ProductTable;