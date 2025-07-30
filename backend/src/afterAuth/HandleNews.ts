import { FastifyInstance } from 'fastify';
// import { WebSocket } from 'ws'; // Import WebSocket type from the ws library

// interface WebSocketClients {
//     [username: string]: WebSocket;
// }

// const clients: WebSocketClients = {};

export default function HandleNews(server: FastifyInstance) {
    // server.get('/ws-news', { websocket: true }, async (connection, req) => {
    //     const queryParams = new URLSearchParams(req.url?.split('?')[1]);
    //     const username = queryParams.get('username');
    //     const token = queryParams.get('token');
    //     console.log('Query Params:', queryParams);
    //     console.log('Username:', username);
    //     console.log('Token:', token);
    //     if (!username || !token) {
    //         connection.close(1008, 'Username and token are required');
    //         return;
    //     }

    //     // // Verify the token using fastify-jwt
    //     // try {
    //     //     const decoded = await server.jwt.verify(token);

    //     //     if (decoded.username !== username) {
    //     //         connection.close(1008, 'Invalid token for the provided username');
    //     //         return;
    //     //     }
    //     // } catch (error) {
    //     //     console.error('Token verification failed:', error);
    //     //     connection.close(1008, 'Invalid or expired token');
    //     //     return;
    //     // }

    //     // Store the WebSocket connection
    //     clients[username] = connection as WebSocket;
    //     console.log(`User connected: ${username}`);

       


    //     // Handle WebSocket close event
    //     connection.on('close', () => {
    //         delete clients[username];
    //         console.log(`User disconnected: ${username}`);
    //     });
    // });
}