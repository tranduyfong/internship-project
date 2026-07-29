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
    disabled?: boolean; // 1. Bổ sung thêm thuộc tính disabled ở đây
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    required,
    disabled // 2. Nhận prop disabled từ trên truyền xuống
}) => {
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
                disabled={disabled} // 3. Gắn vào thẻ TextField của MUI
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        // Khi disabled thì đổi màu nền nhẹ để người dùng dễ nhận biết ô bị khóa
                        backgroundColor: disabled ? '#f5f5f5' : 'white',
                        fontFamily: 'Quicksand'
                    }
                }}
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