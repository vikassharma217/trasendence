import { FastifyInstance } from "fastify";
import { passwordEncode } from '../utils/passwordCode.js';
import { log } from "console";
interface FormateTokenPayload {
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  // email: string;
}
// interface UsernameInterface {
//   username: string;
// }

export default async function UpdateSettings(server: FastifyInstance) {
  server.post("/api/updateSettings", { preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      const email = request.email;

      if (typeof request.body === "string") {
        try {
          request.body = JSON.parse(request.body);
        } catch (error) {
          console.error("Failed to parse JSON string:", error);
          return reply.status(400).send({ message: "Invalid JSON format" });
        }
      }

      const { username, firstname, lastname, phone, address } = request.body as FormateTokenPayload;

      // Update username
      if (username !== "") {
        const existingUser = await server.sqlite.get(
          "SELECT * FROM users WHERE username = ?",
          [username]
        );
        if (existingUser) {
          return reply.status(401).send({ message: "Username already in use" });
        } else {
          await server.sqlite.run(
            "UPDATE users SET username = ? WHERE email = ?",
            [username, email]
          );
        }
      }

      // Update firstname
      if (firstname !== "") {
        await server.sqlite.run(
          "UPDATE users SET firstname = ? WHERE email = ?",
          [firstname, email]
        );
      }

      // Update lastname
      if (lastname !== "") {
        await server.sqlite.run(
          "UPDATE users SET lastname = ? WHERE email = ?",
          [lastname, email]
        );
      }

      // Update phone
      if (phone !== "") {
        await server.sqlite.run(
          "UPDATE users SET phone = ? WHERE email = ?",
          [phone, email]
        );
      }

      // Update address
      if (address !== "") {
        await server.sqlite.run(
          "UPDATE users SET address = ? WHERE email = ?",
          [address, email]
        );
      }

      return reply.status(200).send({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Error updating settings:", error);
      return reply.status(500).send({ message: "Failed to update settings" });
    }
  });
}