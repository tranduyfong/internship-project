import { Pagination, Box } from '@mui/material';

interface CustomPaginationProps {
    count: number;
    page: number;
    onChange: (page: number) => void;
}

const CustomPagination = ({ count, page, onChange }: CustomPaginationProps) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Pagination
                count={count}
                page={page}
                onChange={(_, value) => onChange(value)}
                color="primary"
                showFirstButton
                showLastButton
            />
        </Box>
    );
};

export default CustomPagination;