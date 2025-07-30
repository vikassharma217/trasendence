import { FastifyInstance } from 'fastify';
// import { LogData } from '../utils/logDatas.js';
// import { logToLogstash } from '../utils/logger.js';



export default async function logoutRoutes(server: FastifyInstance) {
  server.get('/api/logout', async (request, reply) => {
    try {
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        return reply.status(400).send({ message: 'Token not provided' });
      }

      const decoded = server.jwt.decode<{ username: string }>(token);
      if (!decoded || !decoded.username) {
        return reply.status(400).send({ message: 'Invalid token' });
      }

      const username = decoded.username;

      console.log('Logging out user:', username);
      // Update the jwttoken column to null in SQLite
      await server.sqlite.run(
        'UPDATE users SET jwttoken = NULL WHERE email = ?',
        [username]
      );

      // Update the status column to 'inactive' in SQLite
      await server.sqlite.run(
        'UPDATE users SET status = ? WHERE email = ?',
        ['inactive', username]
      );

      // Clear the session cookie
      reply.clearCookie('session', { path: '/' });

      return reply.status(200).send({ message: 'Successfully logged out' });
    } catch (error) {
      console.error('Logout error:', error);
      return reply.status(500).send({ message: 'Failed to log out' });
    }
  });
}