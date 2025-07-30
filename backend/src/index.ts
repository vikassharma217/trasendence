import fastify from 'fastify';
import formBody from '@fastify/formbody';


// import fastifyCors from '@fastify/cors';
// import fastifyMysql from '@fastify/mysql'; // Use import instead of require
// import logoutRoutes from './router/logout.js';
// import LoginRouter from './router/login.js';
// import { Pool } from 'mysql2/promise';
// import Fa2loginRouter from './router/Fa2loginRouter.js';
// import Verify2faToken from './router/Verify2faToken.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import fastifyCors from '@fastify/cors';
import logoutRoutes from './router/logout.js'; 
import LoginRouter from './router/login.js';
import Fa2loginRouter from './router/Fa2loginRouter.js';
import Verify2faToken from './router/Verify2faToken.js';

import SaveChangePasswordRouter from './components/SaveChangePasswordRouter.js';
import RegisterNewUserRouter from './components/RegisterNewUserRouter.js';
import Authenticate from './router/authenticate.js'; 

import MiddleWareRouter from './router/MiddleWareRouter.js';

import GoogleAuthRouter from './components/GoogleAuthRouter.js'
import Game from './router/Game.js';
import GetUserInfo from './afterAuth/GetUserInfo.js';
import UpdateSettings from './afterAuth/UpdateSettings.js';
import GetProfile from './afterAuth/GetProfile.js';
import GetAllOnlineUsers from './afterAuth/GetAllOnlineUsers.js';
// import HandleInvitation from './afterAuth/HandleInvitation.js';
import fastifyWebsocket from '@fastify/websocket';
import HandleChat from './afterAuth/HandleChat.js';
import GetAllFriends from './afterAuth/GetAllFriends.js';

import HandleFriendRequest from './afterAuth/HandleFriendRequest.js';
import CheckFriendMessage from './afterAuth/CheckFriendMessage.js';

import { MyJwt } from './utils/myjwt.js';


import HandleGame from './afterAuth/HandleGame.js';

import HandleGameResult from './afterAuth/HandleGameResult.js';

import fastifyCookie from '@fastify/cookie';
//import { ResultSetHeader } from 'mysql2';

import fastifyStatic from '@fastify/static';

//import TestUpload from './temp.js';
import sqlitePlugin from './sqlite.js';


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const server = fastify({
    logger: false,  
})

server.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
    prefix: '/api/public/', // URL prefix for accessing static files
  });



  server.register(sqlitePlugin);





const myJwt = new MyJwt({
    secret: process.env.SECRET_KEY || 'default_secret_key',
    expiresIn: '5h', // Default expiration time

});


server.decorate('jwt', myJwt);

server.register(formBody);

import fastifyMultipart from "@fastify/multipart";

server.register(fastifyMultipart);

// Register the cookie plugin
server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'default_cookie_secret', // Optional: Use a secret for signed cookies
});

// server.register(TestUpload); // Register the test upload route

// server.register(fastifyCors, {
//     origin: (origin, cb) => {
//         const allowedOrigins = ['https://localhost', 'https://127.0.0.1', 'http://localhost:3000', 'http://127.0.1:3000'];
//         if (!origin || allowedOrigins.includes(origin)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Not allowed by CORS'), false);
//         }
//     },
//     credentials: true, // Allow cookies
// });


server.register(fastifyCors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            'https://localhost',
            'https://127.0.0.1',
            'http://localhost:3000',
            'http://127.0.1:3000',
        ]; // Add your frontend origin here
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true, // Allow cookies
});


server.addHook('onResponse', async (request, reply) => {
    try {
        if (request.url === '/heartbeat') {
            return; // Skip logging for specific routes
        }
        const fullUrl = `${request.protocol}://${request.hostname}${request.url}`;
        // console.log(`Request Content-Type: ${request.headers['content-type']}`);

        // console.log(`Full Request URL: ${fullUrl}`);
 // Log the request body
 
    } catch (error) {
        console.error('Error logging response to Logstash:', error);
    }
});


server.addHook('onRequest', async (request, reply) => {
 
    request.jwtVerify = async function () {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token not provided');
        }
        try {
            // console.log("token", token);
            const decoded = server.jwt.verify(token);
            request.user = decoded; // Attach the decoded token to the request
        } catch (error) {
            reply.status(401).send({ message: 'Invalid token' });
            throw error;
        }
    };
});



Authenticate(server);
// Register routes
server.register(logoutRoutes);
server.register(LoginRouter);
server.register(Fa2loginRouter);
server.register(Verify2faToken)
server.register(SaveChangePasswordRouter);
server.register(RegisterNewUserRouter);
server.register(GoogleAuthRouter);
server.register(MiddleWareRouter);
server.register(Game)
server.register(GetUserInfo);
server.register(UpdateSettings);
server.register(GetProfile);
server.register(GetAllOnlineUsers);
server.register(fastifyWebsocket);
server.register(HandleChat);
server.register(GetAllFriends);
server.register(HandleFriendRequest);
server.register(CheckFriendMessage);
server.register(HandleGame);
server.register(HandleGameResult);




// the heartbeat route onls check if the user is logged in and update the last active time
// the login route will set the cookie and create jwt token
// auth middleware will check if the user is logged in and if the token is valid
// refresh token and reset session


server.post('/heartbeat', async (request, reply) => {
    try {
      const token = request.cookies.session;
      if (!token) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }
  
      const decoded = server.jwt.verify(token) as { username: string };
      await server.sqlite.run(
        'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE username = ?',
        [decoded.username]
    );
  
      return reply.status(200).send({ message: 'Heartbeat received' });
    } catch (error) {
        throw error;
    }
  });




//


//Periodically clean up inactive users
setInterval(async () => {
    try {
        // Explicitly type the query result as ResultSetHeader
        const result = await server.sqlite.run(
            `UPDATE users 
             SET status = ? 
             WHERE status = ? 
             AND last_active < DATETIME('now', '-5 minutes')`,
            ['inactive', 'active']
        );
        console.log(`Cleaned up ${result.changes} inactive users.`);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}, 60 * 1000); // Run every  minutes



const start = async () => {
    try {
        await server.listen({ port: 8080, host: '0.0.0.0' });
        console.log('Server listening at http://localhost:8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
