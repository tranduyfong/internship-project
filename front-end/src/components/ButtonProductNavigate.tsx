import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const ButtonNavigateProduct = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 3 }}>
            <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/san-pham')}
                sx={{
                    bgcolor: '#ffb300',
                    color: '#000',
                    fontWeight: 'bold',
                    px: 5,
                    py: 1.5,
                    borderRadius: '30px',
                    fontSize: '16px',
                    '&:hover': { bgcolor: '#e6a323' }
                }}
            >
                MUA SẮM NGAY
            </Button>
        </Box>
    )
}