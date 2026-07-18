import { useState, useRef, useEffect, type UIEvent } from 'react';
import { Box, Typography, TextField, IconButton, Paper, CircularProgress, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { ChatMessage, ChatRoom } from '../../types/types';

interface ChatWindowProps {
    activeRoom: ChatRoom | null;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onLoadMore: () => Promise<void>;
    isLoadingMore: boolean;
    hasMore: boolean;
}

const ChatWindow = ({ activeRoom, messages, onSendMessage, onLoadMore, isLoadingMore, hasMore }: ChatWindowProps) => {
    const [text, setText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const previousScrollHeight = useRef<number>(0);

    useEffect(() => {
        if (previousScrollHeight.current > 0 && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight - previousScrollHeight.current;
            previousScrollHeight.current = 0;
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        onSendMessage(text);
        setText('');
    };

    // Vẫn giữ tính năng cuộn để dành cho ai vuốt mạnh lên trên
    const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop <= 5 && hasMore && !isLoadingMore) {
            previousScrollHeight.current = target.scrollHeight;
            await onLoadMore();
        }
    };

    if (!activeRoom) {
        return (
            <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafa', height: '100%' }}>
                <Typography color="textSecondary">Chọn một cuộc trò chuyện để bắt đầu</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafa', height: '100%' }}>
            <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {activeRoom.customer_name}
                </Typography>
            </Box>

            <Box
                ref={containerRef}
                onScroll={handleScroll}
                sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                {/* ĐÃ SỬA: Thêm nút bấm thủ công cực xịn sò dành cho màn hình không có thanh cuộn */}
                {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                if (containerRef.current) {
                                    previousScrollHeight.current = containerRef.current.scrollHeight;
                                }
                                onLoadMore();
                            }}
                            disabled={isLoadingMore}
                            sx={{ textTransform: 'none', borderRadius: 5, fontSize: '12px' }}
                        >
                            {isLoadingMore ? <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> : null}
                            {isLoadingMore ? 'Đang tải...' : 'Xem thêm tin nhắn cũ'}
                        </Button>
                    </Box>
                )}

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