import { FastifyInstance } from 'fastify';
import { passwordEncode } from '../utils/passwordCode.js';

// import { logToLogstash } from '../utils/logger.js';
// import { LogData } from '../utils/logDatas.js';

export default function SaveChangePasswordRouter(server: FastifyInstance) {
  server.post('/api/change-password', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    console.log('Received request to change password:', { email, password });

    try {
      if (!email || !password) {
        return reply.status(401).send({ message: 'Email and password are required' });
      }

      // Check if the user exists
      const user = await server.sqlite.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return reply.status(404).send({ message: 'Email not found' });
      }

      if (user.email !== email) {
        return reply.status(404).send({ message: 'Email not valid' });
      }

      // Hash the new password
      const hashedPassword = passwordEncode(password);

      // Update the user's password in the database
      await server.sqlite.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );

      console.log('Password updated successfully for email:', email);
      return reply.status(200).send({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password update:', error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}