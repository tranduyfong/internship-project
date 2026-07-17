import { TextField, type TextFieldProps } from '@mui/material';

// Component này kế thừa toàn bộ thuộc tính của TextField MUI
const FormInput = (props: TextFieldProps) => {
    return (
        <TextField
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            sx={{ backgroundColor: '#fff', ...props.sx }}
            {...props}
        />
    );
};

export default FormInput;