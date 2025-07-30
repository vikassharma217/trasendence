class Custom1v1 extends HTMLElement {
    private animationFrameId: number | null = null;
	private username: string | null = null;
    private player1: string | null = null;
	private player2: string | null = null;

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
			dx: 4,
			dy: 4,
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
			}

			if (ball.x + ball.radius > canvas.width) {
				socres[0]++;
				resetBall(-1);
			}
			if (ball.x - ball.radius < 0) {
				socres[1]++;
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

		let leftPaddleDirection: number | null = null;
		let rightPaddleDirection: number | null = null;

		window.addEventListener('keydown', (event) => {
			if (event.key === 'W' || event.key === 'w') {
				leftPaddleDirection = -1;
			} else if (event.key === 'S' || event.key === 's') {
				leftPaddleDirection = 1;
			} else if (event.key === 'ArrowUp') {
				rightPaddleDirection = -1;
			} else if (event.key === 'ArrowDown') {
				rightPaddleDirection = 1;
			}
		});
	
		window.addEventListener('keyup', (event) => {
			if (event.key === 'W' || event.key === 'w' || event.key === 'S' || event.key === 's') {
				leftPaddleDirection = null;
			} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				rightPaddleDirection = null;
			}
		});

		window.addEventListener('keydown', (event) => {
			if (event.key === 'r' || event.key === 'R') {
				socres = [0, 0];
				startTime = Date.now();
				resetBall(1);
			} else if (event.key === 'q' || event.key === 'Q') {
				window.history.pushState({}, '', '/single');
				(window as any).loadRoute('/single');
			}
		});
	
		function updateLeftPaddle() {
			if (leftPaddleDirection !== null) {
				movePaddle(leftPaddle, leftPaddle.y + leftPaddle.dy * leftPaddleDirection);
			}
		}
	
		function updateRightPaddle() {
			if (rightPaddleDirection !== null) {
				movePaddle(rightPaddle, rightPaddle.y + rightPaddle.dy * rightPaddleDirection);
			}
		}
	
		function update() {
			updateLeftPaddle();
			updateRightPaddle();
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
				ctx.fillText('Winner: ' + (socres[0] > socres[1] ? this.player1 : (socres[0] < socres[1] ? this.player2 : 'Draw')), canvas.width / 2, canvas.height / 2 + 100);
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
customElements.define('custom-1v1', Custom1v1);