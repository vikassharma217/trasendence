class tournament extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  private render(): void {
    this.shadowRoot!.innerHTML = `
      <link href="../dist/output.css" rel="stylesheet">
      <style>
        ::placeholder { color: white; opacity: 0.7; }
        input { color: white; }
      </style>
      <body class="overflow-hidden">
        <div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay">
          <div class="relative w-full h-screen flex justify-end items-center bg-[#232946]/60">
            <video autoplay muted loop disablepictureinpicture aria-hidden="true" tabindex="-1"
              class="w-1/4 h-auto object-contain blur-[5.0px] z-[-1]">
              <source src="/duck.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md">
            <h1 class="text-4xl font-bold text-white pb-[20px] break-keep">TOURNAMENT</h1>
            <main id="Link" class="flex flex-col justify-center">
              <input id="tournamentName" type="text" placeholder="Enter Tournament Name" 
                class="px-6 py-4 border-2 border-[#eebbc3] rounded-md text-[#232946] w-full text-2xl font-bold text-center mb-6" />

              <div class="grid grid-cols-2 gap-4">
                <input id="player1" type="text" placeholder="Enter Player 1 Name" class="px-4 py-2 border-2 border-[#eebbc3] rounded-md text-[#232946]" />
                <input id="player2" type="text" placeholder="Enter Player 2 Name" class="px-4 py-2 border-2 border-[#eebbc3] rounded-md text-[#232946]" />
                <input id="player3" type="text" placeholder="Enter Player 3 Name" class="px-4 py-2 border-2 border-[#eebbc3] rounded-md text-[#232946]" />
                <input id="player4" type="text" placeholder="Enter Player 4 Name" class="px-4 py-2 border-2 border-[#eebbc3] rounded-md text-[#232946]" />
              </div>

              <a id="draw" class="mt-6 px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Draw Tournament</a>
              <a id="back" class="mt-4 px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back</a>
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
      </body>
    `;
    this.linkListeners();
  }

  // input validation: trim the input, check for emty field, lenghm duplication, and regex
  private validateForm(): boolean {
    const getVal = (id: string) =>
      (this.shadowRoot!.getElementById(id) as HTMLInputElement).value.trim();

    const tournamentName = getVal("tournamentName");
    const players = [
      getVal("player1"),
      getVal("player2"),
      getVal("player3"),
      getVal("player4"),
    ];
    const uniquePlayers = new Set(players.filter(Boolean));

    if (!tournamentName || players.some((p) => !p)) {
      alert("All fields must be filled out.");
      return false;
    }

    if (
      tournamentName.length < 3 ||
      tournamentName.length > 12 ||
      !/^[a-zA-Z0-9]+$/.test(tournamentName)
    ) {
      alert(
        "Tournament name must be 3-12 characters long and contain only letters and numbers."
      );
      return false;
    }

    for (const p of players) {
      if (p.length < 3 || p.length > 10 || !/^[a-zA-Z0-9]+$/.test(p)) {
        alert(
          "Player names must be 3-10 characters long and contain only letters and numbers."
        );
        return false;
      }
    }

    if (uniquePlayers.size !== players.length) {
      alert("Player names must be unique.");
      return false;
    }

    // Save to localStorage only if validation passed
    localStorage.setItem("tournamentName", tournamentName);
    localStorage.setItem("player1", players[0]);
    localStorage.setItem("player2", players[1]);
    localStorage.setItem("player3", players[2]);
    localStorage.setItem("player4", players[3]);

    return true;
  }

  // link listners to navigate links and avoid refreshing the page
  private linkListeners(): void {
    const links = this.shadowRoot!.querySelectorAll("#Link a");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const href = "/" + (link as HTMLAnchorElement).getAttribute("id");

        if (href === "/back") {
          window.history.pushState({}, "", "/");
          (window as any).loadRoute("/");
        } else if (href === "/draw") {
          const isValid = this.validateForm();
          if (isValid) {
            window.history.pushState({}, "", href);
            (window as any).loadRoute(href);
          }
        } else {
          window.history.pushState({}, "", href);
          (window as any).loadRoute(href);
        }
      });
    });
  }
}

customElements.define("custom-tournament", tournament);
