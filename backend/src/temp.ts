import { FastifyInstance } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function TestUpload(server: FastifyInstance) {
  // Ensure the 'public' directory exists
  const publicDir = path.join(__dirname, "../../public");
  console.log("Public directory path aaaaa:", __dirname, publicDir);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  server.post("/testUpload",{ preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      const email = request.email;
      const data = await request.file(); // Access the uploaded file
      if (!data) {
        return reply.status(400).send({ message: "No file uploaded" });
      }

      const filePath = path.join(publicDir, data.filename);

      console.log("File path for upload in temp :", filePath);
      // Save the file to the 'public' folder
      const writeStream = fs.createWriteStream(filePath);
      await data.file.pipe(writeStream);

      // Construct the public URL for the uploaded file
      const avatarPath = `/public/${data.filename}`;
      if (avatarPath !== "") {
        await server.sqlite.run(
          "UPDATE users SET avatarPath = ? WHERE email = ?",
          [avatarPath, email]
        );
      }
      return reply.status(200).send({ message: `File uploaded successfully`, avatarPath });
    } catch (error) {
      console.error("Error handling file upload:", error);
      return reply.status(500).send({ message: "Failed to upload file" });
    }
  });
} 