import { OutlinedInput, InputAdornment, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface CustomInputProps {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
}

const CustomInput = ({ placeholder = "Tìm kiếm...", value, onChange }: CustomInputProps) => {
    return (
        <FormControl size="small" variant="outlined" sx={{ width: '300px', backgroundColor: '#fff' }}>
            <OutlinedInput
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};

export default CustomInput;