import { FastifyInstance } from 'fastify';
import { passwordCompare } from '../utils/passwordCode.js';
// import  {logToLogstash}  from '../utils/logger.js';
// import { LogData } from '../utils/logDatas.js';

export default function LoginRouter(server: FastifyInstance) {
  server.post('/api/signin', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    try {
      // Query the database for the user
      const rows = await server.sqlite.all(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return reply.status(401).send({ message: 'Invalid username or password' });
      }

      const user = rows[0];

      if (passwordCompare(password, user.password)) {
        // Check if the user is already active
        if (user.status === 'active') {
          return reply.status(401).send({ message: 'User already active' });
        }

        const token = server.jwt.sign({ username: user.email }, { expiresIn: '5h' });

        // Set the session cookie
        reply.setCookie('session', token, {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 5 * 60 * 60, // 5 hours
        });

        // Update the user's status and last active time in the database
        await server.sqlite.run(
          'UPDATE users SET status = ?, jwttoken = ?, last_active = CURRENT_TIMESTAMP WHERE username = ?',
          ['active', token, user.username]
        );

        return reply.status(200).send({ access_token: token });
      } else {
        return reply.status(401).send({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}