import { FastifyInstance } from "fastify";
// import { logToLogstash } from '../utils/logger.js';
// import { LogData } from '../utils/logDatas.js';

export default function Verify2faToken(server: FastifyInstance) {

    server.post("/api/verify-2fa-token", async (request, reply) => {
        const { email } = request.body as { email: string};
            // const f2alogData: LogData  = {
            //   event: 'f2alogin-success',
         
            //   message: '2FA token verification success',
            //   method: request.method,
            //   url: request.url,
            //   username: request.user?.username || 'anonymous', // Log the username
            //   ip: request.ip, // Log the client's IP address
            //   userAgent: request.headers['user-agent'] || 'unknown', // Log the User-Agent
            //   isConnectionSecure: request.protocol === 'https', // Log if the connection is secure
            //   statusCode: 200,
            // }

        if (!email ) {
            // f2alogData.event = 'f2alogin-error';
            // f2alogData.message = 'Email is required in verify token file';
            // f2alogData.statusCode = 400;
            // logToLogstash(f2alogData);
        return reply.status(400).send({ message: "Email is required" });
        }
    
       try {
            // Query the database for the user
            const rows = await server.sqlite.all(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (rows.length === 0) {
                return reply.status(401).send({ message: "Email not found" });
            }

            const user = rows[0];
            if (user.email !== email) {
                return reply.status(401).send({ message: "Email not valid" });
            }

            // Generate a JWT token
            const accessToken = server.jwt.sign(
                { username: user.email },
                { expiresIn: "5h" }
            );

            // Update the user's JWT token and status in the database
            await server.sqlite.run(
                "UPDATE users SET jwttoken = ? WHERE email = ?",
                [accessToken, user.email]
            );
            await server.sqlite.run(
                "UPDATE users SET status = ? WHERE username = ?",
                ["active", user.username]
            );

            // Set the session cookie
            reply.setCookie("session", accessToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                maxAge: 5 * 60 * 60, // 5 hours
            });

            return reply.status(200).send({ access_token: accessToken });
        } catch (error) {
            console.error("Error during token verification:", error);
            return reply.status(500).send({ message: "Internal server error" });
        }
    });

}
