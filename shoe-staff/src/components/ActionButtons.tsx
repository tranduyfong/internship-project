import { Button, type ButtonProps, IconButton, type IconButtonProps, Tooltip } from '@mui/material';

interface AuthButtonProps extends ButtonProps {
    hasPermission: boolean;
    tooltipText?: string;
}

// Nút bấm có chữ (Ví dụ: Thêm mới)
export const AuthButton = ({ hasPermission, tooltipText = "Bạn không có quyền thao tác", ...props }: AuthButtonProps) => {
    const btn = (
        <Button {...props} disabled={!hasPermission}>
            {props.children}
        </Button>
    );
    // Thẻ <span> bọc ngoài là bắt buộc để Tooltip hoạt động trên phần tử bị disabled
    return !hasPermission ? <Tooltip title={tooltipText} placement="top"><span>{btn}</span></Tooltip> : btn;
};

interface AuthIconButtonProps extends IconButtonProps {
    hasPermission: boolean;
    tooltipText?: string;
}

// Nút bấm chỉ có Icon (Ví dụ: Sửa, Xóa)
export const AuthIconButton = ({ hasPermission, tooltipText = "Bạn không có quyền thao tác", ...props }: AuthIconButtonProps) => {
    const btn = (
        <IconButton {...props} disabled={!hasPermission}>
            {props.children}
        </IconButton>
    );
    return !hasPermission ? <Tooltip title={tooltipText} placement="top"><span>{btn}</span></Tooltip> : btn;
};