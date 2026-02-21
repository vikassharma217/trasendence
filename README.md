# Transcendence – Full-Stack Multiplayer Web Gaming Platform

A **real-time multiplayer Pong-style gaming platform** built as part of the 42 Vienna software engineering curriculum.  
The platform integrates modern **web technologies, authentication, chat, tournaments, and blockchain score storage** — designed for scalability, modularity, and extensibility.

---

## Mandatory Requirements 

- **Single-Page Application (SPA)** with browser back/forward support
- **Real-Time Multiplayer Pong** using WebSockets
- **Docker Containerization** with docker-compose
- **Registration & Login System** with password hashing
- **Security**
  - Protection against SQL injections/XSS attacks
  - HTTPS/WSS enforced
  - Input validation on both client and server
- **Tournament System** with multiple players and automated matchmaking
- **Browser Compatibility** (Firefox and other modern browsers)

---

## Implemented Modules 

### **Web Modules**
 **Backend Framework (Major)** - Fastify with Node.js
 **Frontend Framework (Minor)** - TypeScript + Tailwind CSS
 **Database (Minor)** - SQLite for persistent data storage
 **Blockchain (Major)** - Avalanche testnet for tournament score storage

### **User Management**
- **Standard User Management (Major)**
  - Secure registration and login
  - User profiles with stats (wins/losses)
  - Avatar upload with defaults
  - Friend system with online status
  - Match history tracking
-  **Remote Authentication (Major)** - Google Sign-in OAuth integration

### **Gameplay & User Experience**
 **Remote Players (Major)** - Real-time multiplayer across networks
 **Multiplayer (Major)** - 1v1, 2v2, and extended multiplayer modes
 **Another Game (Major)** - Additional game modes with matchmaking
 **Live Chat (Major)**
  - Direct messaging between players
  - User blocking functionality
  - Game invitations through chat
  - Tournament match notifications
  - Profile access from chat interface

### **AI & Analytics**
 **AI Opponent (Major)** - Bot player with strategic gameplay
 **Stats Dashboard (Minor)** - User and game statistics visualization

### **Security**
 **Two-Factor Authentication (2FA) & JWT (Major)**
  - TOTP-based 2FA
  - JWT token-based session management
  - Secure authentication flows

### **DevOps & Logging**
 **ELK Stack Integration (Major)**
  - Elasticsearch for log indexing and storage
  - Logstash for log collection and processing
  - Kibana for log visualization and analysis

### **Graphics**
 **Advanced 3D Techniques (Major)** - Babylon.js for immersive 3D Pong experience

---

## Features

- **Real-Time Multiplayer Pong** using WebSockets
- **3D Game Rendering** with Babylon.js
- **Blockchain-Secured Scores** on Avalanche testnet
- **Comprehensive Authentication** (JWT + 2FA + Google OAuth)
- **Chat System** with messaging and game invitations
- **Tournament & Matchmaking** system
- **AI Opponents** with intelligent decision-making
- **Modular architecture** with reusable components

---

## Tech Stack

**Frontend**
- TypeScript
- HTML5 + CSS3 (Tailwind CSS)
- WebSockets
- Babylon.js (3D game engine)
- Custom Web Components

**Backend**
- Node.js + Fastify
- WebSockets (real-time messaging)
- JSON Web Tokens (JWT)
- Two-Factor Authentication (TOTP)

**Blockchain**
- Avalanche Fuji Testnet
- Solidity Smart Contracts
- ethers.js for blockchain interactions

**Other Tools**
- Docker (containerized development)
- Git & GitHub (version control)
- Agile/SCRUM methodology
