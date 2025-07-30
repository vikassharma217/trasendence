import { FastifyInstance } from 'fastify';
interface TokenPayload {
  username: string;
}
export default async function Game(server: FastifyInstance) {
    server.get('/api/game',  { preValidation: [server.authenticate] }, async (request, reply) => {

      
    });
  }