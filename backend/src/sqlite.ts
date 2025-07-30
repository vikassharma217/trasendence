import fp from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default fp(async (fastify) => {
  // Open the SQLite database asynchronously
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });

  // Enable foreign key support
  await db.exec('PRAGMA foreign_keys = ON;');
  // const schema = await db.all('PRAGMA table_info(users);');
  // console.log(schema);
  // Read and execute the SQL initialization script
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const initScriptPath = path.join(__dirname, '../init-scripts/init.sql');
  const initScript = fs.readFileSync(initScriptPath, 'utf-8');
  await db.exec(initScript);

  // Decorate Fastify instance with the SQLite database
  fastify.decorate('sqlite', db);

  // Close the database connection when the server shuts down
  fastify.addHook('onClose', async (instance) => {
    await db.close();
  });
});