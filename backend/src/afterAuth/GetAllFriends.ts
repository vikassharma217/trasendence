import { FastifyInstance } from 'fastify';

interface UserInfo {
    id: number;
    username: string;
    avatarPath: string;
    status: string;
}

interface FriendInfo {
    username: string;
    avatarPath: string;
    status: string;
}

interface GameInformation {
    winTimes: number;
    loseTimes: number;
    drawTimes: number;
    totalTimes: number;
}

interface ReturnedData {
    friendInfo: FriendInfo;
    gameInformation: GameInformation;
}

export default function GetAllFriends(server: FastifyInstance) {
    server.get('/api/friends', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const email = request.email;

            // Get the current user's ID
            const id1 = await server.sqlite.get(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );
            if (!id1) {
                return reply.status(404).send({ message: "User not found" });
            }
            const currentUserId = id1.id;

            // Get the user's friends
            const rows = await server.sqlite.all(
                "SELECT * FROM friends WHERE userId = ?",
                [currentUserId]
            );

            const userInfo: UserInfo[] = [];
            const friendInfo: FriendInfo[] = [];

            for (const user of rows) {
                const friendName = user.friendName;

                // Get friend details
                const friendRow = await server.sqlite.get(
                    "SELECT * FROM users WHERE username = ?",
                    [friendName]
                );
                if (friendRow) {
                    const { id, username, avatarPath, status } = friendRow;
                    userInfo.push({ id, username, avatarPath, status });
                    friendInfo.push({ username, avatarPath, status });
                }
            }

            const gameInformation: GameInformation[] = [];

            for (const user of userInfo) {
                const userId = user.id;

                // Get game information
                const gameRow = await server.sqlite.get(
                    "SELECT * FROM gameInfo WHERE userId = ?",
                    [userId]
                );
                if (!gameRow) {
                    gameInformation.push({
                        winTimes: 0,
                        loseTimes: 0,
                        drawTimes: 0,
                        totalTimes: 0,
                    });
                } else {
                    const { winTimes, loseTimes, drawTimes, totalTimes } = gameRow;
                    gameInformation.push({ winTimes, loseTimes, drawTimes, totalTimes });
                }
            }

            // Combine friend info and game information
            const res: ReturnedData[] = friendInfo.map((user, index) => ({
                friendInfo: user,
                gameInformation: gameInformation[index],
            }));

            return reply.status(200).send(res);
        } catch (error) {
            console.error("Error validating token:", error);
            return reply.status(500).send({ message: "Failed to validate token" });
        }
    });
}