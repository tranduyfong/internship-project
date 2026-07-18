import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Fab, Badge, Box } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { io, Socket } from 'socket.io-client';

import { type RootState } from '../../app/store';
import { customerChatService } from '../../service/chat';
import CustomerChatWindow from './CustomerChatWindow';

const CustomerChatWidget: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');

    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);

    // State phục vụ phân trang
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('access_token')?.replace(/['"]+/g, '') || localStorage.getItem('token')?.replace(/['"]+/g, '') || '';
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket'],
            auth: { token }
        });
        setSocket(newSocket);

        customerChatService.getUnreadCount().then(res => {
            if (res.code === 'SUCCESS') {
                setUnreadCount(res.data.unreadCount);
                if (res.data.roomId) {
                    setRoomId(res.data.roomId);
                    newSocket.emit('join_chat', res.data.roomId);
                }
            }
        });

        newSocket.on('receive_message', (data: any) => {
            const newMessage = {
                id: Date.now(),
                sender_id: data.senderId,
                sender_type: data.senderType,
                message: data.message,
                is_read: 0,
            };

            setMessages(prev => [...prev, newMessage]);

            if (!isOpenRef.current && data.senderType === 'STAFF') {
                setUnreadCount(prev => prev + 1);
            }
        });

        return () => { newSocket.disconnect(); };
    }, [user]);

    const toggleChat = async () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        if (newIsOpen && user) {
            // Mở khung chat thì load lại từ page 1
            setPage(1);
            setHasMore(true);

            const res = await customerChatService.getMessages(1);
            if (res.code === 'SUCCESS') {
                const msgData = Array.isArray(res.data) ? res.data : res.data.messages;
                setMessages(msgData.reverse());

                // Nếu BE trả về ít hơn 10 tin -> Đã hết tin nhắn cũ
                if (msgData.length < 10) setHasMore(false);

                setUnreadCount(0);
                if (roomId) {
                    await customerChatService.markAsRead(roomId);
                }
            }
        }
    };

    // Hàm gọi thêm API khi cuộn chạm trần
    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;

        try {
            const res = await customerChatService.getMessages(nextPage);
            if (res.code === 'SUCCESS') {
                const msgData = Array.isArray(res.data) ? res.data : res.data.messages;

                if (msgData.length === 0) {
                    setHasMore(false);
                } else {
                    // Xử lý nối mảng: Đảo ngược mảng trả về (vì order DESC) rồi nhét lên đầu danh sách cũ
                    setMessages(prev => [...msgData.reverse(), ...prev]);
                    setPage(nextPage);

                    if (msgData.length < 10) setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Lỗi khi load thêm tin nhắn:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleSendMessage = () => {
        if (!text.trim() || !socket || !roomId) return;

        socket.emit('send_message', {
            roomId: roomId,
            message: text
        });

        setText('');
    };

    if (!user) return null;

    return (
        <Box>
            {isOpen && (
                <CustomerChatWindow
                    messages={messages}
                    text={text}
                    setText={setText}
                    onSend={handleSendMessage}
                    onClose={() => setIsOpen(false)}
                    onLoadMore={loadMoreMessages}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                />
            )}

            <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    overlap="circular"
                    sx={{
                        '& .MuiBadge-badge': {
                            zIndex: 10000,
                            fontSize: '13px',
                            height: '24px',
                            minWidth: '24px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <Fab
                        onClick={toggleChat}
                        sx={{ bgcolor: '#ffb300', color: '#000', width: 60, height: 60, '&:hover': { bgcolor: '#e6a323' } }}
                    >
                        <ChatBubbleIcon fontSize="large" />
                    </Fab>
                </Badge>
            </Box>
        </Box>
    );
};

export default CustomerChatWidget;