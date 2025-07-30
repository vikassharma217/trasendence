// import { FastifyInstance } from 'fastify';

// const activeConnections: Map<string, any> = new Map();

// export default function handleInvitation(server: FastifyInstance) {
//     // Define the WebSocket route using server.get
//     server.get('/ws', { websocket: true }, async (connection, req) => {
//         const queryParams = new URLSearchParams(req.url?.split('?')[1]);
//         const username = queryParams.get('username');
//         const token = queryParams.get('token');

//         if (!username || !token) {
//             connection.close(1008, 'Username and token are required');
//             return;
//         }

//         // // Verify the token using fastify-jwt
//         // try {
//         //     const decoded = await server.jwt.verify(token);

//         //     if (decoded.username !== username) {
//         //         connection.close(1008, 'Invalid token for the provided username');
//         //         return;
//         //     }
//         // } catch (error) {
//             console.error('Token verification failed:', error);
//         //     connection.close(1008, 'Invalid or expired token');
//         //     return;
//         // }

//         // Store the connection
//         activeConnections.set(username, connection);

//         console.log(`${username} connected`);

//         // Handle incoming messages
//         connection.on('message', (message: string) => {
//             try {
//                 const data = JSON.parse(message);
//                 console.log('Received message:', data);

//                 if (data.type === 'invitation') {
//                     const { to, from } = data.payload;

//                     if (activeConnections.has(to)) {
//                         const targetSocket = activeConnections.get(to);
//                         targetSocket?.send(
//                             JSON.stringify({
//                                 type: 'invitation',
//                                 payload: { from },
//                             })
//                         );
//                     } else {
//                         connection.send(
//                             JSON.stringify({
//                                 type: 'error',
//                                 payload: { message: `${to} is not online.` },
//                             })
//                         );
//                     }
//                 } else if (data.type === 'invitation-response') {
//                     const { to, status } = data.payload;

//                     if (activeConnections.has(to)) {
//                         const targetSocket = activeConnections.get(to);
//                         targetSocket?.send(
//                             JSON.stringify({
//                                 type: 'invitation-response',
//                                 payload: { status },
//                             })
//                         );
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error processing message:', error);
//                 connection.send(
//                     JSON.stringify({
//                         type: 'error',
//                         payload: { message: 'Invalid message format.' },
//                     })
//                 );
//             }
//         });

//         // Handle disconnection
//         connection.on('close', () => {
//             console.log(`${username} disconnected`);
//             activeConnections.delete(username);
//         });
//     });
// }