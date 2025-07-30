import 'fastify';
import { MyJwt } from '../utils/myjwt.js';

declare module 'fastify' {
    interface FastifyInstance {
        jwt: MyJwt; 
    }

    interface FastifyRequest {
        jwtVerify(): Promise<any>; 
        user?: { [key: string]: any }; 
    }
}


import { Database } from 'sqlite';

declare module 'fastify' {
  interface FastifyInstance {
    sqlite: Database;
  }
}