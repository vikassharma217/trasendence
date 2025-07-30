declare const BABYLON: any;

let username = "Player_1"; // Default name

async function fetchUsername(): Promise<string> {
  try {
    const response = await fetch('https://localhost/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.userInformation.username;
  } catch (error) {
    console.error('Error fetching username:', error);
    return "Player_1"; // Fallback name
  }
}

export function initializeBabylonBot(canvas: HTMLCanvasElement): void {
  fetchUsername().then(name => {
    username = name; // Store the fetched username
    const engine = new BABYLON.Engine(canvas, true);
    const scene = createScene(engine, canvas);

    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener("resize", () => {
      engine.resize();
    });
  });
}

function createScene(engine: any, canvas: HTMLCanvasElement): any {
  const scene = new BABYLON.Scene(engine);

  // Camera (static)
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -15),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.5;

  // === BALL ===
  const ball = BABYLON.MeshBuilder.CreateSphere(
    "ball",
    { diameter: 0.35, segments: 32 },
    scene
  );
  ball.position = new BABYLON.Vector3(0, 0.2, 0);
  const ballMat = new BABYLON.StandardMaterial("ballMat", scene);
  ballMat.emissiveColor = new BABYLON.Color3(0.98, 1, 0.01); // Yellow glow
  ball.material = ballMat;

  // === GROUND ===
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 7, height: 14 },
    scene
  );
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.51, 0.24); // Matte green
  ground.material = groundMat;

  // Ground markings
  const hLine = BABYLON.MeshBuilder.CreateLines(
    "hLine",
    {
      points: [
        new BABYLON.Vector3(-3.5, 0.01, 0),
        new BABYLON.Vector3(3.5, 0.01, 0),
      ],
    },
    scene
  );
  hLine.color = BABYLON.Color3.White();

  const vLine = BABYLON.MeshBuilder.CreateLines(
    "vLine",
    {
      points: [
        new BABYLON.Vector3(0, 0.01, -7),
        new BABYLON.Vector3(0, 0.01, 7),
      ],
    },
    scene
  );
  vLine.color = BABYLON.Color3.White();

  // === WALLS ===
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.emissiveColor = new BABYLON.Color3(0.87, 0.9, 0.88);

  const leftWall = BABYLON.MeshBuilder.CreateBox(
    "leftWall",
    { width: 0.1, height: 0.3, depth: 14 },
    scene
  );
  leftWall.position.set(-3.55, 0.15, 0);
  leftWall.material = wallMat;

  const rightWall = BABYLON.MeshBuilder.CreateBox(
    "rightWall",
    { width: 0.1, height: 0.3, depth: 14 },
    scene
  );
  rightWall.position.set(3.55, 0.15, 0);
  rightWall.material = wallMat;

  // === SLIDERS ===
  // Bottom Slider - Red Capsule
  const bottomSlider = BABYLON.MeshBuilder.CreateBox(
    "bottomSlider",
    { width: 1.2, height: 0.2, depth: 0.1 },
    scene
  );
  bottomSlider.position.set(0, 0.2, -7.4);
  const bottomMat = new BABYLON.StandardMaterial("bottomMat", scene);
  bottomMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // Red glow
  bottomSlider.material = bottomMat;

  // top Slider - Blue Capsule
  const topSlider = BABYLON.MeshBuilder.CreateBox(
    "topSlider",
    { width: 1.2, height: 0.2, depth: 0.1 },
    scene
  );
  topSlider.position.set(0, 0.2, 7.2);
  const topMat = new BABYLON.StandardMaterial("topMat", scene);
  topMat.emissiveColor = new BABYLON.Color3(0, 0.33, 1); // Blue glow
  topSlider.material = topMat;

  // GLOW EFFECT: add to all materail using emissiveColor
  const glowLayer = new BABYLON.GlowLayer("glow", scene);
  glowLayer.intensity = 0.5;

  // Parent everything to root
  const tableRoot = new BABYLON.TransformNode("tableRoot", scene);

  [
    ground,
    hLine,
    vLine,
    leftWall,
    rightWall,
    bottomSlider,
    topSlider,
    ball,
  ].forEach((mesh) => {
    mesh.parent = tableRoot;
  });

  // Animation intro
  tableRoot.position.y = 10;
  tableRoot.rotation.y = Math.PI;

  const animGroup = new BABYLON.AnimationGroup("tableIntro");

  const descendAnim = new BABYLON.Animation(
    "descend",
    "position.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  descendAnim.setKeys([
    { frame: 0, value: 10 },
    { frame: 180, value: 0 },
  ]);

  const rotateAnim = new BABYLON.Animation(
    "rotate",
    "rotation.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  rotateAnim.setKeys([
    { frame: 0, value: Math.PI },
    { frame: 180, value: 0 },
  ]);

  const easing = new BABYLON.CubicEase();
  easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
  descendAnim.setEasingFunction(easing);
  rotateAnim.setEasingFunction(easing);

  tableRoot.animations.push(descendAnim, rotateAnim);
  animGroup.addTargetedAnimation(descendAnim, tableRoot);
  animGroup.addTargetedAnimation(rotateAnim, tableRoot);
  animGroup.play();

  // Movement settings
  const moveSpeed = 0.2;
  let ballSpeed = new BABYLON.Vector3(0, 0, 0.1);
  let gameStarted = false;
  let serveToPlayer1 = Math.random() < 0.5;
  let gameOver = false;
  let startTime = Date.now(); // Add start time
  const maxScore = 15; // Add max score

  // Scoreboard setup
  let player1Score = 0;
  let player2Score = 0;
  let player1Name = username; // Use fetched username directly
  let player2Name = "Mighty Duck";

  const scoreboard = BABYLON.MeshBuilder.CreatePlane(
    "scoreboard",
    { width: 9, height: 7 },
    scene
  );
  scoreboard.position = new BABYLON.Vector3(0, 4, -8);
  scoreboard.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

  const scoreboardTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(scoreboard);
  const scoreboardText = new BABYLON.GUI.TextBlock();
  scoreboardText.text = `${player1Name}: 0  VS  ${player2Name}: 0`;
  scoreboardText.color = "white";
  scoreboardText.fontSize = 24;
  scoreboardTexture.addControl(scoreboardText);
  scoreboardText.isVisible = false;

  // Gameover layer
  const gameOverPlane = BABYLON.MeshBuilder.CreatePlane(
    "gameOver",
    { width: 10, height: 10 },
    scene
  );
  gameOverPlane.position = new BABYLON.Vector3(0, 3, -7);
  gameOverPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  gameOverPlane.isVisible = false;

  const gameOverTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(gameOverPlane);

  // Add semi-transparent background
  const bg = new BABYLON.GUI.Rectangle();
  bg.background = "black";
  bg.alpha = 0.7; // 70% opacity
  bg.width = "100%";
  bg.height = "100%";

  gameOverTexture.addControl(bg);

  const gameOverText = new BABYLON.GUI.TextBlock();
  //gameOverText.text = "Game Over\n\nCongratulation player (winner)\n\nPress R to restart  | Press Q to quit";
  gameOverText.color = "white";
  gameOverText.fontSize = 36;
  gameOverText.textHorizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  gameOverText.textVerticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  gameOverTexture.addControl(gameOverText);

  function resetBall(outByTopPlayer: boolean | null = null) {
    ball.position = new BABYLON.Vector3(0, 0.2, 0);

    // Update scores
    if (outByTopPlayer === true) player2Score++;
    else if (outByTopPlayer === false) player1Score++;
    flashScoreboard();

    scoreboardText.text = `${player1Name}: ${player1Score} vs ${player2Name}: ${player2Score}`;

    // Set serve direction
    const directionZ = serveToPlayer1 ? -0.1 : 0.1;
    ballSpeed = new BABYLON.Vector3(0, 0, directionZ);
    gameStarted = false;
    serveToPlayer1 = !serveToPlayer1;
  }

  // Independent key tracker for paddle movement
  const pressedKeys: { [key: string]: boolean } = {};

  // Listen to key presses globally
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    pressedKeys[key] = true;

    // Start game if paddle key pressed
    if (!gameStarted && (key === " ")) {
      gameStarted = true;
      welcomePlane.isVisible = false;
      scoreboardText.isVisible = true;
    }

    // Restart game on 'r'
    if (key === "r") {
      restartGame();
    }
    // Quit game on 'q'
    if (key === "q") {
      window.history.back();
    }
  });
  window.addEventListener("keyup", (event) => {
    pressedKeys[event.key.toLowerCase()] = false;
  });
  // Paddle movement independent of game loop
  function updatePaddlesIndependently() {
    const moveSpeed = 0.1;

    // Bottom paddle control with updated boundaries
    if (pressedKeys["a"] && bottomSlider.position.x > -2.9) {
      bottomSlider.position.x -= moveSpeed;
    }
    if (pressedKeys["d"] && bottomSlider.position.x < 2.9) {
      bottomSlider.position.x += moveSpeed;
    }

    requestAnimationFrame(updatePaddlesIndependently);
  }
  updatePaddlesIndependently();

  function restartGame() {
    // Reset scores and game state
    player1Score = 0;
    player2Score = 0;
    startTime = Date.now(); // Reset timer
    serveToPlayer1 = Math.random() < 0.5;
    gameOver = false;
    gameStarted = false;

    // Reset UI
    scoreboardText.text = `${player1Name}: 0 vs ${player2Name}: 0`;
    gameOverPlane.isVisible = false;

    // Reset ball position and speed
    ball.position = new BABYLON.Vector3(0, 0.2, 0);
    ballSpeed = new BABYLON.Vector3(0, 0, serveToPlayer1 ? -0.1 : 0.1);

    // Reset paddle positions
    bottomSlider.position.x = 0;
    topSlider.position.x = 0;
  }

 // ball collision effect
 function flashMesh(
  mesh: any,  // Changed from BABYLON.Mesh to any
  flashColor: any,  // Changed from BABYLON.Color3 to any
  duration = 100
) {
  const material = mesh.material as any;  // Changed casting to any

  if (material && material.emissiveColor) {
    const originalColor = material.emissiveColor.clone();
    material.emissiveColor = flashColor;

    setTimeout(() => {
      material.emissiveColor = originalColor;
    }, duration);
  }
}

  function flashScoreboard() {
    scoreboardText.color = "yellow";
    setTimeout(() => (scoreboardText.color = "white"), 400);
  }

  // Welcome screen
  const welcomePlane = BABYLON.MeshBuilder.CreatePlane(
    "welcome",
    { width: 10, height: 10 },
    scene
  );
  welcomePlane.position = new BABYLON.Vector3(0, 3, -7);
  welcomePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

  const welcomeTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(welcomePlane);

  // Semi-transparent background
  const welcomeBg = new BABYLON.GUI.Rectangle();
  welcomeBg.background = "black";
  welcomeBg.alpha = 0.7;
  welcomeBg.width = "100%";
  welcomeBg.height = "100%";
  welcomeTexture.addControl(welcomeBg);

  // Welcome text
  const welcomeText = new BABYLON.GUI.TextBlock();
  welcomeText.text =
    "🏓 Welcome to 3D Pong AI 🏓\n\nPlayer 1: Use A / D to move\n\nPress SPACE to start!";
  welcomeText.color = "white";
  welcomeText.fontSize = 24;
  welcomeText.textHorizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  welcomeText.textVerticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  welcomeTexture.addControl(welcomeText);

  //sound effects

  /*const bgMusic = new BABYLON.Sound("bg", "https://cdn.pixabay.com/audio/2023/03/05/audio_c9fe5c56cf.mp3", scene, null, {
      loop: true,
      autoplay: false,
      volume: 0.3
  });*/

  // AI Player logic
  /*let aiSnapshot = { ballX: 0, ballY: 0, ballVX: 0, ballVZ: 0 };
  let aiTargetX = 0;
  const aiUpdateInterval = 1000; // More frequent updates for smoother movement

  function predictBallX(snapshot: typeof aiSnapshot): number {
    let { ballX, ballY, ballVX, ballVZ } = snapshot;

    if (ballVZ <= 0) return 0; // Ball moving away from AI

    // Calculate time until ball reaches AI paddle's Z position
    let t = (6.1 - ballY) / ballVZ;

    // Predict X position when ball reaches paddle
    let predictedX = ballX + ballVX * t;

    // Add some randomization for more natural movement
    predictedX += (Math.random() - 0.5) * 0.3;

    // Keep prediction within bounds
    return Math.max(-2.4, Math.min(2.4, predictedX));
  }

  function updateAIPaddle(topSlider: any) {
    const aiMoveSpeed = 0.08;

    // Update AI snapshot
    aiSnapshot = {
      ballX: ball.position.x,
      ballY: ball.position.z,
      ballVX: ballSpeed.x,
      ballVZ: ballSpeed.z,
    };

    // Get predicted position
    aiTargetX = predictBallX(aiSnapshot);

    // Move towards predicted position
    const paddleCenter = topSlider.position.x;
    const buffer = 0.1; // Small buffer for smoother movement

    if (paddleCenter < aiTargetX - buffer) {
      topSlider.position.x += aiMoveSpeed;
    } else if (paddleCenter > aiTargetX + buffer) {
      topSlider.position.x -= aiMoveSpeed;
    }

    // Ensure paddle stays within bounds
    if (topSlider.position.x < -2.4) topSlider.position.x = -2.4;
    if (topSlider.position.x > 2.4) topSlider.position.x = 2.4;
  } 
*/
// Replace the existing AI logic section with:

// AI Player logic
let aiSnapshot = { 
    ballX: 0, 
    ballY: 0, 
    ballVX: 0, 
    ballVZ: 0,
    paddleX: 0 
};
let aiTargetX = 0;
const aiUpdateInterval = 16; 

function predictBallX(snapshot: typeof aiSnapshot): number {
    let { ballX, ballY, ballVX, ballVZ } = snapshot;
    if (ballVZ <= 0) return topSlider.position.x;
    let t = (7.1 - ballY) / ballVZ;
    let predictedX = ballX + ballVX * t;
    predictedX += (Math.random() - 0.5) * 0.3;
    // Update bounce boundaries
    while (predictedX < -2.9 || predictedX > 2.9) {
        if (predictedX < -2.9) predictedX = -5.8 - predictedX;
        else if (predictedX > 2.9) predictedX = 5.8 - predictedX;
    }
    return Math.max(-2.9, Math.min(2.9, predictedX));
}

function aiLogic(): void {
    // Update AI snapshot
    aiSnapshot = {
        ballX: ball.position.x,
        ballY: ball.position.z,
        ballVX: ballSpeed.x,
        ballVZ: ballSpeed.z,
        paddleX: topSlider.position.x
    };

    // Get predicted position
    const predictedX = predictBallX(aiSnapshot);
    
    // Calculate paddle center and movement
    const paddleCenter = topSlider.position.x;
    const buffer = 0.1; // Small buffer for smoother movement
    const aiMoveSpeed = 0.08;

    // Move paddle based on prediction
    if (paddleCenter < predictedX - buffer) {
        topSlider.position.x += aiMoveSpeed;
    } else if (paddleCenter > predictedX + buffer) {
        topSlider.position.x -= aiMoveSpeed;
    }
    // Ensure paddle stays within new bounds
    topSlider.position.x = Math.max(-2.9, Math.min(2.9, topSlider.position.x));
}

// Add interval update for continuous position tracking
setInterval(() => {
    aiSnapshot = {
        ballX: ball.position.x,
        ballY: ball.position.z,
        ballVX: ballSpeed.x,
        ballVZ: ballSpeed.z,
        paddleX: topSlider.position.x
    };
    aiTargetX = predictBallX(aiSnapshot);
}, aiUpdateInterval);


   


  // Game loop
  scene.registerBeforeRender(() => {
    if (gameOver || !gameStarted) return;

    // Add time check
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = Math.max(180 - elapsedTime, 0); // 3 minutes
    
    // Update scoreboard with time
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');
    scoreboardText.text = `${player1Name}: ${player1Score} vs ${player2Name}: ${player2Score}\nTime: ${minutes}:${seconds}`;

    // Check for time-based game over
    if (remainingTime === 0) {
      gameOver = true;
      gameOverPlane.isVisible = true;
      const winner = player1Score > player2Score ? player1Name : 
                    (player1Score < player2Score ? player2Name : "Draw");
      gameOverText.text = `Game Over\nWinner: ${winner}\nPress R to restart | Press Q to quit`;
      return;
    }

    // Ball movement
    const scaleFactor = 1 - Math.min(ball.position.z / 20, 0.7);
    ball.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
    ball.position.addInPlace(ballSpeed);

    // Update AI paddle
    aiLogic();

    // Bounce off side walls
    if (ball.position.x <= -3.4 || ball.position.x >= 3.4) {
      ballSpeed.x *= -1;
      flashMesh(leftWall, new BABYLON.Color3(0.49, 0.49, 0.85));
    }

    // Collision with bottom slider
    if (
      ball.position.z <= -7.1 &&
      Math.abs(ball.position.x - bottomSlider.position.x) <= 0.6
    ) {
      const deltaX = ball.position.x - bottomSlider.position.x;
      ballSpeed.z *= -1;
      ballSpeed.x = deltaX * 0.2;
      flashMesh(bottomSlider, new BABYLON.Color3(0.49, 0.49, 0.85));
    }
    // Collision with top slider
    if (
      ball.position.z >= 7.1 &&
      Math.abs(ball.position.x - topSlider.position.x) <= 0.6
    ) {
      const deltaX = ball.position.x - topSlider.position.x;
      ballSpeed.z *= -1;
      ballSpeed.x = deltaX * 0.2;
      flashMesh(topSlider, new BABYLON.Color3(0.49, 0.49, 0.85));
    }
    // Ball out - scoring
    if (ball.position.z > 7.3) resetBall(false); // Bottom player scored
    if (ball.position.z < -7.3) resetBall(true); // Top player scored

    // Game Over check - update with maxScore
    if (player1Score >= maxScore || player2Score >= maxScore) {
      gameOver = true;
      gameOverPlane.isVisible = true;
      const winner = player1Score > player2Score ? player1Name : player2Name;
      gameOverText.text = `Game Over\nCongratulations ${winner}!\nPress R to restart | Press Q to quit`;
      return;
    }
  });

  return scene;
}