import { Box, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Avatar, Typography, Badge, Divider } from '@mui/material';
import type { ChatRoom } from '../../types/types';

interface ChatRoomListProps {
    rooms: ChatRoom[];
    activeRoomId: number | null;
    onSelectRoom: (roomId: number) => void;
}

const ChatRoomList = ({ rooms, activeRoomId, onSelectRoom }: ChatRoomListProps) => {
    return (
        // Dùng flex: 1 để đảm bảo luôn chiếm đúng 1 phần (tương đương 1/4 tổng không gian)
        <Box sx={{ flex: 1, borderRight: '1px solid #eee', overflowY: 'auto', backgroundColor: '#fff', height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 700, borderBottom: '1px solid #eee' }}>Tin nhắn</Typography>
            <List disablePadding>
                {rooms.map((room) => {
                    const isUnread = room.unread_count > 0;
                    return (
                        <div key={room.room_id}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={activeRoomId === room.room_id}
                                    onClick={() => onSelectRoom(room.room_id)}
                                    sx={{ backgroundColor: activeRoomId === room.room_id ? '#e3f2fd' : 'transparent' }}
                                >
                                    <ListItemAvatar>
                                        <Badge badgeContent={room.unread_count} color="error">
                                            <Avatar sx={{ bgcolor: '#1976d2' }}>{room.customer_name.charAt(0)}</Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: isUnread ? 700 : 500, fontSize: '15px' }}>
                                                {room.customer_name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontSize: '13px',
                                                    color: isUnread ? '#333' : '#777',
                                                    fontWeight: isUnread ? 600 : 400
                                                }}
                                            >
                                                {room.last_message}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                        </div>
                    );
                })}
            </List>
        </Box>
    );
};

export default ChatRoomList;