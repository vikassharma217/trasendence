import '@fastify/oauth2';
import { Client } from '@elastic/elasticsearch';


declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: import('@fastify/oauth2').OAuth2Namespace;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}


// Extend FastifyRequest to include the 'email' property
declare module 'fastify' {
  interface FastifyRequest {
      email?: string;
  }
}



declare module 'fastify' {
    interface FastifyInstance {
        elasticsearch: Client;
    }
}


declare module 'node-fetch' {
  const fetch: typeof import('node-fetch');
  export default fetch;
}