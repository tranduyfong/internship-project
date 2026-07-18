import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { chatService } from '../services/chatService';
import ChatRoomList from '../containers/chat/ChatRoomList';
import ChatWindow from '../containers/chat/ChatWindow';
import type { ChatRoom, ChatMessage } from '../types/types';

const ChatPage = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [chatPage, setChatPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // CHÌA KHÓA: Dùng Ref để khóa cứng hàm tải thêm, tránh bị trình duyệt gọi API 10 lần trong 1 giây khi cuộn
    const loadingRef = useRef(false);

    const activeRoomIdRef = useRef<number | null>(null);
    useEffect(() => {
        activeRoomIdRef.current = activeRoomId;
    }, [activeRoomId]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await chatService.getAdminRooms();
                setRooms(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách phòng:", error);
            }
        };
        fetchRooms();

        const token = localStorage.getItem('access_token');
        const newSocket = io('http://localhost:8000', { auth: { token } });
        setSocket(newSocket);

        return () => { newSocket.close(); };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_customer_message', (data: { roomId: number, message: string }) => {
            setRooms(prevRooms => {
                const roomIndex = prevRooms.findIndex(r => r.room_id === data.roomId);
                if (roomIndex > -1) {
                    const updatedRoom = { ...prevRooms[roomIndex], last_message: data.message, unread_count: prevRooms[roomIndex].unread_count + 1 };
                    const newRooms = [...prevRooms];
                    newRooms.splice(roomIndex, 1);
                    return [updatedRoom, ...newRooms];
                }
                return prevRooms;
            });
        });

        socket.on('receive_message', (data: any) => {
            if (data.roomId === activeRoomIdRef.current) {
                const newMessage: ChatMessage = {
                    id: Date.now(), sender_id: data.senderId, sender_type: data.senderType, message: data.message, is_read: 0, created_at: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMessage]);
            }
        });

        return () => { socket.off('new_customer_message'); socket.off('receive_message'); };
    }, [socket]);

    const handleSelectRoom = async (roomId: number) => {
        setActiveRoomId(roomId);
        setChatPage(1);
        setHasMore(true);

        try {
            const res = await chatService.getRoomMessages(roomId, 1);
            const fetchedMessages = res.data.messages;

            setMessages(fetchedMessages.reverse());

            if (fetchedMessages.length < 10) {
                setHasMore(false);
            }

            socket?.emit('join_chat', roomId);
            await chatService.markAsRead(roomId);
            setRooms(prev => prev.map(r => r.room_id === roomId ? { ...r, unread_count: 0 } : r));
        } catch (error) {
            console.error("Lỗi khi tải phòng chat:", error);
        }
    };

    // ĐÃ SỬA: Bảo vệ hàm tải thêm bằng loadingRef
    const handleLoadMore = async () => {
        if (!activeRoomId || !hasMore || loadingRef.current) return;

        loadingRef.current = true; // Khóa cửa không cho ai gọi nữa
        setIsLoadingMore(true);

        try {
            const nextPage = chatPage + 1;
            const res = await chatService.getRoomMessages(activeRoomId, nextPage);
            const newMessages = res.data.messages;

            if (newMessages.length > 0) {
                setMessages(prev => [...newMessages.reverse(), ...prev]);
                setChatPage(nextPage);
            }

            if (newMessages.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Lỗi tải thêm lịch sử:", error);
        } finally {
            loadingRef.current = false; // Mở khóa
            setIsLoadingMore(false);
        }
    };

    const handleSendMessage = (text: string) => {
        if (!socket || !activeRoomId) return;

        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        const payload = { roomId: activeRoomId, senderId: userInfo.id, senderType: "STAFF", message: text };

        socket.emit('send_message', payload);
        setRooms(prev => prev.map(r => r.room_id === activeRoomId ? { ...r, last_message: text } : r));
    };

    const activeRoomObj = rooms.find(r => r.room_id === activeRoomId) || null;

    return (
        <Box className="card shadow-sm border-0" sx={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
            <ChatRoomList rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={handleSelectRoom} />
            <ChatWindow activeRoom={activeRoomObj} messages={messages} onSendMessage={handleSendMessage} onLoadMore={handleLoadMore} isLoadingMore={isLoadingMore} hasMore={hasMore} />
        </Box>
    );
};

export default ChatPage;