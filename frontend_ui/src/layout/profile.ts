declare const Chart: any;

class UserProfile extends HTMLElement {
  private currentPage: number = 1;
  private itemsPerPage: number = 5;
  private lastSection: string = '#1'; // Track last shown section

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private async fetchUserProfile(): Promise<{
    userInformation: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    avatarPath: string;
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
    credentials: 'include', 
    mode: 'cors', 
    });

    if (!response.ok) {
    throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  }

  private renderPagination(totalItems: number): string {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    let paginationHTML = '<div class="pagination flex justify-center mt-2">';
    for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn mx-1 px-3 py-1 border rounded ${
      i === this.currentPage ? 'bg-[#ff8906] text-white' : 'bg-gray-200'
    }" data-page="${i}">${i}</button>`;
    }
    paginationHTML += '</div>';
    return paginationHTML;
  }

  private async render(): Promise<void> {
    try {
    const { userInformation, gameInformation, gameDetails } = await this.fetchUserProfile();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedHistory = gameDetails.slice(startIndex, endIndex);
    let fileUrl = "/df.jpeg"; // Default avatar path if no custom avatar is set
    if (userInformation.avatarPath !== '/public/df.jpeg') {
      fileUrl = `https://localhost/api${userInformation.avatarPath}`; // Construct the full URL for the avatar image

    }

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
        <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-4xl hover:shadow-white hover:shadow-md min-w-[500px] z-[30] overflow-auto">
          <div id="Head" class="flex flex-row justify-between items-center mb-4">
            <a id="back"><button class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back</button></a>
            <h1 class="text-4xl font-bold text-white break-keep">RETRO GAMER</h1> 
            <a id="settings"><button class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Settings</button></a>
          </div>
          <div class="flex flex-row justify-center items-center mb-4 gap-4">
            <button id="prof" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Profile Info</button>
            <button id="stat" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Game Stats</button> 
            <button id="hist" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Game History</button>
          </div>
          <!-- THE SWITCH BASED ON BUTTONS -->
          <main class="flex flex-col gap-4 text-white text-left justify-center items-center">

            <!-- Basic User Information -->
            <div id="#1" class="flex flex-row justify-center items-center mb-4 gap-6">
            <div class="p-6 bg-[#232946]/60 rounded-3xl shadow-2xl border-b-[4px] border-[#eebbc3] font-mono max-w-4xl hover:shadow-white hover:shadow-md flex flex-row gap-6 shrink-0 overflow-auto">
              <div>
                <h2 class="text-2xl font-bold mb-4 text-[#eebbc3]">Player Info</h2>
                <div class="flex items-center gap-6 ">
                  <img src="${fileUrl}" alt="Avatar" class="w-16 h-16 rounded-full border-1 border-[#eebbc3]">
                  <div class="space-y-2">
                  <p><strong>Username:</strong> ${userInformation.username}</p>
                  <p><strong>First Name:</strong> ${userInformation.firstname}</p>
                  <p><strong>Last Name:</strong> ${userInformation.lastname}</p>
                  <p><strong>Email:</strong> ${userInformation.email}</p>
                  <p><strong>Phone:</strong> ${userInformation.phone}</p>
                  <p><strong>Address:</strong> ${userInformation.address}</p>
                  </div>
                </div>
                </div>
                <!-- Game Information -->
                <div>
                <h2 class="text-2xl font-bold mb-4 text-[#eebbc3]">Game Information</h2>
                <div class="flex flex-col items-left gap-2">
                  <p><strong>Wins:</strong> ${gameInformation.winTimes}</p>
                  <p><strong>Losses:</strong> ${gameInformation.loseTimes}</p>
                  <p><strong>Draws:</strong> ${gameInformation.drawTimes}</p>
                  <p><strong>Total Games:</strong> ${gameInformation.totalTimes}</p>
                </div>
                </div>
              </div>
            </div>


            <!-- Data Visualization -->
            <div id="#2" class="p-6 bg-[#232946]/60 overflow-x-auto border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono max-w-4xl hover:shadow-white hover:shadow-md hidden">
            <h2 class="text-2xl font-bold mb-4">Game Statistics Visualization</h2>
            <div class="data-visualization mb-6">
              <canvas id="gameStatsChart" class="w-full h-64"></canvas>
            </div>
            </div>



            <!-- Game History -->
            <div id="#3" class="p-6 bg-[#232946]/60 overflow-x-auto border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono max-w-4xl hover:shadow-white hover:shadow-md hidden">
            <h2 class="text-2xl font-bold mb-4 text-[#eebbc3]">Game History</h2>
            <table class="w-full border-collapse text-sm">
              <thead>
              <tr class="bg-[#2a2f4a]">
                <th class="border border-[#eebbc3] px-4 py-2">Date</th>
                <th class="border border-[#eebbc3] px-4 py-2">Opponent</th>
                <th class="border border-[#eebbc3] px-4 py-2">Win</th>
                <th class="border border-[#eebbc3] px-4 py-2">Lose</th>
                <th class="border border-[#eebbc3] px-4 py-2">Draw</th>
                <th class="border border-[#eebbc3] px-4 py-2">Score</th>
              </tr>
              </thead>
              <tbody>
              ${paginatedHistory
                .map(
                (game) => `
                <tr class="hover:bg-[#393e5f]/50">
                  <td class="border border-[#eebbc3] px-4 py-2">${game.date}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${game.opponent}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${game.win}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${game.lose}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${game.draw}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${game.score}</td>
                </tr>
                `
                )
                .join('')}
              </tbody>
            </table>
            ${this.renderPagination(gameDetails.length)}
            </div>    
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
    // Render the chart using Chart.js
    const ctx = this.shadowRoot!.querySelector<HTMLCanvasElement>('#gameStatsChart')?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Wins', 'Losses', 'Draws'],
        datasets: [
        {
          label: 'Game Statistics',
          data: [gameInformation.winTimes, gameInformation.loseTimes, gameInformation.drawTimes],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        },
        ],
      },
      options: {
        responsive: true,
        plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        },
      },
      });
    }

    // Add event listeners for pagination buttons
    this.shadowRoot!.querySelectorAll('.page-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      this.currentPage = parseInt(target.dataset.page!);
      this.lastSection = '#3'; // Always show history tab after pagination
      this.render();
      });
    });
    } catch (error) {
    console.error('Error rendering profile:', error);
    this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load profile. Please try again later.</p>`;
    }

    // Add tab switching functionality
    const showSection = (sectionId: string) => {
    this.lastSection = sectionId;
    const sections = ['#1', '#2', '#3'];
    sections.forEach(id => {
      const el = this.shadowRoot!.querySelector<HTMLDivElement>(`div[id="${id}"]`);
      if (el) {
      el.classList.add('hidden');
      }
    });
    const active = this.shadowRoot!.querySelector<HTMLDivElement>(`div[id="${sectionId}"]`);
    if (active) {
      active.classList.remove('hidden');
    }
    };

    // Show the last active section (default to #1)
    showSection(this.lastSection);

    this.shadowRoot!.getElementById('prof')?.addEventListener('click', () => showSection('#1'));
    this.shadowRoot!.getElementById('stat')?.addEventListener('click', () => showSection('#2'));
    this.shadowRoot!.getElementById('hist')?.addEventListener('click', () => showSection('#3'));
    this.linkListeners();
  }
  private linkListeners(): void {
   const formLinks = this.shadowRoot!.querySelectorAll('#Head a');
   if (formLinks) {
     formLinks.forEach((link) => {
       link.addEventListener('click', (event) => {
         event.preventDefault();
         const href = "/" + (link as HTMLAnchorElement).getAttribute('id');
         if (href === "/back") {
           window.history.pushState({}, '', '/'); // Redirect to home page if 'back' is clicked
           (window as any).loadRoute('/'); // Redirect to home page if 'back' is clicked
         } else if (href) {
           window.history.pushState({}, '', href);
           (window as any).loadRoute(href);
         }
       });
     });
   }
  }
}
  
  // Define the custom element
customElements.define('custom-profile', UserProfile);

