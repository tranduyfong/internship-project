import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import InputField from '../../components/InputField';
import type { FullUserProfile } from '../../types/user';

interface ProfileInfoFormProps {
    profile: FullUserProfile;
    onUpdate: (name: string, phone: string) => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    useEffect(() => {
        if (profile) setFormData({ name: profile.name, phone: profile.phone, email: profile.email });
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, border: '1px solid #eee', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontFamily: 'Quicksand' }}>Thông tin cá nhân</Typography>
            <InputField label="Email (Không thể thay đổi)" name="email" value={formData.email} onChange={() => { }} />
            <InputField label="Họ và tên" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} required />
            <Button variant="contained" onClick={() => onUpdate(formData.name, formData.phone)} sx={{ mt: 2, backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand', '&:hover': { backgroundColor: '#e6a323' } }}>
                Lưu thay đổi
            </Button>
        </Box>
    );
};
export default ProfileInfoForm;