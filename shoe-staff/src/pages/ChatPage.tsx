import { useState, useEffect } from 'react';
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

    // 1. Khởi tạo dữ liệu phòng và Socket
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

        // Kết nối Socket kèm Token (Khớp với socket.handshake.auth.token của BE)
        const token = localStorage.getItem('access_token');
        const newSocket = io('http://localhost:8000', {
            auth: { token }
        });

        setSocket(newSocket);

        return () => { newSocket.close(); };
    }, []);

    // 2. Lắng nghe các sự kiện Socket toàn cục
    useEffect(() => {
        if (!socket) return;

        // Bắt sự kiện có tin nhắn từ khách (Khớp với io.emit('new_customer_message') của BE)
        socket.on('new_customer_message', (data: { roomId: number, message: string }) => {
            setRooms(prevRooms => {
                const roomIndex = prevRooms.findIndex(r => r.room_id === data.roomId);
                if (roomIndex > -1) {
                    const updatedRoom = {
                        ...prevRooms[roomIndex],
                        last_message: data.message,
                        unread_count: prevRooms[roomIndex].unread_count + 1
                    };
                    const newRooms = [...prevRooms];
                    newRooms.splice(roomIndex, 1);
                    return [updatedRoom, ...newRooms]; // Đẩy phòng có tin mới lên đầu
                }
                return prevRooms;
            });
        });

        // Bắt sự kiện nhận tin nhắn mới (Khớp với io.to(room).emit('receive_message') của BE)
        socket.on('receive_message', (data: any) => {
            const newMessage: ChatMessage = {
                id: Date.now(),
                sender_id: data.senderId,
                sender_type: data.senderType,
                message: data.message,
                is_read: 0,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMessage]);
        });

        return () => {
            socket.off('new_customer_message');
            socket.off('receive_message');
        };
    }, [socket]);

    // 3. Xử lý khi click vào 1 phòng
    const handleSelectRoom = async (roomId: number) => {
        setActiveRoomId(roomId);

        try {
            // Tải lịch sử tin nhắn
            const res = await chatService.getRoomMessages(roomId, 1);
            setMessages(res.data.reverse()); // Đảo ngược mảng để tin mới nhất nằm dưới

            // SỬA Ở ĐÂY: Truyền trực tiếp roomId thay vì object { roomId } để khớp với BE
            socket?.emit('join_chat', roomId);

            // Đánh dấu đã đọc
            await chatService.markAsRead(roomId);

            // Reset số lượng chưa đọc trên UI nội bộ của list
            setRooms(prev => prev.map(r => r.room_id === roomId ? { ...r, unread_count: 0 } : r));
        } catch (error) {
            console.error("Lỗi khi tải phòng chat:", error);
        }
    };

    // 4. Xử lý Gửi tin nhắn
    const handleSendMessage = (text: string) => {
        if (!socket || !activeRoomId) return;

        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

        // Payload khớp hoàn toàn với cấu trúc data Backend mong đợi
        const payload = {
            roomId: activeRoomId,
            senderId: userInfo.id,
            senderType: "STAFF",
            message: text
        };

        socket.emit('send_message', payload);

        // Cập nhật last_message ở cột trái
        setRooms(prev => prev.map(r => r.room_id === activeRoomId ? { ...r, last_message: text } : r));
    };

    const activeRoomObj = rooms.find(r => r.room_id === activeRoomId) || null;

    return (
        <Box
            className="card shadow-sm border-0"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: 'calc(100vh - 120px)',
                overflow: 'hidden'
            }}
        >
            <ChatRoomList rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={handleSelectRoom} />
            <ChatWindow activeRoom={activeRoomObj} messages={messages} onSendMessage={handleSendMessage} />
        </Box>
    );
};

export default ChatPage;