import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

interface WebSocketClients {
  [username: string]: WebSocket;
}

const clients: WebSocketClients = {};

export default function HandleChat(server: FastifyInstance) {
  // Check in database (mail) if user is blocked
  async function isBlocked(from: string, to: string): Promise<boolean> {
    const fromRes = await server.sqlite.get(
      "SELECT email FROM users WHERE username = ?",
      [from]
    );
    const toRes = await server.sqlite.get(
      "SELECT email FROM users WHERE username = ?",
      [to]
    );

    // Validate that both users exist
    if (!fromRes || !toRes) return false;

    const fromEmail = fromRes.email;
    const toEmail = toRes.email;

    const result = await server.sqlite.get(
      "SELECT 1 FROM blocked_users WHERE blocker_email = ? AND blocked_email = ?",
      [toEmail, fromEmail]
    );

    return !!result;
  }

  // Insert a new user into the blocked_users table
  server.post("/api/block-user", async (request, reply) => {
    const { blockerEmail, blockedEmail } = request.body as {
      blockerEmail: string;
      blockedEmail: string;
    };

    try {
      await server.sqlite.run(
        "INSERT OR IGNORE INTO blocked_users (blocker_email, blocked_email) VALUES (?, ?)",
        [blockerEmail, blockedEmail]
      );
      reply.send({ message: "User blocked successfully" });
    } catch (err) {
      console.error("Failed to block user:", err);
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Convert a username to an email to fetch the email of a user
  server.get("/api/get-email/:username", async (request, reply) => {
    const { username } = request.params as { username: string };
    try {
      const result = await server.sqlite.get(
        "SELECT email FROM users WHERE username = ?",
        [username]
      );
      if (!result) {
        reply.status(404).send({ message: "User not found" });
        return;
      }
      reply.send({ email: result.email });
    } catch (err) {
      console.error("Failed to fetch email:", err);
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  // Handle WebSocket connections
  server.get("/api/ws", { websocket: true }, async (connection, req) => {
    const queryParams = new URLSearchParams(req.url?.split("?")[1]);
    const username = queryParams.get("username");
    const token = queryParams.get("token");

    if (!username || !token) {
      connection.close(1008, "Username and token are required");
      return;
    }

    clients[username] = connection as WebSocket;

    // Send new user joining notification
    for (const [clientUsername, client] of Object.entries(clients)) {
      if (clientUsername !== username) {
        client.send(
          JSON.stringify({
            type: "chat-message-all",
            payload: {
              from: clientUsername,
              to: username,
              message: `${username} has joined the chat`,
            },
          })
        );
      }
    }

    // Handel incoming messages based on their type
    connection.on("message", async (message: string | Buffer) => {
      try {
        const data = JSON.parse(message.toString());

        // Chat message, private or general
        if (data.type === "chat-message") {
          const { from, to, message } = data.payload;
          if (!to || to.trim() === "") {
            // Broadcast to everyone except blocked users
            for (const [username, client] of Object.entries(clients)) {
              if (username === from) continue;
              if (await isBlocked(from, username)) {
                console.log(`General message blocked: ${from} → ${username}`);
                continue;
              }
              client.send(
                JSON.stringify({
                  type: "chat-message-all",
                  payload: { from, username, message },
                })
              );
            }
          } else {
            // Private message
            if (await isBlocked(from, to)) {
              console.log(`Private message blocked: ${from} → ${to}`);
              return;
            }

            if (clients[to]) {
              clients[to].send(
                JSON.stringify({
                  type: "chat-message",
                  payload: { to, from, message },
                })
              );
            } else {
              console.log(`User ${to} is not connected`);
            }
          }
        }

        // Chat (introduction)
        else if (data.type === "chat") {
          const { from, to } = data.payload;
          if (clients[to]) {
            clients[to].send(
              JSON.stringify({
                type: "chat",
                payload: {
                  from,
                  to,
                  message: `${from} says hello to you, you can chat now`,
                },
              })
            );
          }
        }

        // Send a game invitation request
        else if (data.type === "invite") {
          const { from, to } = data.payload;
          if (clients[to]) {
            clients[to].send(
              JSON.stringify({
                type: "invite",
                payload: { from, to },
              })
            );
          }
        }

        // Respond to a game invitation request
        else if (data.type === "accept-invite") {
          const { from, to } = data.payload;
          if (clients[to]) {
            clients[to].send(
              JSON.stringify({
                type: "accept-invite",
                payload: { from, to },
              })
            );
          } else {
            console.log(`User ${to} is not connected`);
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    connection.on("close", () => {
      delete clients[username];
      console.log(`User disconnected: ${username}`);
    });
  });
}
