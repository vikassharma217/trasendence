import { FastifyInstance } from 'fastify';

interface UserInfo {
    id: number;
    username: string;
    avatarPath: string;
}

interface GameInformation {
    winTimes: number;
    loseTimes: number;
    drawTimes: number;
    totalTimes: number;
}

interface ReturnedData {
    userInfo: UserInfo;
    gameInformation: GameInformation;
}

export default function GetAllOnlineUsers(server: FastifyInstance) {
    server.get('/api/online-users', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const email = request.email;

            // Query to get all active users
            const rows = await server.sqlite.all(
                "SELECT * FROM users WHERE status = ?",
                ["active"]
            );

            const userInfo: UserInfo[] = rows.map((user: any) => ({
                id: user.id,
                username: user.username,
                avatarPath: user.avatarPath,
            }));

            const gameInformation: GameInformation[] = [];

            for (let i = 0; i < userInfo.length; i++) {
                const userId = userInfo[i].id;

                // Query to get game information for each user
                const gameRow = await server.sqlite.get(
                    "SELECT * FROM gameInfo WHERE userId = ?",
                    [userId]
                );

                if (!gameRow) {
                    gameInformation[i] = {
                        winTimes: 0,
                        loseTimes: 0,
                        drawTimes: 0,
                        totalTimes: 0,
                    };
                } else {
                    const { winTimes, loseTimes, drawTimes, totalTimes } = gameRow;
                    gameInformation[i] = {
                        winTimes,
                        loseTimes,
                        drawTimes,
                        totalTimes,
                    };
                }
            }

            // Combine user info and game information
            const res: ReturnedData[] = userInfo.map((user, index) => ({
                userInfo: user,
                gameInformation: gameInformation[index],
            }));

            return reply.status(200).send(res);
        } catch (error) {
            console.error("Error validating token:", error);
            return reply.status(500).send({ message: "Failed to validate token" });
        }
    });
}