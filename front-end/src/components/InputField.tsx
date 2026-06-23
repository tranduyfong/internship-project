import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', placeholder, value, onChange, required }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="mb-3">
            <label className="form-label" style={{ fontSize: '14px', color: '#666' }}>
                {required && <span className="text-danger">* </span>}{label}
            </label>
            <TextField
                fullWidth
                size="small"
                name={name}
                type={isPassword && !showPassword ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', backgroundColor: 'white', fontFamily: 'Quicksand' } }}
                // Sử dụng slotProps để truyền thuộc tính input an toàn cho mọi phiên bản MUI
                slotProps={{
                    input: {
                        endAdornment: isPassword && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </div>
    );
};

export default InputField;