import { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { ChatMessage, ChatRoom } from '../../types/types';

interface ChatWindowProps {
    activeRoom: ChatRoom | null;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
}

const ChatWindow = ({ activeRoom, messages, onSendMessage }: ChatWindowProps) => {
    const [text, setText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        onSendMessage(text);
        setText('');
    };

    if (!activeRoom) {
        return (
            // Dùng flex: 3 để chiếm 3 phần còn lại (tương đương 3/4 tổng không gian)
            <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafa', height: '100%' }}>
                <Typography color="textSecondary">Chọn một cuộc trò chuyện để bắt đầu</Typography>
            </Box>
        );
    }

    return (
        // Dùng flex: 3 ở đây nữa để bọc khung chat
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafa', height: '100%' }}>
            <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {activeRoom.customer_name}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => {
                    const isMe = msg.sender_type === 'STAFF';
                    return (
                        <Box key={msg.id} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                            <Paper elevation={0} sx={{
                                p: 1.5, px: 2, maxWidth: '70%',
                                backgroundColor: isMe ? '#1976d2' : '#e0e0e0',
                                color: isMe ? '#fff' : '#000',
                                borderRadius: isMe ? '16px 16px 0px 16px' : '16px 16px 16px 0px'
                            }}>
                                <Typography variant="body2">{msg.message}</Typography>
                            </Paper>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth size="small" placeholder="Nhập tin nhắn..."
                    value={text} onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <IconButton color="primary" onClick={handleSend}><SendIcon /></IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;