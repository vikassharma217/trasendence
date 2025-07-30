import { FastifyInstance, FastifyRequest } from 'fastify';

export default function GetUserInfo(server: FastifyInstance) {
    server.get('/api/userInfo', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const email = request.email;

            // Query to get user information
            const user = await server.sqlite.get(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (!user) {
                return reply.status(404).send({ message: "User not found" });
            }

            return reply.status(200).send({ user });
        } catch (error) {
            console.error("Error validating token:", error);
            return reply.status(500).send({ message: "Failed to validate token" });
        }
    });
}