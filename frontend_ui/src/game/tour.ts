import { pushToBlockchain } from "../blockchain/blockchain.js";

class Tour extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  // game logic from 2d 1vs1 game
  private createPongGame(
    canvas: HTMLCanvasElement,
    player1Name: string,
    player2Name: string
  ): Promise<string> {
    return new Promise((resolve) => {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (!ctx) {
        console.error("Canvas context is not supported");
        resolve(player1Name);
        return;
      }

      canvas.style.backgroundColor = "#232946";
      canvas.style.border = "2px solid #ff8906";
      canvas.style.borderRadius = "20px";
      canvas.style.boxShadow = "0 0 20px rgba(255, 137, 6, 0.5)";

      const maxScore = 1; // change the max score
      let scores = [0, 0];
      const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 4,
        dx: 4,
        dy: 4,
      };

      const leftPaddle = {
        x: 10,
        y: canvas.height / 2 - 40,
        width: 10,
        height: 80,
        dy: 4,
      };

      const rightPaddle = {
        x: canvas.width - 20,
        y: canvas.height / 2 - 40,
        width: 10,
        height: 80,
        dy: 4,
      };

      function movePaddle(paddle: any, y: number) {
        paddle.y = y;
        if (paddle.y < 0) paddle.y = 0;
        if (paddle.y + paddle.height > canvas.height)
          paddle.y = canvas.height - paddle.height;
      }

      /*function resetBall(direction: number) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 4;
        const angle = Math.random() * (Math.PI / 2) - Math.PI / 4;
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
      }*/

      let leftPaddleDirection: number | null = null;
      let rightPaddleDirection: number | null = null;

      const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === "W" || event.key === "w") leftPaddleDirection = -1;
        else if (event.key === "S" || event.key === "s")
          leftPaddleDirection = 1;
        else if (event.key === "ArrowUp") rightPaddleDirection = -1;
        else if (event.key === "ArrowDown") rightPaddleDirection = 1;
      };

      const keyupHandler = (event: KeyboardEvent) => {
        if (
          event.key === "W" ||
          event.key === "w" ||
          event.key === "S" ||
          event.key === "s"
        ) {
          leftPaddleDirection = null;
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          rightPaddleDirection = null;
        }
      };

      window.addEventListener("keydown", keydownHandler);
      window.addEventListener("keyup", keyupHandler);

      function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.dy *= -1;
        }

        if (
          ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
          ball.x + ball.radius > leftPaddle.x &&
          ball.y - ball.radius < leftPaddle.y + leftPaddle.height &&
          ball.y + ball.radius > leftPaddle.y
          ) {
          ball.dx *= -1;
          ball.speed++;
          let collidePoint =(ball.y - (leftPaddle.y + leftPaddle.height / 2)) /(leftPaddle.height / 2);
          let angleRad = (Math.PI / 4) * collidePoint;
          ball.dy = Math.sin(angleRad) * ball.speed;
        }

        if (
          ball.x - ball.radius < rightPaddle.x + rightPaddle.width &&
          ball.x + ball.radius > rightPaddle.x &&
          ball.y - ball.radius < rightPaddle.y + rightPaddle.height &&
          ball.y + ball.radius > rightPaddle.y
          ) {
          ball.dx *= -1;
          ball.speed++;
          let collidePoint = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) /(rightPaddle.height / 2);
          let angleRad = (Math.PI / 4) * collidePoint;
          ball.dy = Math.sin(angleRad) * ball.speed;
        }

        if (ball.x + ball.radius > canvas.width) {
          scores[0]++;
          resetBall(-1);
        }
        if (ball.x - ball.radius < 0) {
          scores[1]++;
          resetBall(1);
        }
      }

      function resetBall(direction: number) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 4;

        // Randomize the angle of launch
        const angle = Math.random() * (Math.PI / 2) - Math.PI / 4; // Random angle between -45 and 45 degrees
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);

        // Ensure the ball doesn't start with a near-horizontal or near-vertical trajectory
        if (Math.abs(ball.dx) < 1) ball.dx = direction * ball.speed * 0.8;
        if (Math.abs(ball.dy) < 1) ball.dy = ball.speed * 0.8 * (Math.random() > 0.5 ? 1 : -1);
      }

      function update() {
        if (leftPaddleDirection !== null) {
          movePaddle(
            leftPaddle,
            leftPaddle.y + leftPaddle.dy * leftPaddleDirection
          );
        }
        if (rightPaddleDirection !== null) {
          movePaddle(
            rightPaddle,
            rightPaddle.y + rightPaddle.dy * rightPaddleDirection
          );
        }

        moveBall();
        draw();

        if (scores[0] >= maxScore || scores[1] >= maxScore) {
          const winner = scores[0] > scores[1] ? player1Name : player2Name;
          window.removeEventListener("keydown", keydownHandler);
          window.removeEventListener("keyup", keyupHandler);
          resolve(winner);
          return;
        }

        requestAnimationFrame(update);
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Common text settings
        ctx.font = "20px monospace";
        ctx.fillStyle = "white";
        ctx.textBaseline = "top"; // Ensures vertical alignment

        // Draw Player 1 (left-aligned)
        ctx.textAlign = "left";
        ctx.fillText(player1Name, 20, 10); // X: 20px padding, Y: 10px from top

        // Draw Player 2 (right-aligned)
        ctx.textAlign = "right";
        ctx.fillText(player2Name, canvas.width - 20, 10); // X: canvas width minus 20px

        // Draw the score in center
        ctx.font = "30px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${scores[0]} : ${scores[1]}`, canvas.width / 2, 10);

        // Draw paddles and ball
        ctx.fillStyle = "white";
        ctx.fillRect(
          leftPaddle.x,
          leftPaddle.y,
          leftPaddle.width,
          leftPaddle.height
        );
        ctx.fillRect(
          rightPaddle.x,
          rightPaddle.y,
          rightPaddle.width,
          rightPaddle.height
        );

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }

      resetBall(1);
      update();
    });
  }

  private render(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentName = urlParams.get("tournamentName") || "Tournament";
    const player1 = urlParams.get("player1") || "Player 1";
    const player2 = urlParams.get("player2") || "Player 2";
    const player3 = urlParams.get("player3") || "Player 3";
    const player4 = urlParams.get("player4") || "Player 4";

    const players = [player1, player2, player3, player4];
    let game1Winner = "";
    let game2Winner = "";
    let tournamentWinner = "";
    let runnerUp = "";

    this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">
        <body class="overflow-hidden">
            <div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay">
                <div class="relative w-full h-screen flex justify-end items-center bg-[#232946]/60">
                    <video autoplay muted loop disablepictureinpicture aria-hidden="true" tabindex="-1"
                        class="w-1/4 h-auto object-contain blur-[5.0px] z-[-1]">
                        <source src="/duck.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="absolute border-4 border-transparent bg-gradient-linear from-[#ff8906] to-[#ff6600] z-[30]">
                    <div class="flex flex-col justify-center items-center mb-4 gap-4">
                        <div id="game-status" class="text-white flex flex-col justify-center items-center gap-4 px-4 py-4 p-10 border-b-[4px] rounded-3xl font-mono text-center w-[90%] max-w-md shadow-white shadow-md">
                            <p class="text-2xl">Press SPACE to start Game 1</p>
                            <p class="text-xl">${player1} vs ${player2}</p>
                        </div>
                        <canvas id="pongCanvas" width="800" height="600" class="mx-auto"></canvas>
                    </div>
                </div>
            </div>
        </body>`;

    const gameStatusDiv = this.shadowRoot!.getElementById("game-status");
    //const blockchainButton = this.shadowRoot!.getElementById("push-to-blockchain");
    const canvas = this.shadowRoot!.getElementById(
      "pongCanvas"
    ) as HTMLCanvasElement;

    let currentGame = 1;
    let isGameInProgress = false;

    const handleSpacePress = async (event: KeyboardEvent) => {
      if (event.code === "Space" && !isGameInProgress) {
        isGameInProgress = true;
        gameStatusDiv!.classList.add("hidden");

        if (currentGame === 1) {
          game1Winner = await this.createPongGame(canvas, player1, player2);
          isGameInProgress = false;
          gameStatusDiv!.classList.remove("hidden");
          gameStatusDiv!.innerHTML = `
              <p>Game 1 Winner: ${game1Winner}</p>
              <p>Press SPACE to start Game 2</p>
              <p>Game 2: ${player3} vs ${player4}</p>
            `;
          currentGame++;
        } else if (currentGame === 2) {
          game2Winner = await this.createPongGame(canvas, player3, player4);
          isGameInProgress = false;
          gameStatusDiv!.classList.remove("hidden");
          gameStatusDiv!.innerHTML = `
              <p>Game 2 Winner: ${game2Winner}</p>
              <p>Press SPACE to start Final</p>
              <p>Final: ${game1Winner} vs ${game2Winner}</p>
            `;
          currentGame++;
        } else if (currentGame === 3) {
          const winner = await this.createPongGame(
            canvas,
            game1Winner,
            game2Winner
          );
          tournamentWinner = winner;
          runnerUp = winner === game1Winner ? game2Winner : game1Winner;
          isGameInProgress = false;
          canvas.style.display = "none";
          gameStatusDiv!.classList.remove("hidden");
          this.shadowRoot!.innerHTML = `
            <link href="../dist/output.css" rel="stylesheet">
            <div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay h-screen w-full">
              <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md z-[30]">
                <h1 class="text-4xl font-bold text-white pb-[20px] break-keep">${tournamentName} - TOURNAMENT RESULT</h1>
                <main id="Link" class="flex flex-col justify-center gap-4">
                  <div class="text-[#fffffe] text-lg font-bold">
                    <p>Winner: ${tournamentWinner}</p>
                    <p>Runner-Up: ${runnerUp}</p>
                  </div>
                  
                  <button id="push-to-blockchain" class="mt-6 px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">
                    Push to Blockchain
                  </button>
                  <a id="back" class="mt-4 px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">
                    Back to Home
                  </a>
                </main>
              </div>
            </div>`;
          this.linkListeners();
          requestAnimationFrame(() => {
            const pushButton =
              this.shadowRoot!.getElementById("push-to-blockchain");
            if (pushButton) {
              pushButton.addEventListener("click", async () => {
                try {
                  const txHash = await pushToBlockchain(
                    tournamentName,
                    tournamentWinner,
                    runnerUp
                  );
                  alert(
                    `Pushed to blockchain succesfully!!\nTxHash: ${txHash}`
                  );
                } catch (err: any) {
                  alert(`Failed to push to blockchain: ${err.message}`);
                }
              });
            }
          });

          document.removeEventListener("keydown", handleSpacePress);

          //blockchainButton!.classList.remove("hidden");
          //const buttonContainer = blockchainButton!.parentElement;
          //buttonContainer!.innerHTML += `
          //  <a href="/" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back to Home</a>
          //`;
          currentGame++;
        }
      }
    };

    // //game status messages for next game
    // const updateGameStatus = (message: string, subMessage: string) => {
    //   gameStatusDiv!.innerHTML = `
    //     <div class="text-white flex flex-col justify-center items-center gap-4">
    //       <p class="text-2xl">${message}</p>
    //       <p class="text-xl">${subMessage}</p>
    //     </div>
    //   `;
    // };

    document.addEventListener("keydown", handleSpacePress);
  }
  private linkListeners(): void {
    const formLinks = this.shadowRoot!.querySelectorAll("#Link a");
    if (formLinks) {
      formLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = "/" + (link as HTMLAnchorElement).getAttribute("id");
          if (href === "/back") {
            window.history.pushState({}, "", "/"); // Redirect to home page if 'back' is clicked
            (window as any).loadRoute("/"); // Redirect to home page if 'back' is clicked
          } else if (href) {
            window.history.pushState({}, "", href);
            (window as any).loadRoute(href);
          }
        });
      });
    }
  }
}

customElements.define("custom-tour", Tour);
