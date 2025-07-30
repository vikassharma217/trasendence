declare const BABYLON: any;

let username = "Player_1"; // Default name

// fetch the username from the backend
async function fetchUsername(): Promise<string> {
  try {
    const response = await fetch("https://localhost/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data.userInformation.username;
  } catch (error) {
    console.error("Error fetching username:", error);
    return "Player_1";
  }
}

// Initialize Babylon.js, calles when the page loads
export function initializeBabylon(canvas: HTMLCanvasElement): void {
  fetchUsername().then((name) => {
    username = name;
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

// Creat the elements of the scene using Babylon.js
function createScene(engine: any, canvas: HTMLCanvasElement): any {
  const scene = new BABYLON.Scene(engine);

  // set the camera
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -15),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());

  // set the light
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.5;

  // create the ball
  const ball = BABYLON.MeshBuilder.CreateSphere(
    "ball",
    { diameter: 0.35, segments: 32 },
    scene
  );
  ball.position = new BABYLON.Vector3(0, 0.2, 0);
  const ballMat = new BABYLON.StandardMaterial("ballMat", scene);
  ballMat.emissiveColor = new BABYLON.Color3(0.98, 1, 0.01); // Yellow glow
  ball.material = ballMat;

  // creat the ground (table)
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 7, height: 14 },
    scene
  );
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.51, 0.24); // Matte green
  ground.material = groundMat;

  // create the lines
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

  // create the walls
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

  // create the paddles (sliders)
  const bottomSlider = BABYLON.MeshBuilder.CreateBox(
    "bottomSlider",
    { width: 1.2, height: 0.2, depth: 0.1 },
    scene
  );
  bottomSlider.position.set(0, 0.2, -7.4);
  const bottomMat = new BABYLON.StandardMaterial("bottomMat", scene);
  bottomMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // Red glow
  bottomSlider.material = bottomMat;

  const topSlider = BABYLON.MeshBuilder.CreateBox(
    "topSlider",
    { width: 1.2, height: 0.2, depth: 0.1 },
    scene
  );
  topSlider.position.set(0, 0.2, 7.2);
  const topMat = new BABYLON.StandardMaterial("topMat", scene);
  topMat.emissiveColor = new BABYLON.Color3(0, 0.33, 1); // Blue glow
  topSlider.material = topMat;

  // glow effect
  const glowLayer = new BABYLON.GlowLayer("glow", scene);
  glowLayer.intensity = 0.5;

  // parent all elements to a root node to move them together
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

  // Animation intro to open the game
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
  //const moveSpeed = 0.2;
  let ballSpeed = new BABYLON.Vector3(0, 0, 0.1);
  let gameStarted = false;
  let serveToPlayer1 = Math.random() < 0.5;
  let gameOver = false;
  let startTime = Date.now(); // Add start time
  const maxScore = 15; // Add max score like game1v1

  // Add paddle boundary settings
  const tableWidth = 7; // Updated width of the ground/table
  const paddleWidth = 1.2; // Width of the paddles
  const paddleBoundary = (tableWidth - paddleWidth) / 2; // Dynamic boundary calculation ~ 2.9

  // Scoreboard setup
  let player1Score = 0;
  let player2Score = 0;
  let player1Name = username + "_1";
  let player2Name = username + "_2";

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
  gameOverText.color = "white";
  gameOverText.fontSize = 36;
  gameOverText.textHorizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  gameOverText.textVerticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  gameOverTexture.addControl(gameOverText);

  // Reset ball position and speed, update score
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

  // Add paddle direction state
  let bottomPaddleDirection: number | null = null;
  let topPaddleDirection: number | null = null;
  const paddleMoveSpeed = 0.1;

  // padddle controls with directional approach
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    // Bottom paddle controls
    if (key === "a") {
      bottomPaddleDirection = -1;
    } else if (key === "d") {
      bottomPaddleDirection = 1;
    }

    // Top paddle controls
    if (key === "4") {
      topPaddleDirection = -1;
    } else if (key === "6") {
      topPaddleDirection = 1;
    }

    // Start game on space
    if (!gameStarted && key === " ") {
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
    const key = event.key.toLowerCase();

    // Clear bottom paddle direction
    if (key === "a" && bottomPaddleDirection === -1) {
      bottomPaddleDirection = null;
    } else if (key === "d" && bottomPaddleDirection === 1) {
      bottomPaddleDirection = null;
    }

    // Clear top paddle direction
    if (key === "4" && topPaddleDirection === -1) {
      topPaddleDirection = null;
    } else if (key === "6" && topPaddleDirection === 1) {
      topPaddleDirection = null;
    }
  });

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
    mesh: any, // Changed from BABYLON.Mesh to any
    flashColor: any, // Changed from BABYLON.Color3 to any
    duration = 100
  ) {
    const material = mesh.material as any; // Changed casting to any

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
    "🏓 Welcome to 3D Pong 1vs1 🏓\n\nPlayer 1: Use A / D to move\nPlayer 2: Use NUMPAD:4 / NUMPAD 6 to move\n\nPress SPACE to start!";
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

  // Game loop
  scene.registerBeforeRender(() => {
    if (gameOver || !gameStarted) return;

    // Add time check
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = Math.max(180 - elapsedTime, 0); // 3 minutes like game1v1

    // Update scoreboard with time
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");
    const seconds = String(remainingTime % 60).padStart(2, "0");
    scoreboardText.text = `${player1Name}: ${player1Score} vs ${player2Name}: ${player2Score}\nTime: ${minutes}:${seconds}`;

    // Check for time-based game over
    if (remainingTime === 0) {
      gameOver = true;
      gameOverPlane.isVisible = true;
      const winner =
        player1Score > player2Score
          ? player1Name
          : player1Score < player2Score
          ? player2Name
          : "Draw";
      gameOverText.text = `Game Over\nWinner: ${winner}\nPress R to restart | Press Q to quit`;
      return;
    }

    const scaleFactor = 1 - Math.min(ball.position.z / 20, 0.7);
    ball.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);

    ball.position.addInPlace(ballSpeed);

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

    // Update bottom paddle position
    if (bottomPaddleDirection !== null) {
      const newX =
        bottomSlider.position.x + paddleMoveSpeed * bottomPaddleDirection;
      if (newX >= -2.9 && newX <= 2.9) {
        bottomSlider.position.x = newX;
      }
    }

    // Update top paddle position
    if (topPaddleDirection !== null) {
      const newX = topSlider.position.x + paddleMoveSpeed * topPaddleDirection;
      if (newX >= -2.9 && newX <= 2.9) {
        topSlider.position.x = newX;
      }
    }
  });

  return scene;
}
