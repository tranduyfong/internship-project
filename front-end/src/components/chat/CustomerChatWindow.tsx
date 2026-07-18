import React, { useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

interface CustomerChatWindowProps {
    messages: any[];
    text: string;
    setText: (t: string) => void;
    onSend: () => void;
    onClose: () => void;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
}

const CustomerChatWindow: React.FC<CustomerChatWindowProps> = ({
    messages, text, setText, onSend, onClose, onLoadMore, hasMore, isLoadingMore
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const prevScrollHeight = useRef<number>(0);

    // Xử lý sự kiện cuộn
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        // Bắt điểm chạm trần (scrollTop === 0)
        if (e.currentTarget.scrollTop === 0 && hasMore && !isLoadingMore) {
            // Lưu lại chiều cao hiện tại của khung chat trước khi load tin cũ
            prevScrollHeight.current = e.currentTarget.scrollHeight;
            onLoadMore();
        }
    };

    // Xử lý cuộn khi có tin nhắn thay đổi (Gửi mới hoặc Load cũ)
    useEffect(() => {
        if (!chatBodyRef.current) return;
        const container = chatBodyRef.current;

        if (prevScrollHeight.current > 0) {
            // Trường hợp 1: Vừa load thêm tin nhắn cũ -> Giữ nguyên vị trí cuộn
            container.scrollTop = container.scrollHeight - prevScrollHeight.current;
            prevScrollHeight.current = 0; // Reset lại ref
        } else {
            // Trường hợp 2: Có tin nhắn mới hoàn toàn -> Cuộn thẳng xuống cuối cùng
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Paper elevation={6} sx={{
            position: 'fixed', bottom: 90, right: 20,
            width: 340, height: 450,
            display: 'flex', flexDirection: 'column',
            borderRadius: 3, overflow: 'hidden', zIndex: 9999,
            fontFamily: 'Quicksand'
        }}>
            {/* Header */}
            <Box sx={{ bgcolor: '#ffb300', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Hỗ trợ trực tuyến</Typography>
                <IconButton size="small" onClick={onClose} sx={{ color: '#000' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Body chứa tin nhắn */}
            <Box
                ref={chatBodyRef}
                onScroll={handleScroll}
                sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f9fafa', display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
                {/* Hiển thị Icon xoay khi đang lấy dữ liệu cũ */}
                {isLoadingMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <CircularProgress size={20} sx={{ color: '#ffb300' }} />
                    </Box>
                )}

                {messages.length === 0 && !isLoadingMore ? (
                    <Typography sx={{ textAlign: 'center', color: '#999', mt: 5, fontSize: '14px' }}>
                        Hãy gửi lời nhắn, chúng tôi sẽ phản hồi ngay!
                    </Typography>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_type === 'CUSTOMER';
                        return (
                            <Box key={msg.id} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                <Box sx={{
                                    maxWidth: '75%', p: 1.5, px: 2,
                                    bgcolor: isMe ? '#ffb300' : '#e0e0e0',
                                    color: isMe ? '#000' : '#000',
                                    borderRadius: isMe ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                                    wordBreak: 'break-word'
                                }}>
                                    <Typography sx={{ fontSize: '14px' }}>{msg.message}</Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Footer nhập tin nhắn */}
            <Box sx={{ p: 1.5, bgcolor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth size="small"
                    placeholder="Nhập tin nhắn..."
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSend()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
                />
                <IconButton color="primary" onClick={onSend} sx={{ color: '#ffb300' }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default CustomerChatWindow;