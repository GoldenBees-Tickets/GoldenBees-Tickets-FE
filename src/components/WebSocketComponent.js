import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCountdown } from '../store/notificationSlice'; 
import io from 'socket.io-client';  

export default function WebSocketComponent() {
  const dispatch = useDispatch();

  useEffect(() => {

    const socket = io('http://localhost:3000');

    socket.on('countdown_start', (time) => {
      dispatch(setCountdown(time));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
}
