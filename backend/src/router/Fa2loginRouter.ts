import { FastifyInstance } from 'fastify';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import { LogData } from '../utils/logDatas.js';
// import { logToLogstash } from '../utils/logger.js';

dotenv.config();
const myEmail = process.env.SMTP_USER;
const myPassword = process.env.SMTP_PASS;

// API to send otp 2FA to user on email
export default function Fa2loginRouter(server: FastifyInstance) {
  server.post("/api/send-2fa-token", async (request, reply) => {
    const { email } = request.body as { email: string };

    // const f2alogData: LogData  = {
    //   event: 'f2alogin-success',
 
    //   message: '2FA token request to send success',
    //   method: request.method,
    //   url: request.url,
    //   username: request.user?.username || 'anonymous', // Log the username
    //   ip: request.ip, // Log the client's IP address
    //   userAgent: request.headers['user-agent'] || 'unknown', // Log the User-Agent
    //   isConnectionSecure: request.protocol === 'https', // Log if the connection is secure
    //   statusCode: 200,
    // }
      


    if (!email) {
      // f2alogData.event = 'f2alogin-error';
      // f2alogData.message = 'Email is required';
      // f2alogData.statusCode = 400;
      // logToLogstash(f2alogData);
      return reply.status(400).send({ message: 'Email is required' });
    }

    try {
      // Query the database for the user
      const rows = await server.sqlite.all(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

     if (rows.length === 0) {
        return reply.status(404).send({ message: 'Email not found' });
      }

      const user = rows[0];
      if (user.email !== email) {
        return reply.status(404).send({ message: 'Email not valid' });
      }

      // Generate a random 6-digit number as the 2FA token
      const number = Math.floor(100000 + Math.random() * 900000).toString();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: myEmail,
          pass: myPassword,
        },
      });

      const mailOptions = {
        from: myEmail,
        to: email,
        subject: 'Your 2FA Token',
        text: `Your 2FA token is: ${number}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      return reply.status(200).send({ token: number, message: 'Token sent to email' });
    } catch (error) {
      console.error('Error during sending token:', error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}