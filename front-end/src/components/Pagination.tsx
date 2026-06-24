import React from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

    return (
        <Stack spacing={2} sx={{ mt: 5, mb: 3, alignItems: 'center' }}>
            <MuiPagination
                count={totalPages}
                page={currentPage + 1} // MUI Pagination bắt đầu từ 1, API của bạn bắt đầu từ 0
                onChange={(_, page) => onPageChange(page - 1)}
                color="primary"
                shape="rounded"
                sx={{
                    '& .MuiPaginationItem-root': {
                        fontFamily: 'Quicksand',
                        fontWeight: 'bold',
                    },
                    '& .Mui-selected': {
                        backgroundColor: '#ffb300 !important',
                        color: '#000',
                    }
                }}
            />
        </Stack>
    );
};

export default Pagination;