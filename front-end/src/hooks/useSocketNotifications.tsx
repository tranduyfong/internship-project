import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import PurchaseToast, { type PurchasePayload } from '../components/notifications/PurchaseToast';

const SOCKET_SERVER_URL = 'http://localhost:8000';

const useSocketNotifications = () => {
    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socket.on('new_purchase', (rawPayload: any) => {
            let finalData = rawPayload;

            if (typeof rawPayload === 'string') {
                try {
                    finalData = JSON.parse(rawPayload);
                } catch (e) {
                    return;
                }
            }

            if (finalData && finalData.data) {
                finalData = finalData.data;
            }
            if (finalData && finalData.time) {
                toast(() => <PurchaseToast data={finalData} />, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    style: { borderRadius: '12px', padding: '12px', backgroundColor: '#fff', color: '#000' }
                });
            }
        });

        return () => {
            socket.off('new_purchase');
            socket.disconnect();
        };
    }, []);
};

export default useSocketNotifications;