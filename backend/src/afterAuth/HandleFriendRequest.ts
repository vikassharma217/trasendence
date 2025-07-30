import { FastifyInstance } from 'fastify';

export default function HandleFriendRequest(server: FastifyInstance) {
    server.post('/api/send-friend-request', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const { from, to } = request.body as { from: string; to: string };

            // Get the target user's ID
            const targetUser = await server.sqlite.get(
                "SELECT * FROM users WHERE username = ?",
                [to]
            );
            if (!targetUser) {
                return reply.status(404).send({ message: "Target user not found" });
            }
            const targetId = targetUser.id;

            // Get the sender's ID
            const senderUser = await server.sqlite.get(
                "SELECT * FROM users WHERE username = ?",
                [from]
            );
            if (!senderUser) {
                return reply.status(404).send({ message: "Sender user not found" });
            }
            const userId = senderUser.id;

            // Check if the users are already friends
            const existingFriends = await server.sqlite.all(
                "SELECT * FROM friends WHERE userId = ?",
                [userId]
            );

            if (existingFriends.length > 0) {
                for (const friend of existingFriends) {
                    if (friend.friendName === to) {
                        return reply.status(400).send({ message: "Already friends" });
                    }
                }
            }

            // Add the friendship in both directions
            await server.sqlite.run(
                "INSERT INTO friends (userId, friendName) VALUES (?, ?)",
                [targetId, from]
            );
            await server.sqlite.run(
                "INSERT INTO friends (userId, friendName) VALUES (?, ?)",
                [userId, to]
            );

            // Add friend messages
            await server.sqlite.run(
                "INSERT INTO friend_message (userEmail, sender, message) VALUES (?, ?, ?)",
                [targetUser.email, from, `You are added as a friend by ${from}`]
            );
            await server.sqlite.run(
                "INSERT INTO friend_message (userEmail, sender, message) VALUES (?, ?, ?)",
                [request.email, to, `You added ${to} as a friend`]
            );

            return reply.status(200).send({ message: "Friend request sent" });
        } catch (error) {
            console.error("Error validating token:", error);
            return reply.status(400).send({ message: "Failed to validate token" });
        }
    });
}