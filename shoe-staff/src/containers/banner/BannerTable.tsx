import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableSkeleton from '../../components/TableSkeleton';
import { AuthIconButton } from '../../components/ActionButtons';
import type { Banner } from '../../types/types';

interface BannerTableProps {
    loading: boolean;
    banners: Banner[];
    canEdit: boolean;
    canDelete: boolean;
    onEditClick: (banner: Banner) => void;
    onDeleteClick: (banner: Banner) => void;
}

const BannerTable = ({ loading, banners, canEdit, canDelete, onEditClick, onDeleteClick }: BannerTableProps) => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '5%' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Hình ảnh</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Link Đích</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%', textAlign: 'center' }}>Thứ tự hiển thị</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%', textAlign: 'center' }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Thao tác</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <TableSkeleton columns={6} rows={4} />
                ) : banners.length > 0 ? (
                    banners.map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>
                                <Box sx={{ width: 160, height: 60, borderRadius: 1, overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img
                                        src={`http://localhost:8000${row.image_url}`}
                                        alt="banner"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                                    {row.target_link}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography sx={{ fontWeight: 600 }}>{row.display_order}</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={row.status === 'ACTIVE' ? 'Đang bật' : 'Đang ẩn'}
                                    color={row.status === 'ACTIVE' ? 'success' : 'default'}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <AuthIconButton hasPermission={canEdit} onClick={() => onEditClick(row)} color="primary" size="small" sx={{ mr: 1 }}>
                                    <EditIcon fontSize="small" />
                                </AuthIconButton>
                                <AuthIconButton hasPermission={canDelete} color="error" size="small" onClick={() => onDeleteClick(row)}>
                                    <DeleteIcon fontSize="small" />
                                </AuthIconButton>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Không có banner nào trong hệ thống</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default BannerTable;