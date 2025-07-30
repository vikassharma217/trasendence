import { FastifyInstance } from 'fastify';
import { getLocalTime1 } from '../utils/logger.js';

export default function HandleGameResult(server: FastifyInstance) {
    server.post('/api/game-result', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            console.log("game result");
            const email = request.email;

            const user = await server.sqlite.get(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (!user) {
                console.error("User not found");
                return reply.status(404).send({ message: "User not found" });
            }

            const currentUser = user.username;

            const { player1, player2, myscore, opscore, startTime, endTime } = request.body as {
                player1: string;
                player2: string;
                myscore: number;
                opscore: number;
                startTime: number;
                endTime: number;
            };

            const sender = player1;
            const receiver = player2;

            const user1 = await server.sqlite.get(
                "SELECT * FROM users WHERE username = ?",
                [player1]
            );

            if (!user1) {
                console.error("Player 1 not found");
                return reply.status(404).send({ message: "Player 1 not found" });
            }

            const userid = user1.id;

            const user2 = await server.sqlite.get(
                "SELECT * FROM users WHERE username = ?",
                [player2]
            );

            if (!user2) {
                console.error("Player 2 not found");
                return reply.status(404).send({ message: "Player 2 not found" });
            }

            const opuserid = user2.id;

            const startTime1 = getLocalTime1(startTime);
            const endTime1 = getLocalTime1(endTime);

            const score = `${myscore}:${opscore}`;
            const opscore1 = `${opscore}:${myscore}`;

            const existingGame = await server.sqlite.get(
                "SELECT * FROM details WHERE startDate = ? AND userId = ?",
                [startTime1, userid]
            );

            if (existingGame) {
                console.log("Game result already exists");
                return reply.status(200).send({ message: "Game result already exists" });
            }

            if (myscore > opscore) {
                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, winTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET winTimes = winTimes + 1, totalTimes = totalTimes + 1",
                    [userid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, win, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [userid, receiver, startTime1, endTime1, score]
                );

                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, loseTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET loseTimes = loseTimes + 1, totalTimes = totalTimes + 1",
                    [opuserid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, lose, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [opuserid, sender, startTime1, endTime1, opscore1]
                );
            } else if (myscore < opscore) {
                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, loseTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET loseTimes = loseTimes + 1, totalTimes = totalTimes + 1",
                    [userid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, lose, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [userid, receiver, startTime1, endTime1, score]
                );

                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, winTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET winTimes = winTimes + 1, totalTimes = totalTimes + 1",
                    [opuserid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, win, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [opuserid, sender, startTime1, endTime1, opscore1]
                );
            } else {
                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, drawTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET drawTimes = drawTimes + 1, totalTimes = totalTimes + 1",
                    [userid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, draw, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [userid, receiver, startTime1, endTime1, score]
                );

                await server.sqlite.run(
                    "INSERT INTO gameInfo (userId, drawTimes, totalTimes) VALUES (?, 1, 1) ON CONFLICT(userId) DO UPDATE SET drawTimes = drawTimes + 1, totalTimes = totalTimes + 1",
                    [opuserid]
                );

                await server.sqlite.run(
                    "INSERT INTO details (userId, opponent, startDate, endDate, draw, score) VALUES (?, ?, ?, ?, 1, ?)",
                    [opuserid, sender, startTime1, endTime1, opscore1]
                );
            }

            return reply.status(200).send({ message: "Game result saved successfully" });
        } catch (error) {
            console.error("Error saving game result:", error);
            return reply.status(500).send({ message: "Failed to save game result" });
        }
    });
}


