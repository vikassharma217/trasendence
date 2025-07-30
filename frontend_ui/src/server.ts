
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true }); // Create the directory if it doesn't exist
}

const logFile = fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' });

const app = fastify({ logger: {
  level: 'info',
  stream: logFile,
}});

// Serve static files from both public and dist directories
app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // Serve files under the root path
    decorateReply: false, // Avoid adding the `sendFile` decorator multiple times
  });
  
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../dist'),
    prefix: '/dist', // Serve files under /dist
    decorateReply: false, // Avoid adding the `sendFile` decorator multiple times
  });
  
  // Catch-all route to serve index.html for client-side routing
  app.setNotFoundHandler((request, reply) => {
    const filePath = path.join(__dirname, '../public/index.html');
    if (fs.existsSync(filePath)) {
      reply.type('text/html').send(fs.readFileSync(filePath, 'utf-8'));
    } else {
      reply.code(404).send('File not found');
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  // app.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
  //   if (err) {
  //     app.log.error(err);
  //     process.exit(1);
  //   }
  //   app.log.info(`Server is running on ${address}`);
  // });
  const start = async () => {
    try {
        await app.listen({ port: Number(PORT), host: '0.0.0.0' });
        console.log('Server listening at http://localhost:3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();