// import { FastifyInstance } from 'fastify';
// import { WebSocket } from 'ws';

// interface Player {
//     username: string;
//     connection: WebSocket;
// }

// const games: Record<string, { player1: Player; player2: Player | null }> = {};

// export default function HandleGame(server: FastifyInstance) {
//     server.get('/game-remote', { websocket: true }, (connection, req) => {
//         const params = new URLSearchParams(req.url?.split('?')[1]);
//         const username = params.get('username');
//         const token = params.get('token'); // Validate token if needed

//         if (!username) {
//             connection.close(1008, 'Username is required');
//             return;
//         }

//         console.log(`Player connected: ${username}`);

//         // Match players into a game
//         let gameId = Object.keys(games).find(
//             (id) => !games[id].player2 && games[id].player1.username !== username
//         );

//         if (!gameId) {
//             // Create a new game if no available game exists
//             gameId = `game-${Date.now()}`;
//             games[gameId] = { player1: { username, connection: connection as WebSocket }, player2: null };
//             connection.send(JSON.stringify({ type: 'waiting', message: 'Waiting for an opponent...' }));
//         } else {
//             // Join an existing game
//             games[gameId].player2 = { username, connection: connection as WebSocket };
          
//             const { player1, player2 } = games[gameId];
//             player1.connection.send(JSON.stringify({ type: 'start', opponent: player2!.username }));
//             player2!.connection.send(JSON.stringify({ type: 'start', opponent: player1.username }));
//         }

//         const game = games[gameId];

//         // Handle incoming messages
//         connection.on('message', (message: string | Buffer | ArrayBuffer | Buffer[]) => {
//             const data = JSON.parse(message.toString());

//             if (data.type === 'ball-update') {
//                 // Broadcast ball position to the other player
//                 const opponent = game.player1.connection === connection
//                     ? game.player2?.connection
//                     : game.player1.connection;
//                 if (opponent) {
//                     opponent.send(JSON.stringify({ type: 'ball-update', payload: data.payload }));
//                 }
//             } else if (data.type === 'paddle-update') {
//                 // Broadcast paddle position to the other player
//                 const opponent = game.player1.connection === connection
//                     ? game.player2?.connection
//                     : game.player1.connection;
//                 if (opponent) {
//                     opponent.send(JSON.stringify({ type: 'paddle-update', payload: data.payload }));
//                 }
//             } else if (data.type === 'score-update') {
//                 // Broadcast score update to both players
//                 game.player1.connection.send(JSON.stringify({ type: 'score-update', payload: data.payload }));
//                 if (game.player2) {
//                     game.player2.connection.send(JSON.stringify({ type: 'score-update', payload: data.payload }));
//                 }
//             }
//         });

//         // Handle disconnection
//         connection.on('close', () => {
//             console.log(`Player disconnected: ${username}`);
//             if (game.player1.connection === connection) {
//                 if (game.player2) {
//                     game.player2.connection.send(JSON.stringify({ type: 'opponent-disconnected' }));
//                 }
//             } else if (game.player2 && game.player2.connection === connection) {
//                 game.player1.connection.send(JSON.stringify({ type: 'opponent-disconnected' }));
//             }
//             delete games[gameId];
//         });
//     });
// }
import { FastifyInstance } from 'fastify';
// import { RowDataPacket } from 'mysql2';
// import { send } from 'process';
import { WebSocket } from 'ws'; 

interface GameWebSocketClients {
    [username: string]: WebSocket;
}

const gameClients: GameWebSocketClients = {};

//(`ws://localhost:8080/ws-game?from=${this.currentUser}&to=${this.opponentUser}&token=${token}`);


export default function RemoteGame(server: FastifyInstance) {
    server.get('/api/ws-game', { websocket: true }, async (connection, req) => {
        const queryParams = new URLSearchParams(req.url?.split('?')[1]);
        const sender = queryParams.get('from');
        const receiver = queryParams.get('to');
        const token = queryParams.get('token');

        if (!sender || !receiver || !token) {
            connection.close(1008, 'Username and token are required');
            return;

        
        }

        // Store the WebSocket connection
        gameClients[sender] = connection as WebSocket;

        // Handle incoming messages
        connection.on('message',   (message: string | Buffer | ArrayBuffer | Buffer[]) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.type === 'paddle-move') {
                    const { paddleLeft, paddleDirection, myscore, opscore} = data.payload;

                        // Send the message to a specific user
                        if (gameClients[receiver]) {
                            gameClients[receiver].send(
                                JSON.stringify({
                                    type: 'paddle-move',
                                    payload: { paddleLeft, paddleDirection, myscore, opscore },
                                })
                            );

                        } 
                        
                        else {
                            connection.send(
                                JSON.stringify({
                                    type: 'error',
                                    payload: { message: `${receiver} is not online.` },
                                })
                            );
                        }
                    
                }
                
                else if (data.type === 'game-start') {
                    gameClients[receiver].send(
                        JSON.stringify({
                            type: 'game-start',
                            payload: { message: `${sender} has started the game.` },
                        })
                    );
                }
                else if (data.type === 'score-update') {
                    const { from, to, myscore } = data.payload;
                    // Send the score update to the other user
                    if (gameClients[receiver]) {
                        gameClients[receiver].send(
                            JSON.stringify({
                                type: 'score-update',
                                payload: { myscore },
                            })
                        );
                    }
                }
                else if (data.type === 'game-over') {
                    const { from, to, myscore, opscore, startTime, endTime } = data.payload;
                    // Send the game over message to the other user
                    if (gameClients[receiver]) {
                        gameClients[receiver].send(
                            JSON.stringify({
                                type: 'game-over',
                                payload: { myscore, opscore },
                            })
                        );
                    }

          







                }

                else if (data.type === 'user-exit') {
                    const { to, message } = data.payload;
                
                    // Find the WebSocket connection for the other user and send the message
                    delete gameClients[sender];

                    if (gameClients[to]) {
                      gameClients[to].send(
                        JSON.stringify({
                          type: 'user-exit',
                          payload: { message },
                        })
                      );
                    }
                  }



            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        // Handle WebSocket close event
        connection.on('close', () => {
            delete gameClients[sender];
        });
    });
}