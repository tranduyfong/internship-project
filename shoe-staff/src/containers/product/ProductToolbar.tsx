import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomInput from '../../components/CustomInput';
import { AuthButton } from '../../components/ActionButtons';

interface ProductToolbarProps {
    keyword: string;
    setKeyword: (val: string) => void;
    canAdd: boolean;
    onAddClick: () => void;
}

const ProductToolbar = ({ keyword, setKeyword, canAdd, onAddClick }: ProductToolbarProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>Danh sách sản phẩm</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomInput placeholder="Tìm sản phẩm..." value={keyword} onChange={setKeyword} />
            <AuthButton
                hasPermission={canAdd}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddClick}
                sx={{ textTransform: 'none', backgroundColor: canAdd ? '#1976d2' : undefined }}
            >
                Thêm mới
            </AuthButton>
        </Box>
    </Box>
);

export default ProductToolbar;