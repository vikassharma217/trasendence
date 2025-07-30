// import { FastifyInstance } from 'fastify';
// import dotenv from 'dotenv';
// import { passwordEncode } from '../utils/passwordCode.js';


// dotenv.config();

// export default function GoogleAuthRouter(server: FastifyInstance) {
//     server.get('/api/auth/google/callback', async (request, reply) => {
//         const { code } = request.query as { code: string };
        
//         try {

//             const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: new URLSearchParams({
//                     code: code, // Use the full authorization code here
//                     client_id: process.env.GOOGLE_CLIENT_ID!, // Your Google client ID
//                     client_secret: process.env.GOOGLE_CLIENT_SECRET!, // Your Google client secret
//                     redirect_uri: 'https://localhost/api/auth/google/callback', // Must match the redirect URI used in the frontend
//                     grant_type: 'authorization_code',
//                 }),
//             });
            
//             if (!tokenResponse.ok) {
//                 console.error('Failed to exchange authorization code for access token:', await tokenResponse.text());
//                 throw new Error('Failed to exchange authorization code for access token');
//             }
            
//             const tokenData = await tokenResponse.json();
//             const accessToken = tokenData.access_token; // This is the access token you need
     

//             // Fetch user info from Google
//             const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`, // Use the access token here
//                 },
//             });
            
//             if (!userInfoResponse.ok) {
//                 console.error('Failed to fetch user info:', await userInfoResponse.text());
//                 throw new Error('Failed to fetch user info');
//             }
            
//             const userInfo = await userInfoResponse.json();
//             const { email, name } = userInfo;

//             // check if email is provided
//             if (!email || !name) {
//                 console.error('Email or name not provided by Google user info');
//                 return reply.status(400).send({ message: 'Email or name not provided by Google user info' });
//             }


//             const token = server.jwt.sign({ username: email }, { expiresIn: '5h' });
//             reply.setCookie('session', token, {
//                 path: '/',
//                 httpOnly: true,
//                 secure: true,
//                 maxAge: 5 * 60 * 60, // 15 minutes
//               });

//             // Check if the user already exists
//             const [rows] = await server.mysql.query(
//                 'SELECT * FROM users WHERE username = ? AND email = ?',
//                 [name, email]
//             );
//             // if there is no rows, it means the user does not exist
//             // create a new user
//             if (!rows || (rows as any[]).length === 0) {    
//                 const hashedPassword = passwordEncode("password");
//                 await server.mysql.query(
//                     'INSERT INTO users (username, password, email, status, avatarPath) VALUES (?, ?, ?, ?, ?)',
//                     [name, hashedPassword, email, "inactive", "df.jpeg"]
//                   );
//             }

//             await server.mysql.query(
//                 'UPDATE users SET status = ? WHERE email = ?',
//                 ['active', email]
//               );
//               await server.mysql.query(
//                 'UPDATE users SET jwttoken = ? WHERE email = ?',
//                 [token, email]
//               );
//               await server.mysql.query(
//                 'UPDATE users SET last_active = NOW() WHERE email = ?',
//                 [email]
//               );



//             // console.log('User authenticated successfully:', { token, name });
    

//             // Redirect to the home page with the token as a query parameter
//             return reply.redirect(`/google-callback?token=${token}`);
//         } catch (error) {
//             console.error('Error during Google authentication:', error);
//             return reply.status(500).send({ message: 'Internal server error' });
//         }
//     });
// }


import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import { GoogleOAuth } from './googleOAuth.js';
import { passwordEncode } from '../utils/passwordCode.js';

dotenv.config();

export default function GoogleAuthRouter(server: FastifyInstance) {
    const googleOAuth = new GoogleOAuth({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: 'https://localhost/api/auth/google/callback',
    });

    // Redirect to Google authorization URL
    server.get('/api/auth/google', async (request, reply) => {
        const authUrl = googleOAuth.generateAuthUrl(['email', 'profile']);
        reply.redirect(authUrl);
    });

    // Handle Google callback
    server.get('/api/auth/google/callback', async (request, reply) => {
        const { code } = request.query as { code: string };

        try {
            // Exchange authorization code for access token
            const accessToken = await googleOAuth.getAccessToken(code);

            // Fetch user info
            const { email, name } = await googleOAuth.getUserInfo(accessToken);

            if (!email || !name) {
                console.error('Email or name not provided by Google user info');
                return reply.status(400).send({ message: 'Email or name not provided by Google user info' });
            }

            // Generate a JWT token
            const token = server.jwt.sign({ username: email }, { expiresIn: '5h' });

            // Set the session cookie
            reply.setCookie('session', token, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: 5 * 60 * 60, // 5 hours
            });

            // Check if the user exists or create a new one
            const rows = await server.sqlite.get(
                'SELECT * FROM users WHERE username = ? AND email = ?',
                [name, email]
            );
    
            if (!rows) {
                const hashedPassword = passwordEncode('password');
                await server.sqlite.run(
                    'INSERT INTO users (username, password, email, status, avatarPath) VALUES (?, ?, ?, ?, ?)',
                    [name, hashedPassword, email, 'inactive', '/public/df.jpeg']
                );
            }
    
            await server.sqlite.run('UPDATE users SET status = ? WHERE email = ?', ['active', email]);
            await server.sqlite.run('UPDATE users SET jwttoken = ? WHERE email = ?', [token, email]);
            await server.sqlite.run('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE email = ?', [email]);
    

            // Redirect to the frontend with the token
            return reply.redirect(`/google-callback?token=${token}`);
        } catch (error) {
            console.error('Error during Google authentication:', error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}