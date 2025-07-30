class Custom1vBot extends HTMLElement {
	private animationFrameId: number | null = null;
    private username: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

	private async fetchInfo(): Promise< {
	userInformation: {
        username: string;
      };
      gameInformation: {
      };
      gameDetails: {
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
			const userData = await this.fetchInfo();
			this.username = userData.userInformation.username;
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
                    	    <p><strong>${this.username || 'Loading...'}</strong></p>
                    	    <p>vs</p>
                    	    <p><strong>${'AiPlayer'}</strong></p>
						</div>
						<canvas id="Pong" width="800" height="600"></canvas>
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
		const maxScore = 15;
		const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Failed to get canvas context');
		canvas.style.backgroundColor = '#232946';
		canvas.style.border = '2px solid #ff8906';
		canvas.style.borderRadius = '20px';
		canvas.style.boxShadow = '0 0 20px rgba(255, 137, 6, 0.5)';
		let socres = [0, 0];
		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 10,
			speed: 4,
			dx: -4,
			dy: -4,
		};

		const leftPaddle = {
			x : 10,
			y : canvas.height / 2 - 40,
			width : 10,
			height : 80,
			dy: 4,
		};

		const rightPaddle = {
			x : canvas.width - 20,
			y : canvas.height / 2 - 40,
			width : 10,
			height : 80,
			dy: 4,
		};

		function movePaddle(paddle: { x: number; y: number; width: number; height: number; dy: number }, y: number): void {
			paddle.y = y;
			if (paddle.y < 0) paddle.y = 0;
			if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
		}

		function moveBall() {
			ball.x += ball.dx;
			ball.y += ball.dy;

			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
				ball.dy *= -1;
			}

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
				predictBallY(aiSnapshot, canvas.height);
			}

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
				predictBallY(aiSnapshot, canvas.height);
			}

			if (ball.x + ball.radius > canvas.width) {
				socres[0]++;
				leftPaddle.x = 10,
				leftPaddle.y = canvas.height / 2 - 40,
				rightPaddle.x = canvas.width - 20,
				rightPaddle.y = canvas.height / 2 - 40,
				resetBall(-1);
			}
			if (ball.x - ball.radius < 0) {
				socres[1]++;
				leftPaddle.x = 10,
				leftPaddle.y = canvas.height / 2 - 40,
				rightPaddle.x = canvas.width - 20,
				rightPaddle.y = canvas.height / 2 - 40,
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
		
		let aiSnapshot = { ballX: ball.radius, ballY: ball.radius, ballVX: ball.speed, ballVY: ball.speed, paddleY: rightPaddle };
		let aiTargetY = canvas.height / 2;
		const aiUpdateInterval = 1000;

		function predictBallY(snapshot: typeof aiSnapshot, canvasHeight: number): number {
			let { ballX, ballY, ballVX, ballVY } = snapshot;
			if (ballVX <= 0) return canvas.height / 2;
			let t = (canvas.width - rightPaddle.width - ballX) / ball.dx;
			let predictedY = ballY + ballVY * t + (Math.random() - 0.5) * 50;
			while (predictedY < 0 || predictedY > canvasHeight) {
				if (predictedY < 0) predictedY = -predictedY;
				else if (predictedY > canvasHeight) predictedY = 2 * canvasHeight - predictedY;
			}
			return predictedY;
		}
		
		function aiLogic() : void {
			predictBallY(aiSnapshot, canvas.height);
			const paddleCenter = rightPaddle.y + (rightPaddle.height / 2);
			const buffer = 5;
			if (paddleCenter < aiTargetY - buffer) {
				movePaddle(rightPaddle, rightPaddle.y + rightPaddle.dy);
			} else if (paddleCenter > aiTargetY + buffer) {
				movePaddle(rightPaddle, rightPaddle.y - rightPaddle.dy);
			}
		}

		setInterval(() => {
			aiSnapshot = { ballX: ball.x, ballY: ball.y, ballVX: ball.dx, ballVY: ball.dy, paddleY: rightPaddle };
			aiTargetY = predictBallY(aiSnapshot, canvas.height) - rightPaddle.height / 2;
		}, aiUpdateInterval);


	let leftPaddleDirection: number | null = null;
	let rightPaddleDirection: number | null = null;

	window.addEventListener('keydown', (event) => {
		if (event.key === 'W' || event.key === 'w') {
			leftPaddleDirection = -1;
		} else if (event.key === 'S' || event.key === 's') {
			leftPaddleDirection = 1;
		}
		if (event.key === 'ArrowUp') {
			rightPaddleDirection = -1;
			aiLogic();
		} else if (event.key === 'ArrowDown') {
			rightPaddleDirection = 1;
			aiLogic();
		}
	});

	window.addEventListener('keyup', (event) => {
		if (event.key === 'W' || event.key === 'w' || event.key === 'S' || event.key === 's') {
			leftPaddleDirection = null;
		}
	});

	window.addEventListener('keyup', (event) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			rightPaddleDirection = null;
		}
	});

	window.addEventListener('keydown', (event) => {
		if (event.key === 'r' || event.key === 'R') {
			socres = [0, 0];
			startTime = Date.now();
			resetBall(1);
		} else if (event.key === 'q' || event.key === 'Q') {
			window.history.pushState({}, '', '/signle');
			(window as any).loadRoute('/single');
		}
	});

	function updateLeftPaddle() {
		if (leftPaddleDirection !== null) {
			movePaddle(leftPaddle, leftPaddle.y + leftPaddle.dy * leftPaddleDirection);
		}
		if (rightPaddleDirection !== null) {
			aiLogic();
		}
	}

	function update() {
		updateLeftPaddle();
		aiLogic();
		draw();
		requestAnimationFrame(update);
	}

	const gameOver = () => {
		if (socres[0] >= maxScore || socres[1] >= maxScore || (Date.now() - startTime) / 1000 >= 180) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = '50px mono';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = 'white';
			ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
			ctx.font = '30px mono';
			ctx.fillText('Winner: ' + (socres[0] > socres[1] ? this.username : (socres[0] < socres[1] ? 'AiPlayer' : 'Draw')), canvas.width / 2, canvas.height / 2 + 100);
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
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.fillText(`${socres[0]} : ${socres[1]}`, canvas.width / 2, 30);
		ctx.font = '10px mono'; // Set a smaller font size for the timer
		const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		const remainingTime = Math.max(180 - elapsedTime, 0); // 180 seconds = 3 minutes
		const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
		const seconds = String(remainingTime % 60).padStart(2, '0');
		ctx.fillText(`Time: ${minutes}:${seconds}`, canvas.width / 2, 60);
		if (gameOver() === true) {
			cancelAnimationFrame(this.animationFrameId!);
			return;
		}
		moveBall();
	}
	
	update();
	}
}
customElements.define('custom-1v-bot', Custom1vBot);


// import { disconnect } from "process";

// class Custom1vBot extends HTMLElement {
// 	private animationFrameId: number | null = null;

// 	constructor() {
// 		super();
// 		this.attachShadow({ mode: 'open' });
// 		this.render();
// 	}

// 	private render(): void {
// 		this.shadowRoot!.innerHTML = `
// 		<link href="../dist/output.css" rel="stylesheet">
// 		<body class="overflow-hidden">
// 			<div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay">
// 				<div class="relative w-full h-screen flex justify-end items-center bg-[#232946]/60">
// 					<video autoplay muted loop disablepictureinpicture aria-hidden="true" tabindex="-1"
// 						class="w-1/4 h-auto object-contain blur-[5.0px] z-[-1]">
// 						<source src="/duck.mp4" type="video/mp4" />
// 						Your browser does not support the video tag.
// 					</video>
// 				</div>
// 				<div class="absolute border-4 border-transparent bg-gradient-linear from-[#ff8906] to-[#ff6600] z-[30]">
// 					<canvas id="gameCanvas" width="800" height="600"></canvas>
// 				</div>
// 				<footer class="absolute bottom-0 w-full text-center text-[#b8c1ec] font-mono text-sm">
// 					<ul class="text-xs">Creators</ul>
// 					<div class="flex justify-center gap-2">
// 						<a href="https://github.com/wudye" class="hover:text-[#fffffe] transition">mwu |</a>
// 						<a href="https://github.com/vikassharma217" class="hover:text-[#fffffe] transition">vsharma |</a>
// 						<a href="https://github.com/GGwagons" class="hover:text-[#fffffe] transition">miturk</a>
// 					</div>
// 				</footer>
// 			</div>
// 		</body>`;
// 	}

// 	connectedCallback() {
// 		this.setupGame();
// 	}

// 	private setupGame(): void {
// 		let startTime = Date.now();
// 		let gameOver = false;
// 		const maxScore = 10;
// 		const canvas = this.shadowRoot!.getElementById('gameCanvas') as HTMLCanvasElement;
// 		const ctx = canvas.getContext('2d');
// 		if (!ctx) throw new Error('Failed to get canvas context');

// 		const width = canvas.width;
// 		const height = canvas.height;
// 		const paddleWidth = 10;
// 		const paddleHeight = 100;
// 		const ballSize = 10;

// 		let leftPaddleY = height / 2 - paddleHeight / 2;
// 		let rightPaddleY = height / 2 - paddleHeight / 2;
// 		let ballX = width / 2;
// 		let ballY = height / 2;
// 		let ballSpeedX = 4;
// 		let ballSpeedY = 4;

// 		let leftScore = 0;
// 		let rightScore = 0;

// 		const keysPressed: Record<string, boolean> = {};

// 		let aiSnapshot = { ballX, ballY, ballVX: ballSpeedX, ballVY: ballSpeedY, paddleY: rightPaddleY };
// 		let aiTargetY = rightPaddleY;
// 		const aiUpdateInterval = 1000;

// 		function predictBallY(snapshot: typeof aiSnapshot, canvasHeight: number): number {
// 			let { ballX, ballY, ballVX, ballVY } = snapshot;
// 			if (ball.dx <= 0) return canvas.height / 2;
// 			let t = (width - rightPaddle.width - ball.x) / ball.dx;
// 			let predictedY = ball.y + ball.dy * t + (Math.random() - 0.5) * 50;
// 			while (predictedY < 0 || predictedY > canvas.height) {
// 				if (predictedY < 0) predictedY = -predictedY;
// 				else if (predictedY > canvas.height) predictedY = 2 * canvas.height - predictedY;
// 			}
// 			return predictedY;
// 		}

// 		function simulateKeyPress(key: string) {
// 			keysPressed[key.toLowerCase()] = true;
// 		}

// 		function releaseAIKeys() {
// 			keysPressed['arrowup'] = false;
// 			keysPressed['arrowdown'] = false;
// 		}

// 		setInterval(() => {
// 			aiSnapshot = { ball.x, ball.y, ball.dx: ball.speed, ball.dy: ball.speed, paddleY: rightPaddle.y };
// 			aiTargetY = predictBallY(aiSnapshot, height) - paddleHeight / 2;
// 		}, aiUpdateInterval);

// 		function controlAI() {
// 			releaseAIKeys();
// 			const paddleCenter = rightPaddleY + paddleHeight / 2;
// 			const buffer = 10;
// 			if (paddleCenter < aiTargetY - buffer) simulateKeyPress('ArrowDown');
// 			else if (paddleCenter > aiTargetY + buffer) simulateKeyPress('ArrowUp');
// 		}

// 		const update = () => {
// 			ballX += ballSpeedX;
// 			ballY += ballSpeedY;

// 			if (ballY <= 0 || ballY + ballSize >= height) ballSpeedY *= -1;

// 			if (ballX <= paddleWidth && ballY + ballSize >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
// 				ballSpeedX *= -1.05;
// 				ballSpeedY *= 1.05;
// 			}

// 			if (ballX + ballSize >= width - paddleWidth && ballY + ballSize >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
// 				ballSpeedX *= -1.05;
// 				ballSpeedY *= 1.05;
// 			}

// 			if (ballX < 0) { rightScore++; resetBall(); }
// 			else if (ballX > width) { leftScore++; resetBall(); }
// 			if (leftScore >= maxScore || rightScore >= maxScore || startTime + 60000 < Date.now()) {
// 				gameOver = true;
// 				alert(`${leftScore >= maxScore ? 'Left' : 'Right'} Player Wins!`);
// 				leftScore = 0;
// 				rightScore = 0;
// 				cancelAnimationFrame(this.animationFrameId!);
// 				return;
// 			}
// 			if (keysPressed['w']) leftPaddleY -= 6;
// 			if (keysPressed['s']) leftPaddleY += 6;

// 			if (keysPressed['arrowup']) rightPaddleY -= 3;
// 			if (keysPressed['arrowdown']) rightPaddleY += 3;

// 			rightPaddleY = Math.max(0, Math.min(height - paddleHeight, rightPaddleY));
// 			leftPaddleY = Math.max(0, Math.min(height - paddleHeight, leftPaddleY));

// 			controlAI();
// 		};

// 		const resetBall = () => {
// 			ballX = width / 2;
// 			ballY = height / 2;
// 			ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4;
// 			ballSpeedY = (Math.random() - 0.5) * 8;
// 		};

// 		const draw = () => {
// 			const elapsed = Math.floor((Date.now() - startTime) / 1000);
// 			const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
// 			const seconds = String(elapsed % 60).padStart(2, '0');
// 			ctx.font = '20px mono';
// 			ctx.fillText(`Time: ${minutes}:${seconds}`, width / 2, 90);
// 			ctx.clearRect(0, 0, width, height);
// 			ctx.fillStyle = 'black';
// 			ctx.fillRect(0, 0, width, height);
// 			ctx.fillStyle = 'white';
// 			ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
// 			ctx.fillRect(width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
// 			ctx.fillRect(ballX, ballY, ballSize, ballSize);
// 			ctx.font = '32px mono';
// 			ctx.fillText(`${leftScore} : ${rightScore}`, width / 2, 50);
// 		};

// 		const loop = () => {
// 			if (gameOver) return;
// 			update();
// 			draw();
// 			this.animationFrameId = requestAnimationFrame(loop);
// 		};

// 		window.addEventListener('keydown', (e) => keysPressed[e.key.toLowerCase()] = true);
// 		window.addEventListener('keyup', (e) => keysPressed[e.key.toLowerCase()] = false);

// 		loop();
// 	}

// 	disconnectedCallback() {
// 		if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
// 	}
// }

// customElements.define('custom-1v-bot', Custom1vBot);