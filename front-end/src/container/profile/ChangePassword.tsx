import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import type { RootState } from '../../app/store';
import { changePasswordRequest } from '../../store/actions/profileActions';
import InputField from '../../components/InputField';

const ChangePassword: React.FC = () => {
    const dispatch = useDispatch();
    const { changePasswordLoading } = useSelector((state: RootState) => state.profile);

    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Mật khẩu xác nhận không khớp!');
        }

        dispatch(changePasswordRequest({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            onSuccess: () => {
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        }));
    };

    // Style box bao ngoài giống hệt ProfileInfoForm
    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, border: '1px solid #eee', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontFamily: 'Quicksand' }}>Đổi mật khẩu</Typography>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    type="password"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <Button
                    type="submit" variant="contained" disabled={changePasswordLoading}
                    sx={{ mt: 2, backgroundColor: '#ffb300', color: '#000', fontWeight: 'bold', fontFamily: 'Quicksand', '&:hover': { backgroundColor: '#e6a323' } }}
                >
                    {changePasswordLoading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Cập nhật mật khẩu'}
                </Button>
            </form>
        </Box>
    );
};

export default ChangePassword;