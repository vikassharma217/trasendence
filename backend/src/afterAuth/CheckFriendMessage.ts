import { FastifyInstance } from 'fastify';

export default function CheckFriendMessage(server: FastifyInstance) {
    server.get('/api/friend-message', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {


            const email = request.email
            // Query the SQLite database
            const user = await server.sqlite.get(
                "SELECT * FROM friend_message WHERE userEmail = ?",
                [email]
            );
            // const user = (rows as any[])[0];
            // //console.log("friend message", user);


            return reply.status(200).send({ message: user });
        } catch (error) {
            console.log("Error validating token:", error);
            return reply.status(200).send({ message: "Failed to validate token" });
        }
    });
}