import { TableRow, TableCell, Skeleton } from '@mui/material';

interface TableSkeletonProps {
    columns: number; // Số lượng cột của bảng
    rows?: number;   // Số lượng hàng muốn hiển thị hiệu ứng (mặc định là 5)
}

const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
    // Tạo mảng ảo để map ra các hàng và cột
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: columns });

    return (
        <>
            {rowArray.map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {colArray.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            {/* animation="wave" tạo hiệu ứng lượn sóng hiện đại */}
                            <Skeleton animation="wave" variant="text" height={30} />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};

export default TableSkeleton;