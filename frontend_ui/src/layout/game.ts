
// class CustomGame extends HTMLElement {
//     constructor() {
//       super();
//       this.attachShadow({ mode: 'open' });
//       this.render();
//     }

//     // private async Games(): Promise<{ username: string }> {
//     //   const response = await fetch('http://localhost:8080/game', {
//     //     method: 'GET',
//     //     headers: {
//     //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//     //     },
//     //   })
//     //   if (!response.ok) {
//     //     throw new Error('Failed to fetch game data');
//     //   }
//     //   const data = await response.json();
//     //   console.log(data);
//     //   return data;
 
    
//     // }
//     private async render(): Promise<void> {
//       try {
//         // const { username } = await this.Games();
//         this.shadowRoot!.innerHTML = `
//           <link href="../dist/output.css" rel="stylesheet">
//           <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <h2 class="text-2xl font-bold mb-4 text-center">Welcome to the Game</h2>
//             <p class="text-center text-gray-600 mb-4">Choose your game mode:</p>
//             <ul class="list-none text-center">
//               <li class="mb-4">
//                 <a href="/game_local" class="text-blue-500 hover:underline text-lg">1 vs 1 (Local)</a>
//               </li>
//               <li class="mb-4">
//                 <a href="/game_computer" class="text-blue-500 hover:underline text-lg">1 vs 1 (Computer)</a>
//               </li>
//               <li class="mb-4">
//                 <a href="/game_remote" class="text-blue-500 hover:underline text-lg">1 vs 1 (Remote)</a>
//               </li>
//             </ul>
//           </div>
//         `;
  
//         // Add event listeners for navigation
//         this.setupNavigation();
//       } catch (error) {
//         console.error('Error rendering game page:', error);
//         this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load game page. Please try again later.</p>`;
//       }
//     }
  
//     private setupNavigation(): void {
//       const links = this.shadowRoot!.querySelectorAll('a');
//       links.forEach((link) => {
//         link.addEventListener('click', (event) => {
//           event.preventDefault();
//           const target = event.target as HTMLAnchorElement;
//           const href = target.getAttribute('href');
//           if (href) {
//             window.history.pushState({}, '', href);
//             (window as any).loadRoute(href); // Call the router's loadRoute function
//           }
//         });
//       });
//     }
//   }
  
//   // Define the custom element
//   customElements.define('custom-game', CustomGame);