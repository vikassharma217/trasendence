import { FastifyInstance } from 'fastify';
import { passwordEncode } from '../utils/passwordCode.js';
// import { logToLogstash } from '../utils/logger.js';
// import { LogData } from '../utils/logDatas.js';

export default function RegisterNewUserRouter(server: FastifyInstance) {
  server.post('/api/register', async (request, reply) => {
    const { username,email, password } = request.body as { username: string; email:string; password: string };

    try {


      // const data:LogData = {
      //     event: 'register-success',
      //     message: 'new user register successfully',

        
      //     method: request.method,
      //     url: request.url,
      //     username: request.user?.username || 'anonymous', // Log the username
      //     ip: request.ip, // Log the client's IP address
      //     userAgent: request.headers['user-agent'] || 'unknown', // Log the User-Agent
      //     isConnectionSecure: request.protocol === 'https', // Log if the connection is secure
      //     statusCode: 200,
        
      //   }
      
      
      // Hash the password
      const hashedPassword = passwordEncode(password);
      const rows = await server.sqlite.get(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (rows) {
        return reply.status(409).send({ message: 'Username or email already exists' });
      }
     

      // Insert the new user into the database
      await server.sqlite.run(
        'INSERT INTO users (username, password, email, status, avatarPath) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, email, 'inactive', '/public/df.jpeg']
      );
      // logToLogstash(data);

      return reply.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
