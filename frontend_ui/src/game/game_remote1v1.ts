import { renderMessagesPage } from '../layout/receive_message';

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}
class GameRemote extends HTMLElement {
  private socket: WebSocket | null = null;
  private currentUser: string = '';
  private opponentUser: string = '';

  private rightPaddle_socket: Paddle = {x: 0, y: 0, width: 10, height: 80, dy: 4};
  private rightPaddleDirection_socket: number | null = null;
  private player1: string = '';
  private player2: string = '';
  private animationFrameId: number | null = null;
  private endTime: number = 0;



  private gameStarted: boolean = false; 
  private opponentReady: boolean = false;


  private startTime: number = Date.now();
  private maxScore: number = 15;
  private socres: number[] = [0, 0];
  private ball = {
    x: 400,
    y: 300,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4,
  };
  private leftPaddle: Paddle = { x: 10, y: 260, width: 10, height: 80, dy: 4 };
  private rightPaddle: Paddle = { x: 780, y: 260, width: 10, height: 80, dy: 4 };
  private leftPaddleDirection: number | null = null;
  private rightPaddleDirection: number | null = null;


  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this.initialize();

  }



  private async initialize(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const gplayer1 = urlParams.get('player1');
    const gplayer2 = urlParams.get('player2');

    try {

      const userInfo = await this.fetchCurrentUser();
      this.currentUser = userInfo.username;
      this.opponentUser = gplayer1 === this.currentUser ? gplayer2! : gplayer1!;

      if (!this.currentUser || !this.opponentUser) {
        console.error('Missing player information in URL');
        this.shadowRoot!.innerHTML = `<p class="text-red-500">Invalid game link. Please try again.</p>`;
        return;
      }
      this.player1 = this.currentUser
      this.player2 = this.opponentUser;

      this.connectWebSocket();

      this.render();
      this.setupGame();



    } catch (error) {
      console.error('Error initializing GameRemote:', error);
      this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to initialize. Please try again later.</p>`;
    }
  }

  private async fetchCurrentUser(): Promise<{ username: string }> {
    const response = await fetch('https://localhost/api/userInfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    const user = await response.json();
    return { username: user.user.username };
  }


  private connectWebSocket(): void {
    if (this.socket) {
      console.warn('WebSocket is already connected');
      return;
    }
    const token = localStorage.getItem('access_token');
    this.socket = new WebSocket(`wss://localhost/api/ws-game?from=${this.currentUser}&to=${this.opponentUser}&token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('Received message:', data);

      if (data.type === 'paddle-move') {
        const {paddleLeft, paddleDirection , myscore, opscore} = data.payload;
        // alert('You have a new message.');
        this.rightPaddle_socket = paddleLeft;
        this.rightPaddleDirection_socket = paddleDirection;
        // this.socres[1] = this.socres[1]  > myscore ? this.socres[1] : myscore;
        // this.socres[0] = this.socres[0]  > opscore ? this.socres[0] : opscore;
        
  
      } else if (data.type === 'game-start') {
        this.opponentReady = true;
      }
      else if (data.type === 'score-update') {
        const { myscore } = data.payload;
        this.socres[1] = myscore;

      }
      else if (data.type === 'game-over') {
        // console.log('Game Over ttest', this.currentUser);
        // console.log('Game over message received:', data);

        const { myscore, opscore } = data.payload || {};
        if (myscore === undefined || opscore === undefined) {
          console.error('Invalid game-over payload:', data.payload);
          return;
        }
      
        this.socres[0] = opscore;
        this.socres[1] = myscore;
      
        this.gameStarted = false;
        this.opponentReady = false;
      
        const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        if (!ctx) {
          console.error('Canvas context not found');
          return;
        }
      
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.font = '50px mono';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 100);
        
        // Display user names
        ctx.font = '25px mono';
        ctx.fillText(`${this.currentUser} vs ${this.opponentUser}`, canvas.width / 2, canvas.height / 2 - 50);
        
        // Display game score
        ctx.font = '30px mono';
        ctx.fillText(
          'Game Score: ' + this.socres[0] + ' : ' + this.socres[1],
          canvas.width / 2,
          canvas.height / 2
        );
        
       
    
        
        // Display "Press Q to Quit" text
        ctx.font = '20px mono';
        ctx.fillText('Press Q to Quit', canvas.width / 2, canvas.height / 2 + 100);
        window.addEventListener('keydown', this.handleQuitKey);

   


        



      }

      else if (data.type === 'user-exit') {

        this.shadowRoot!.innerHTML = `<p class="text-red-500"> ${this.opponentUser} left,  you win, but no record to save</p>`;
        this.gameStarted = false;
        this.opponentReady = false;
        if (this.socket) {
          this.socket.close();
          this.socket = null; // Reset the socket to prevent further usage
        }
      setTimeout(() => {
          window.location.href = '/chat'; // Replace '/chat' with the actual chat page URL
        }, 5000); 

      }
      
    };

    this.socket.onclose = () => {


      this.socket = null; // Reset the socket to allow reconnection if needed
   
      fetch('https://localhost/api/game-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          player1: this.currentUser,
          player2: this.opponentUser,
          myscore: this.socres[0],
          opscore: this.socres[1],
          startTime: this.startTime,
          endTime: this.endTime,
        }),
        credentials: 'include',
        mode: 'cors',
      })



    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }


  
  private handleQuitKey = (event: KeyboardEvent): void => {
    if (event.key === 'Q' || event.key === 'q') {
      this.socket?.close();
      window.location.href = '/chat';
    }
  };
  
    

  private  render(): void {


      this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">


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
      `;


  }







  connectedCallback() {
    this.render();
    this.setupGame();
  }

  private setupGame(): void {

    const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    canvas.style.backgroundColor = '#232946';
    canvas.style.border = '2px solid #ff8906';
    canvas.style.borderRadius = '20px';
    canvas.style.boxShadow = '0 0 20px rgba(255, 137, 6, 0.5)';

    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    window.addEventListener('beforeunload', () => this.notifyUserOnExit());

    this.update(ctx, canvas);
    
  }
  private notifyUserOnExit(): void {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: 'user-exit',
          payload: {
            from: this.currentUser,
            to: this.opponentUser,
            message: `${this.currentUser} has left the game.`,
          },
        })
      );
    }
  }

  private movePaddle(paddle: Paddle, y: number): void {
    paddle.y = y;
    const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
  }

  private moveBall(): void {
    const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    if (this.ball.y + this.ball.radius > canvas.height || this.ball.y - this.ball.radius < 0) {
      this.ball.dy *= -1;
    }

    if (
      this.ball.x - this.ball.radius < this.leftPaddle.x + this.leftPaddle.width &&
      this.ball.x + this.ball.radius > this.leftPaddle.x &&
      this.ball.y - this.ball.radius < this.leftPaddle.y + this.leftPaddle.height &&
      this.ball.y + this.ball.radius > this.leftPaddle.y
    ) {
      this.ball.dx *= -1;
      this.ball.speed++;
      const collidePoint = this.ball.y - (this.leftPaddle.y + this.leftPaddle.height / 2);
      const angleRad = (Math.PI / 4) * (collidePoint / (this.leftPaddle.height / 2));
      this.ball.dy = Math.sin(angleRad) * this.ball.speed;
    }

    if (
      this.ball.x - this.ball.radius < this.rightPaddle.x + this.rightPaddle.width &&
      this.ball.x + this.ball.radius > this.rightPaddle.x &&
      this.ball.y - this.ball.radius < this.rightPaddle.y + this.rightPaddle.height &&
      this.ball.y + this.ball.radius > this.rightPaddle.y
    ) {
      this.ball.dx *= -1;
      this.ball.speed++;
      const collidePoint = this.ball.y - (this.rightPaddle.y + this.rightPaddle.height / 2);
      const angleRad = (Math.PI / 4) * (collidePoint / (this.rightPaddle.height / 2));
      this.ball.dy = Math.sin(angleRad) * this.ball.speed;
    }

    if (this.ball.x + this.ball.radius > canvas.width) {
      this.socres[0]++;
      this.sendScoreUpdate();
      
      this.resetBall(-1);
    }
    if (this.ball.x - this.ball.radius < 0) {
      // this.socres[1]++;
      this.resetBall(1);
    }
  }

  private sendScoreUpdate(): void {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: 'score-update',
          payload: {
            from: this.currentUser,
            to: this.opponentUser,
            myscore: this.socres[0],
          },
        })
      );
    }
  }
  private resetBall(direction: number): void {
    const canvas = this.shadowRoot!.getElementById('Pong') as HTMLCanvasElement;
    this.ball.x = canvas.width / 2;
    this.ball.y = canvas.height / 2;
    this.ball.speed = 4;
    this.ball.dx = direction * this.ball.speed;
    this.ball.dy = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
  }

  private handleKeyDown(event: KeyboardEvent): void {

    if (event.key === 'H' || event.key === 'h') {
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.socket?.send (
          JSON.stringify({
            type: 'game-start',
            payload: {
              from: this.currentUser,
              to: this.opponentUser,
              message: `${this.currentUser} has started the game.`,
            },
          })
        )
      }
    }

    if (this.gameStarted && this.opponentReady) {


      if (event.key === 'W' || event.key === 'w') {
        this.leftPaddleDirection = -1;
      } else if (event.key === 'S' || event.key === 's') {
        this.leftPaddleDirection = 1;
      } 

      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: 'paddle-move',
            payload: {
              paddleLeft: this.leftPaddle,
              paddleDirection: this.leftPaddleDirection,
              myscore: this.socres[0],
              opscore: this.socres[1],

            },
          })
        );
      }

    }
  }

  private handleKeyUp(event: KeyboardEvent): void {

    if (this.leftPaddleDirection !== null) {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: 'paddle-move',
            payload: {
              paddleLeft: this.leftPaddle,
              paddleDirection: this.leftPaddleDirection,
              myscore: this.socres[0],
              opscore: this.socres[1],
  
            },
          })
        );
      }
    }
    if (event.key === 'W' || event.key === 'w' || event.key === 'S' || event.key === 's') {
      this.leftPaddleDirection = null;
    } 
  }

  private updateLeftPaddle(): void {
    if (this.leftPaddleDirection !== null) {
      this.movePaddle(this.leftPaddle, this.leftPaddle.y + this.leftPaddle.dy * this.leftPaddleDirection);
    }
  }

  private updateRightPaddle(): void {
    if (this.rightPaddle_socket && this.rightPaddleDirection_socket !== null) {
      this.rightPaddle.y = this.rightPaddle_socket.y;
      this.rightPaddleDirection = this.rightPaddleDirection_socket;
      this.movePaddle(this.rightPaddle, this.rightPaddle.y + this.rightPaddle.dy * this.rightPaddleDirection);
    }
  }

  private draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(this.leftPaddle.x, this.leftPaddle.y, this.leftPaddle.width, this.leftPaddle.height);
    ctx.fillRect(this.rightPaddle.x, this.rightPaddle.y, this.rightPaddle.width, this.rightPaddle.height);

    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '30px mono';
    ctx.fillText(`${this.socres[0]} : ${this.socres[1]}`, canvas.width / 2, 30);
    const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    const remainingTime = Math.max(180 - elapsedTime, 0); // 180 seconds = 3 minutes
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');
    ctx.fillText(`Time: ${minutes}:${seconds}`, canvas.width / 2, 60);
  }

  private update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {

    if (!this.gameStarted || !this.opponentReady) {
      // Display a message to press "H" to start the game
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '30px mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(
        this.gameStarted
          ? 'Waiting for opponent to press H...'
          : 'Press H to Start the Game',
        canvas.width / 2,
        canvas.height / 2
      );
      this.animationFrameId = requestAnimationFrame(() => this.update(ctx, canvas));
      return;
    }

    this.updateLeftPaddle();
    this.updateRightPaddle();
    
   


    this.moveBall();
    
    
    
    this.draw(ctx, canvas);

    if (!this.gameOver(ctx, canvas)) {
      this.animationFrameId = requestAnimationFrame(() => this.update(ctx, canvas));
    }
  }

  private gameOver(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): boolean {
    // if (this.socres[0] >= this.maxScore || this.socres[1] >= this.maxScore || (Date.now() - this.startTime) / 1000 >= 180) {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.font = '50px mono';
    //   ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    //   return true;
    // }
    // return false;

    if (this.socres[0] >= this.maxScore || this.socres[1] >= this.maxScore || (Date.now() - this.startTime) / 1000 >= 180) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '50px mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = '50px mono';
      ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 100);
      
      // Display user names
      ctx.font = '25px mono';
      ctx.fillText(`${this.currentUser} vs ${this.opponentUser}`, canvas.width / 2, canvas.height / 2 - 50);
      
      // Display game score
      ctx.font = '30px mono';
      ctx.fillText(
        'Game Score: ' + this.socres[0] + ' : ' + this.socres[1],
        canvas.width / 2,
        canvas.height / 2
      );
      
      // Display "Press Q to Quit" text
      ctx.font = '20px mono';
      ctx.fillText('Press Q to Quit', canvas.width / 2, canvas.height / 2 + 100);

       this.endTime = Date.now();
      //  send game result to server

      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: 'game-over',
            payload: {
              from: this.currentUser,
              to: this.opponentUser,
              myscore: this.socres[0],
              opscore: this.socres[1],
              startTime: this.startTime,
              endTime: this.endTime,
              

            },
          })
        );
      }

    
  

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Q' || event.key === 'q') {
          this.socket?.close();
          window.location.href = '/chat';
        }
      });


      return true;
    }
    return false;
  }


}

customElements.define('custom-game_remote', GameRemote);
