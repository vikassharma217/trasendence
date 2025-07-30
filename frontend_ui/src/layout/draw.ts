class Draw extends HTMLElement {
  private socket: WebSocket | null = null;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.connectWebSocket();
    this.render();
  }

  // setup WebSocket connection for tournament updates to live chat
  private connectWebSocket(): void {
    const token = localStorage.getItem("access_token");
    const currentUser = localStorage.getItem("username") || "Someone";

    this.socket = new WebSocket(
      `wss://localhost/api/ws?username=${currentUser}&token=${token}`
    );

    this.socket.onopen = () => {
      console.log("WebSocket for tournament connected");
    };

    this.socket.onerror = (err) => {
      console.error("Error in conncetion:", err);
    };
  }


  // build the tournament draw page
  private render(): void {
    const tournamentName = localStorage.getItem("tournamentName") || "Tournament";
    const players = [
        localStorage.getItem("player1") || "Player 1",
        localStorage.getItem("player2") || "Player 2",
        localStorage.getItem("player3") || "Player 3",
        localStorage.getItem("player4") || "Player 4",
      ];
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    const game1 = `${shuffledPlayers[0]} vs ${shuffledPlayers[1]}`;
    const game2 = `${shuffledPlayers[2]} vs ${shuffledPlayers[3]}`;

    this.shadowRoot!.innerHTML = `
          <link href="../dist/output.css" rel="stylesheet">
          <body class="overflow-hidden">
              <div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay">
                  <div class="relative w-full h-screen flex justify-end items-center bg-[#232946]/60">
                      <video
                        autoplay
                        muted
                        loop
                        disablepictureinpicture
                        aria-hidden="true"
                        tabindex="-1"
                        class="w-1/4 h-auto object-contain blur-[5.0px] z-[-1]"
                      >
                        <source src="/duck.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                  </div>
                  <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md">
                      <h1 class="text-4xl font-bold text-white pb-[20px] break-keep">${tournamentName} - GAME SCHEDULE</h1>
                      <main id="Link" class="flex flex-col justify-center gap-4">
                          <div class="text-[#fffffe] text-lg font-bold">
                              <p>Game 1: ${game1}</p>
                              <p>Game 2: ${game2}</p>
                          </div>
                          <a id="tour?player1=${encodeURIComponent(shuffledPlayers[0])} &player2=${encodeURIComponent(shuffledPlayers[1])}
                                      &player3=${encodeURIComponent(shuffledPlayers[2])}&player4=${encodeURIComponent(shuffledPlayers[3])}
                                      &tournamentName=${encodeURIComponent(tournamentName)}" 
                                    class="mt-4 px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                              Start Tournament
                          </a>
                          <a id="tournament" class="mt-6 px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">
                              Back to Tournament
                          </a>
                      </main>
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
    this.linkListeners();
  }

  // HAndle link events for navigation and WebSocket messages
  private linkListeners(): void {
    const formLinks = this.shadowRoot!.querySelectorAll("#Link a");
    if (formLinks) {
      formLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = "/" + (link as HTMLAnchorElement).getAttribute("id");

          // Handle the tournament start link to send a message via WebSocket
          if (href.includes("tour?")) {
            // Fetch current username from the server to send in the WebSocket message
            fetch("https://localhost/api/userInfo", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                const username = data.user.username; // Get the username from the response
                this.socket?.send(
                  JSON.stringify({
                    type: "chat-message",
                    payload: {
                      from: username,
                      to: "", //to general chat
                      message: `${username} is hosting a tournament!`,
                    },
                  })
                );
              })
              .catch((err) => {
                console.error(
                  "Failed to fetch user info for tournament message",
                  err
                );
              });
          }

          // Handle the back link to return to the tournament page
          if (href === "/back") {
            window.history.pushState({}, "", "/");
            (window as any).loadRoute("/");
          } else if (href) {
            window.history.pushState({}, "", href);
            (window as any).loadRoute(href);
          }
        });
      });
    }
  }
}
customElements.define("custom-draw", Draw);
