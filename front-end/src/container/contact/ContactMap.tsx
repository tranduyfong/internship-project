import React from 'react';
import { Box } from '@mui/material';

const ContactMap: React.FC = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', minHeight: { xs: '400px', md: '100%' } }}>
            <iframe
                title="Bản đồ cửa hàng"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.657600813901!2d105.78126221540201!3d21.046388985988825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3b4220c21f%3A0x856272cbc979c49e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBN4buPIC0gxJDhu4thIGNo4bqldCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1628000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </Box>
    );
};

export default ContactMap;