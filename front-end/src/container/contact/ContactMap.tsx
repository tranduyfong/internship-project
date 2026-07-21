import React from 'react';
import { Box } from '@mui/material';
import CustomerMap from '../map/CustomerMap';

const ContactMap: React.FC = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', minHeight: { xs: '400px', md: '100%' } }}>
            <CustomerMap />
        </Box>
    );
};

export default ContactMap;