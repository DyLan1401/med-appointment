// src/echo.js
import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.io = io;

export const EchoClient = new Echo({
    broadcaster: 'pusher',
    key: 'local', // trùng với PUSHER_APP_KEY trong .env
    wsHost: '127.0.0.1',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});