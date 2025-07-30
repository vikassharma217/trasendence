class Custom2v2 extends HTMLElement {
    private animationFrameId: number | null = null;
	private username: string | null = null;
    private player1: string | null = null;
	private player2: string | null = null;
	private player3: string | null = null;
	private player4: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

	private async fetchUser(): Promise< {
	userInformation: {
        username: string;
      };
      gameInformation: {
        winTimes: number;
        loseTimes: number;
        drawTimes: number;
        totalTimes: number;
      };
      gameDetails: {
        date: string;
        opponent: string;
        win: number;
        lose: number;
        draw: number;
        score: string;
      }[];
    }> {
      const response = await fetch('https://localhost/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
  
      return await response.json();
    }

    private async initialize(): Promise<void> {
        try {
			const userData = await this.fetchUser();
			this.username = userData.userInformation.username;
			this.player1 = this.username + "_1";
			this.player2 = this.username + "_2";
			this.player3 = this.username + "_3";
			this.player4 = this.username + "_4";
            this.render();
            this.setupGame();
        } catch (error) {
            this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load game. Please try again later.</p>`;
        }
    }

    private render(): void {
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
                    	<div class="text-white flex flex-row justify-between items-center gap-4 px-4 py-4 p-10 border-b-[4px] rounded-3xl font-mono text-center w-[90%] max-w-md shadow-white shadow-md">
                    	    <p><strong>${this.player1 || 'Loading...'}</strong></p>
                    	    <p>vs</p>
                    	    <p><strong>${this.player2 || 'Loading...'}</strong></p>
							<p>vs</p>
                    	    <p><strong>${this.player3 || 'Loading...'}</strong></p>
							<p>vs</p>
                    	    <p><strong>${this.player4 || 'Loading...'}</strong></p>
						</div>
						<canvas id="Pong" width="600" height="600"></canvas>
						<div class="flex flex-row w-full h-full items-center justify-center">
							<div class="flex flex-col gap-2">
								<p>Left[W, S]</p>
								<p>Right[NumPad8, NumPad2]</p>
							</div>
							<div class="flex flex-col gap-2 ml-8">
								<p>Top[ArrowLeft, ArrowRight]</p>
								<p>Bottom[n, m]</p>
							</div>
						</div>
					</div>
                </div>
                <footer class="absolute bottom-0 w-full text-center text-[#b8c1ec] font-mono text-sm">
                    <ul class="text-xs">Creators</ul>
                    <div class="flex justify-center gap-2">
                        <a href="https://github.com/wudye" class="hover:text-[#fffffe] transition">mwu |</a>
                        <a href="https://github.com/vikassharma217" class="hover:text-[#fffffe] transition">vsharma |</a>
                        <a href="https://github.com/GGwagons" class="hover:text-[#fffffe] transition">miturk</a>
                    </div>
                </footer>
            </div>
        </body>`;
    }

    connectedCallback() {
        this.initialize();
    }

	private setupGame(): void {
		let startTime = Date.now();
		const maxScore = 0;
		const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Failed to get canvas context');
		canvas.style.backgroundColor = '#232946';
		canvas.style.border = '2px solid #ff8906';
		canvas.style.borderRadius = '20px';
		canvas.style.boxShadow = '0 0 20px rgba(255, 137, 6, 0.5)';
		let scores = [15, 15, 15, 15];
		console.log(scores);
		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 10,
			speed: 4,
			dx: 4,
			dy: 4,
		};

		const leftPaddle = {
			x : 10,
			y : canvas.height / 2 - 40,
			width : 10,
			height : 80,
			dy: 5,
		};

		const rightPaddle = {
			x : canvas.width - 20,
			y : canvas.height / 2 - 40,
			width : 10,
			height : 80,
			dy: 5,
		};

		const bottPaddle = {
			x : canvas.width / 2 - 40,
			y : canvas.height - 20,
			width : 80,
			height : 10,
			dx: 5,
		};

		const topPaddle = {
			x : canvas.width / 2 - 40,
			y : 10,
			width : 80,
			height : 10,
			dx: 5,
		};

		function movePaddleLR(paddle: { x: number; y: number; width: number; height: number; dy: number }, y: number): void {
			paddle.y = y;
			if (paddle.y < 0) paddle.y = 0;
			if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
		}

		function movePaddleTB(paddle: { x: number; y: number; width: number; height: number; dx: number }, x: number): void {
			paddle.x = x;
			if (paddle.x < 0) paddle.x = 0;
			if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
		}

		function moveBall() {
			ball.x += ball.dx;
			ball.y += ball.dy;

			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
				ball.dy *= -1;
			}

			if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
				ball.dx *= -1;
			}
			// LEFT PADDLE
			if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
				ball.x + ball.radius > leftPaddle.x && 
				ball.y - ball.radius < leftPaddle.y + leftPaddle.height &&
				ball.y + ball.radius > leftPaddle.y) {
				ball.dx *= -1;

				ball.speed++; // Increase the ball's speed
				let collidePoint = ball.y - (leftPaddle.y + leftPaddle.height / 2);
				collidePoint = collidePoint / (leftPaddle.height / 2);
				let angleRad = (Math.PI / 4) * collidePoint;
				ball.dy = Math.sin(angleRad) * ball.speed;
			}


			// RIGHT PADDLE
			if (ball.x - ball.radius < rightPaddle.x + rightPaddle.width &&
				ball.x + ball.radius > rightPaddle.x && 
				ball.y - ball.radius < rightPaddle.y + rightPaddle.height &&
				ball.y + ball.radius > rightPaddle.y) {
				ball.dx *= -1;

				ball.speed++;
				let collidePoint = ball.y - (rightPaddle.y + rightPaddle.height / 2);
				collidePoint = collidePoint / (rightPaddle.height / 2);
				let angleRad = (Math.PI / 4) * collidePoint;
				ball.dy = Math.sin(angleRad) * ball.speed;
			}


			// TOP PADDLE
			if (ball.x - ball.radius < topPaddle.x + topPaddle.width &&
				ball.x + ball.radius > topPaddle.x && 
				ball.y - ball.radius < topPaddle.y + topPaddle.height &&
				ball.y + ball.radius > topPaddle.y) {
				ball.dx *= -1;
				ball.dy *= -1;

				ball.speed++;
				let collidePoint = ball.x - (topPaddle.x + topPaddle.width / 2);
				collidePoint = collidePoint / (topPaddle.width / 2);
				let angleRad = (Math.PI / 4) * collidePoint;
				ball.dx = Math.sin(angleRad) * ball.speed;
				ball.dy = Math.cos(angleRad) * ball.speed;
			}
			// BOTTOM PADDLE
			if (ball.x - ball.radius < bottPaddle.x + bottPaddle.width &&
				ball.x + ball.radius > bottPaddle.x && 
				ball.y - ball.radius < bottPaddle.y + bottPaddle.height &&
				ball.y + ball.radius > bottPaddle.y) {
				ball.dx *= -1;
				ball.dy *= -1;

				ball.speed++;
				let collidePoint = ball.x - (bottPaddle.x + bottPaddle.width / 2);
				collidePoint = collidePoint / (bottPaddle.width / 2);
				let angleRad = (Math.PI / 4) * collidePoint;
				ball.dx = Math.sin(angleRad) * ball.speed;
				ball.dy = -Math.abs(Math.cos(angleRad) * ball.speed); // Ensure the ball bounces downward
			}

			if (ball.x + ball.radius > canvas.width) {
				scores[1]--;
				resetBall(-1);
			}
			if (ball.x - ball.radius < 0) {
				scores[0]--;
				resetBall(1);
			}

			if (ball.y + ball.radius > canvas.height) {
				scores[3]--;
				resetBall(-1);
			}
			if (ball.y - ball.radius < 0) {
				scores[2]--;
				resetBall(1);
			}
		}

		function resetBall(direction: number) {
			ball.x = canvas.width / 2;
			ball.y = canvas.height / 2;
			ball.speed = 4;

			// Randomize the angle of launch in 360 degrees
			const angle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π radians
			ball.dx = ball.speed * Math.cos(angle);
			ball.dy = ball.speed * Math.sin(angle);
		}

		let leftPaddleDirection: number | null = null;
		let rightPaddleDirection: number | null = null;
		let topPaddleDirection: number | null = null;
		let bottPaddleDirection: number | null = null;

		window.addEventListener('keydown', (event) => {
			if (event.key === 'W' || event.key === 'w') {
				leftPaddleDirection = -1;
			} else if (event.key === 'S' || event.key === 's') {
				leftPaddleDirection = 1;
			} else if (event.code === 'Numpad8') {
				rightPaddleDirection = -1;
			} else if (event.code === 'Numpad2') {
				rightPaddleDirection = 1;
			}
			else if (event.key === 'ArrowLeft') {
				topPaddleDirection = -1;
			} else if (event.key === 'ArrowRight') {
				topPaddleDirection = 1;
			}
			else if (event.key === 'n' || event.key === 'N') {
				bottPaddleDirection = -1;
			} else if (event.key === 'm' || event.key === 'M') {
				bottPaddleDirection = 1;
			}
		});
	
		window.addEventListener('keyup', (event) => {
			if (event.key === 'W' || event.key === 'w' || event.key === 'S' || event.key === 's') {
				leftPaddleDirection = null;
			} else if (event.code === 'Numpad8' || event.code === 'Numpad2') {
				rightPaddleDirection = null;
			}
			else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				topPaddleDirection = null;
			}
			else if (event.key === 'n' || event.key === 'm' || event.key === 'N' || event.key === 'M') {
				bottPaddleDirection = null;
			}
		});

		window.addEventListener('keydown', (event) => {
			if (event.key === 'r' || event.key === 'R') {
				scores = [15, 15, 15, 15];
				startTime = Date.now();
				resetBall(1);
			} else if (event.key === 'q' || event.key === 'Q') {
				window.history.pushState({}, '', '/single');
				(window as any).loadRoute('/single');
			}
		});
	
		function updateLeftPaddle() {
			if (leftPaddleDirection !== null) {
				movePaddleLR(leftPaddle, leftPaddle.y + leftPaddle.dy * leftPaddleDirection);
			}
		}
	
		function updateRightPaddle() {
			if (rightPaddleDirection !== null) {
				movePaddleLR(rightPaddle, rightPaddle.y + rightPaddle.dy * rightPaddleDirection);
			}
		}

		function updateTopPaddle() {
			if (topPaddleDirection !== null) {
				movePaddleTB(topPaddle, topPaddle.x + topPaddle.dx * topPaddleDirection);
			}
		}

		function updateBottPaddle() {
			if (bottPaddleDirection !== null) {
				movePaddleTB(bottPaddle, bottPaddle.x + bottPaddle.dx * bottPaddleDirection);
			}
		}
	
		function update() {
			updateLeftPaddle();
			updateRightPaddle();
			updateTopPaddle();
			updateBottPaddle();
			draw();
			requestAnimationFrame(update);
		}

		const gameOver = () => {
			if (scores[0] <= maxScore || scores[1] <= maxScore || scores[2] <= maxScore || scores[3] <= maxScore || (Date.now() - startTime) / 1000 >= 180) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.font = '50px mono';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = 'white';
				ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
				ctx.font = '30px mono';
				const loser = scores.findIndex(score => score === 0);
				const loserName = loser === 0 ? this.player1 : loser === 1 ? this.player2 : loser === 2 ? this.player3 : this.player4;
				ctx.fillText('Loser: ' + (loserName || 'Unknown'), canvas.width / 2, canvas.height / 2 + 100);
				ctx.font = '20px mono'; // Set a smaller font size
				ctx.fillText('Press R to Restart | Press Q to Quit', canvas.width / 2, canvas.height / 2 + 150);
				return true;
			}
			return false;
		}
	
		const draw = () => {
			ctx.font = '30px mono';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
			ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
			ctx.fillRect(topPaddle.x, topPaddle.y, topPaddle.width, topPaddle.height);
			ctx.fillRect(bottPaddle.x, bottPaddle.y, bottPaddle.width, bottPaddle.height);

			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
			ctx.fill();

			// Draw scores on their respective paddles
			ctx.font = '20px mono';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(`${scores[0]}`, canvas.width / 4, canvas.height / 2);
			ctx.fillText(`${scores[1]}`, (canvas.width * 3) / 4, canvas.height / 2);
			ctx.fillText(`${scores[2]}`, canvas.width / 2, canvas.height / 4);
			ctx.fillText(`${scores[3]}`, canvas.width / 2, (canvas.height * 3) / 4);

			// Draw timer in the center of the canvas
			ctx.font = '20px mono';
			const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
			const remainingTime = Math.max(180 - elapsedTime, 0); // 180 seconds = 3 minutes
			const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
			const seconds = String(remainingTime % 60).padStart(2, '0');
			ctx.fillText(`Time: ${minutes}:${seconds}`, canvas.width / 2, canvas.height / 2);
			if (gameOver() === true) {
				cancelAnimationFrame(this.animationFrameId!);
				return;
			}
			moveBall();
		}
		update();
	}
}
customElements.define('custom-2v2', Custom2v2);