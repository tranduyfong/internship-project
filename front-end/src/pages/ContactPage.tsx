import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import ContactInfo from '../container/contact/ContactInfo';
import ContactMap from '../container/contact/ContactMap';

export const ContactPage: React.FC = () => {
    return (
        <Box sx={{ fontFamily: 'Quicksand', py: { xs: 6, md: 10 }, minHeight: '100vh' }}>
            <Container maxWidth="xl" className='p-0'>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#111', mb: 2, textTransform: 'uppercase' }}>
                        Liên hệ với chúng tôi
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '16px', maxWidth: '600px', mx: 'auto' }}>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại lời nhắn hoặc liên hệ trực tiếp qua các thông tin bên dưới.
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                    <Grid container>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ContactInfo />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <ContactMap />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};