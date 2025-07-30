import { FastifyInstance } from 'fastify';
// this is not used in the project will be removed
export default function MiddleWareRouter(server: FastifyInstance) {
    server.get('/api/validate-token', async (request, reply) => {
        try {
            // Use the globally defined `jwtVerify` method
            await request.jwtVerify();

            // Access the decoded token from `request.user`
            const user = request.user as { username: string };
            const email = user.username;

            // Query the database to validate the user
            const rows = await server.sqlite.all(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (rows.length === 0) {
                return reply.status(401).send({ message: "User not found" });
            }

            if (rows[0].status !== "active") {
                return reply.status(401).send({ message: "User is not logged in" });
            }

            // Check if the token has expired
            const expireInDate = new Date(rows[0].expireIn);
            if (expireInDate < new Date()) {
                return reply.status(401).send({ message: "Token expired" });
            }

            // If everything is valid, return success
            return reply.status(200).send({ message: "Token is valid" });
        } catch (err) {
            console.error('Token validation error:', err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            return reply.status(401).send({ message: errorMessage });
        }
    });
}