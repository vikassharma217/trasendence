import { FastifyInstance } from 'fastify';
// import { getLocalTime } from '../index.js';
// import { logToLogstash } from '../utils/logger.js';
// import { LogData } from '../utils/logDatas.js';

interface TokenPayload {
    username: string;
}

export default function Authenticate(server: FastifyInstance) {
      server.decorate('authenticate', async (request: any, reply: any) => {
      try {
        // Verify the token
        await request.jwtVerify();
  
        const user = request.user;
        const email = user.username;
        // const data:LogData = {
        //     event: 'auth-success',
        //     message: 'Token verified successfully',

         
        //     method: request.method,
        //     url: request.url,
        //     username: request.user?.username || 'anonymous', // Log the username
        //     ip: request.ip, // Log the client's IP address
        //     userAgent: request.headers['user-agent'] || 'unknown', // Log the User-Agent
        //     isConnectionSecure: request.protocol === 'https', // Log if the connection is secure
        //     statusCode: 200,
         
        //   }


         
        if (!email) {
                 
          // data.event = 'auth-error';
          // data.message = 'Invalid token, email not found';
          // data.statusCode = 401;
        

          //         logToLogstash(data);
            return reply.status(401).send({ message: "Invalid token" });
        }
  
  
        // Query the database for the user
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
        const expireInDate  = new Date((rows as any[])[0].expireIn);
        if (expireInDate > new Date()) {

          // data.event = 'auth-error';
          // data.message = 'Invalid token, token expired';
          // data.statusCode = 401;
          // data.username = email;
          //   logToLogstash(data);
            return reply.status(401).send({ message: "Token expired" });
        }
        // Generate a new token
            const token = server.jwt.sign({ username: email }, { expiresIn: '5h' });

            // Update the user's JWT token and last active time in the database
            await server.sqlite.run(
                'UPDATE users SET jwttoken = ?, last_active = CURRENT_TIMESTAMP WHERE email = ?',
                [token, email]
            );

        reply.setCookie('session', token, {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 5 * 60 * 60, // 15 minutes
        });


      
        request.email =  email; 
        // logToLogstash(data);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return reply.status(401).send({ message: 'Invalid or expired token', error: errorMessage });
      }
    });
  }