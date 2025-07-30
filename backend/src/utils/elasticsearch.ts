// import fp from 'fastify-plugin';
// import { FastifyInstance } from 'fastify';
// import { Client } from '@elastic/elasticsearch';

// const elasticsearchClient = new Client({
//     node: process.env.ELASTICSEARCH_NODE || 'https://localhost/elasticsearch',
//     headers: {
//         'Accept': 'application/vnd.elasticsearch+json;compatible-with=8',
//         'Content-Type': 'application/vnd.elasticsearch+json;compatible-with=8',
//     },
//     auth: {
//         username: 'elastic', // Replace with your Elasticsearch username
//         password: 'mypass', // Replace with your Elasticsearch password
//     },
// });

// export default fp(async (server: FastifyInstance) => {
//     server.decorate('elasticsearch', elasticsearchClient);
// });