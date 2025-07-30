import { FastifyInstance } from 'fastify';

interface UserInfo {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    avatarPath: string;
}

interface GameInformation {
    winTimes: number;
    loseTimes: number;
    drawTimes: number;
    totalTimes: number;
}

interface gameDetails {
    date: string;
    opponent: string;
    win: number;
    lose: number;
    draw: number;
    score: string;
}

export default function GetProfile(server: FastifyInstance) {
    server.get('/api/profile', { preValidation: [server.authenticate] }, async (request, reply) => {
        try {
            const remail = request.email;

            // Query to get user information
            const user = await server.sqlite.get(
                "SELECT * FROM users WHERE email = ?",
                [remail]
            );

            if (!user) {
                return reply.status(404).send({ message: "User not found" });
            }

            const { username, firstname, lastname, email, phone, address, avatarPath, id: usersId } = user;
            const userInfo: UserInfo = {
                username,
                firstname,
                lastname,
                email,
                phone,
                address,
                avatarPath,
            };

            // Query to get game information
            const gameInfo = await server.sqlite.get(
                "SELECT * FROM gameInfo WHERE userId = ?",
                [usersId]
            );

            const gameInformation: GameInformation = gameInfo
                ? {
                      winTimes: gameInfo.winTimes,
                      loseTimes: gameInfo.loseTimes,
                      drawTimes: gameInfo.drawTimes,
                      totalTimes: gameInfo.totalTimes,
                  }
                : {
                      winTimes: 0,
                      loseTimes: 0,
                      drawTimes: 0,
                      totalTimes: 0,
                  };

            // Query to get game details
            const details = await server.sqlite.all(
                "SELECT * FROM details WHERE userId = ?",
                [usersId]
            );

            const gameDetails: gameDetails[] = details.length
                ? details.map((detail: any) => ({
                      date: detail.startDate,
                      opponent: detail.opponent,
                      win: detail.win,
                      lose: detail.lose,
                      draw: detail.draw,
                      score: detail.score,
                  }))
                : [
                      { date: "", opponent: "", win: 0, lose: 0, draw: 0, score: "" },
                  ];

            return reply.status(200).send({
                userInformation: userInfo,
                gameInformation: gameInformation,
                gameDetails: gameDetails,
            });
        } catch (error) {
            console.error("Error validating token:", error);
            return reply.status(500).send({ message: "Failed to validate token" });
        }
    });
}