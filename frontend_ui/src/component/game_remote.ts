import { renderMessagesPage } from '../layout/receive_message';


class GameRemote extends HTMLElement {
  private currentUser: string = '';
  private onlineUsers: { username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[] = [];
  private socket: WebSocket | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const userInfo = await this.fetchCurrentUser();
      this.currentUser = userInfo.username;

      this.connectWebSocket();
      this.render();
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
    const token = localStorage.getItem('access_token');
    this.socket = new WebSocket(`wss://localhost/api/ws?username=${this.currentUser}&token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      if (data.type === 'invitation') {
        const { from } = data.payload;
        alert('You have a new message.');
        this.storeMessage(from);
      }
    };

    this.socket.onclose = () => {
      console.error('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private storeMessage(from: string): void {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({ from });
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  private async fetchOnlineUsers(): Promise<{ username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[]> {
    const response = await fetch('https://localhost/api/online-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch online users');
    }

    const users = await response.json();

    const newUsers = users.map((user: { userInfo: { username: string; avatarPath: string }; gameInformation: { winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number } }) => ({
      username: user.userInfo.username,
      profile: user.userInfo.avatarPath,
      winTimes: user.gameInformation.winTimes,
      loseTimes: user.gameInformation.loseTimes,
      drawTimes: user.gameInformation.drawTimes,
      totalTimes: user.gameInformation.totalTimes,
    }));



    return newUsers.filter((user: { username: string }) => user.username !== this.currentUser); // Exclude the current user
  }

  
    

  private async render(): Promise<void> {
    try {
      this.onlineUsers = await this.fetchOnlineUsers();

      this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">
        <div class="p-6 bg-gray-100 min-h-screen z-[30]">
          <h2 class="text-2xl font-bold mb-4 text-center">Online Users</h2>
          <ul class="list-none">
            ${this.onlineUsers
              .map(
                (user) => `
              <li class="mb-4 p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                <div>
                  <p><strong>Username:</strong> ${user.username}</p>
                  <p><strong>Win Times:</strong> ${user.winTimes}</p>
                  <p><strong>Lose Times:</strong> ${user.loseTimes}</p>
                  <p><strong>Draw Times:</strong> ${user.drawTimes}</p>
                  <p><strong>Total Games:</strong> ${user.totalTimes}</p>
                </div>
                <button class="invite-btn bg-blue-500 text-white px-4 py-2 rounded" data-username="${user.username}">
                  Invite
                </button>
              </li>
            `
              )
              .join('')}
          </ul>
        //        <div id="messages-container" class="mt-6 p-4 bg-white border border-gray-300 rounded-lg">
        //   <h3 class="text-xl font-bold mb-4">Messages</h3>
        //   <p>No messages yet.</p>
        // </div>
   
        </div>
      `;

      this.setupListeners();
    } catch (error) {
      console.error('Error rendering game remote page:', error);
      this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load online users. Please try again later.</p>`;
    }
  }

  private setupListeners(): void {
    const inviteButtons = this.shadowRoot!.querySelectorAll('.invite-btn');

    inviteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target as HTMLButtonElement;
        const username = target.dataset.username!;

        // Check if the button is already disabled
        if (target.disabled) {
          alert('You already sent an invitation to this user. Please wait for their response.');
          return;
        }

        // Send the invitation message via WebSocket
        this.socket!.send(
          JSON.stringify({
            type: 'send-invitation',
            payload: { from: this.currentUser, to: username },
          })
        );

        // Disable the button and change its color to gray
        target.disabled = true;
        target.classList.remove('bg-blue-500');
        target.classList.add('bg-gray-500');
        target.textContent = 'Invitation Sent';
      });
    });
  }
}

customElements.define('custom-game-remote', GameRemote);

// class GameRemote extends HTMLElement {
//   private currentUser: string = ''; // Initialize as an empty string
//   private onlineUsers: { username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[] = [];
//   private socket: WebSocket | null = null;

//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//     this.initialize();
//   }

//   private async initialize(): Promise<void> {
//     try {
//       const userInfo = await this.fetchCurrentUser();
//       this.currentUser = userInfo.username;

//       this.connectWebSocket();
//       this.render();
//     } catch (error) {
//       console.error('Error initializing GameRemote:', error);
//       this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to initialize. Please try again later.</p>`;
//     }
//   }

//   private async fetchCurrentUser(): Promise<{ username: string }> {
//     const response = await fetch('https://localhost/api/userInfo', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch current user');
//     }

//     const user = await response.json();
//     return { username: user.user.username };
//   }

//   private connectWebSocket(): void {
//     const token = localStorage.getItem('access_token');
//     this.socket = new WebSocket(`ws://localhost:8080/ws?username=${this.currentUser}&token=${token}`);

//     this.socket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     this.socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log('Received message:', data);

//       if (data.type === 'invitation') {
//         const { from } = data.payload;
//         this.showInvitation(from);
//       } else if (data.type === 'invitation-response') {
//         const { status, from } = data.payload;
//         if (status === 'accepted') {
//           window.history.pushState({}, '', '/3dGame');
//           (window as any).loadRoute('/3dGame');
//         } else if (status === 'refused') {
//           alert(`${from} refused your invitation.`);
//         }
//       }
//     };

//     this.socket.onclose = () => {
//       console.error('WebSocket connection closed');
//     };

//     this.socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }

//   private async fetchOnlineUsers(): Promise<{ username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[]> {
//     const response = await fetch('https://localhost/api/online-users', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch online users');
//     }

//     const users = await response.json();

//     const newUsers = users.map((user: { userInfo: { username: string; avatarPath: string }; gameInformation: { winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number } }) => ({
//       username: user.userInfo.username,
//       profile: user.userInfo.avatarPath,
//       winTimes: user.gameInformation.winTimes,
//       loseTimes: user.gameInformation.loseTimes,
//       drawTimes: user.gameInformation.drawTimes,
//       totalTimes: user.gameInformation.totalTimes,
//     }));



//     return newUsers.filter((user: { username: string }) => user.username !== this.currentUser); // Exclude the current user
//   }

//   private async render(): Promise<void> {
//     try {
//       this.onlineUsers = await this.fetchOnlineUsers();

//       this.shadowRoot!.innerHTML = `
//         <link href="../dist/output.css" rel="stylesheet">
//         <div class="p-6 bg-gray-100 min-h-screen">
//           <h2 class="text-2xl font-bold mb-4 text-center">Online Users</h2>
//           <ul class="list-none">
//             ${this.onlineUsers
//               .map(
//                 (user) => `
//               <li class="mb-4 p-4 border border-gray-300 rounded-lg flex justify-between items-center">
//                 <div>
//                   <p><strong>Username:</strong> ${user.username}</p>
//                   <p><strong>Win Times:</strong> ${user.winTimes}</p>
//                   <p><strong>Lose Times:</strong> ${user.loseTimes}</p>
//                   <p><strong>Draw Times:</strong> ${user.drawTimes}</p>
//                   <p><strong>Total Games:</strong> ${user.totalTimes}</p>
//                 </div>
//                 <button class="invite-btn bg-blue-500 text-white px-4 py-2 rounded" data-username="${user.username}">
//                   Invite
//                 </button>
//               </li>
//             `
//               )
//               .join('')}
//           </ul>
//         </div>
//       `;

//       this.setupListeners();
//     } catch (error) {
//       console.error('Error rendering game remote page:', error);
//       this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load online users. Please try again later.</p>`;
//     }
//   }

//   private setupListeners(): void {
//     const inviteButtons = this.shadowRoot!.querySelectorAll('.invite-btn');

//     inviteButtons.forEach((button) => {
//       button.addEventListener('click', (event) => {
//         const target = event.target as HTMLButtonElement;
//         const username = target.dataset.username!;

//         const confirmationMessage = document.createElement('div');
//         confirmationMessage.innerHTML = `
//           <p>Send invitation to ${username}?</p>
//           <button id="confirm-send" class="bg-green-500 text-white px-4 py-2 rounded">Send</button>
//           <button id="cancel-send" class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
//         `;
//         this.shadowRoot!.appendChild(confirmationMessage);

//         const confirmButton = confirmationMessage.querySelector('#confirm-send')!;
//         const cancelButton = confirmationMessage.querySelector('#cancel-send')!;

//         confirmButton.addEventListener('click', () => {
//           this.socket!.send(
//             JSON.stringify({
//               type: 'send-invitation',
//               payload: { from: this.currentUser, to: username },
//             })
//           );
//           confirmationMessage.remove();
//         });

//         cancelButton.addEventListener('click', () => {
//           confirmationMessage.remove();
//         });
//       });
//     });
//   }

//   private showInvitation(from: string): void {
//     const invitationMessage = document.createElement('div');
//     invitationMessage.innerHTML = `
//       <p>You got an invitation from ${from}</p>
//       <button id="accept-invitation" class="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
//       <button id="refuse-invitation" class="bg-red-500 text-white px-4 py-2 rounded">Refuse</button>
//     `;
//     this.shadowRoot!.appendChild(invitationMessage);

//     const acceptButton = invitationMessage.querySelector('#accept-invitation')!;
//     const refuseButton = invitationMessage.querySelector('#refuse-invitation')!;

//     acceptButton.addEventListener('click', () => {
//       this.socket!.send(
//         JSON.stringify({
//           type: 'invitation-response',
//           payload: { from, status: 'accepted' },
//         })
//       );
//       window.history.pushState({}, '', '/3dGame');
//       (window as any).loadRoute('/3dGame');
//     });

//     refuseButton.addEventListener('click', () => {
//       this.socket!.send(
//         JSON.stringify({
//           type: 'invitation-response',
//           payload: { from, status: 'refused' },
//         })
//       );
//       invitationMessage.remove();
//     });
//   }
// }

// customElements.define('custom-game-remote', GameRemote);




// class GameRemote extends HTMLElement {
//     private currentUser: string = ''; // Initialize as an empty string
//     private onlineUsers: { username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[] = [];
//     private socket: WebSocket | null = null;
  
//     constructor() {
//       super();
//       this.attachShadow({ mode: 'open' });
//       this.initialize();
//     }
  
//     private async initialize(): Promise<void> {
//       try {
//         const userInfo = await this.fetchCurrentUser();
//         this.currentUser = userInfo.username;
  
//         this.connectWebSocket();
//         this.render();
//       } catch (error) {
//         console.error('Error initializing GameRemote:', error);
//         this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to initialize. Please try again later.</p>`;
//       }
//     }
  
//     private async fetchCurrentUser(): Promise<{ username: string }> {
//       const response = await fetch('https://localhost/api/userInfo', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch current user');
//       }
  
//       const user = await response.json();
//       return { username: user.user.username };
//     }
  
//     private connectWebSocket(): void {
//       const token = localStorage.getItem('access_token');
//       this.socket = new WebSocket(`ws://localhost:8080/ws?username=${this.currentUser}&token=${token}`);
  
//       this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log('Received message:', data);
  
//         if (data.type === 'invitation') {
//           const { from } = data.payload;
//           this.showInvitation(from);
//         } else if (data.type === 'invitation-response') {
//           const { status, from } = data.payload;
//           if (status === 'accepted') {
//             window.history.pushState({}, '', '/3dGame');
//             (window as any).loadRoute('/3dGame');
//           } else if (status === 'refused') {
//             alert(`${from} refused your invitation.`);
//           }
//         }
//       };
  
//       this.socket.onclose = () => {
//         console.error('WebSocket connection closed');
//       };
  
//       this.socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };
//     }
  
//     private async fetchOnlineUsers(): Promise<{ username: string; profile: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[]> {
//         const response = await fetch('https://localhost/api/online-users', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//           },
//         });
    
//         if (!response.ok) {
//           throw new Error('Failed to fetch online users');
//         }
      
//         const users = await response.json();
    
//         const newUsers = users.map((user: { userInfo: { username: string; avatarPath: string }; gameInformation: { winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number } }) => ({
//           username: user.userInfo.username,
//           profile: user.userInfo.avatarPath,
//           winTimes: user.gameInformation.winTimes,
//           loseTimes: user.gameInformation.loseTimes,
//           drawTimes: user.gameInformation.drawTimes,
//           totalTimes: user.gameInformation.totalTimes,
//         }));
  
  
    
//         return newUsers.filter((user: { username: string }) => user.username !== this.currentUser); // Exclude the current user
//       }
  
//     private async render(): Promise<void> {
//       try {
//         this.onlineUsers = await this.fetchOnlineUsers();
  
//         this.shadowRoot!.innerHTML = `
//           <link href="../dist/output.css" rel="stylesheet">
//           <div class="p-6 bg-gray-100 min-h-screen">
//             <h2 class="text-2xl font-bold mb-4 text-center">Online Users</h2>
//             <ul class="list-none">
//               ${this.onlineUsers
//                 .map(
//                   (user) => `
//                 <li class="mb-4 p-4 border border-gray-300 rounded-lg flex justify-between items-center">
//                   <div>
//                     <p><strong>Username:</strong> ${user.username}</p>
//                     <p><strong>Win Times:</strong> ${user.winTimes}</p>
//                     <p><strong>Lose Times:</strong> ${user.loseTimes}</p>
//                     <p><strong>Draw Times:</strong> ${user.drawTimes}</p>
//                     <p><strong>Total Games:</strong> ${user.totalTimes}</p>
//                   </div>
//                   <button class="invite-btn bg-blue-500 text-white px-4 py-2 rounded" data-username="${user.username}">
//                     Invite
//                   </button>
//                 </li>
//               `
//                 )
//                 .join('')}
//             </ul>
//           </div>
//         `;
  
//         this.setupListeners();
//       } catch (error) {
//         console.error('Error rendering game remote page:', error);
//         this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to load online users. Please try again later.</p>`;
//       }
//     }
  
//     private setupListeners(): void {
//       const inviteButtons = this.shadowRoot!.querySelectorAll('.invite-btn');
  
//       inviteButtons.forEach((button) => {
//         button.addEventListener('click', (event) => {
//           const target = event.target as HTMLButtonElement;
//           const username = target.dataset.username!;
  
//           this.socket!.send(
//             JSON.stringify({
//               type: 'send-invitation',
//               payload: { from: this.currentUser, to: username },
//             })
//           );
//         });
//       });
//     }
  
//     private showInvitation(from: string): void {
//       const invitationMessage = document.createElement('div');
//       invitationMessage.innerHTML = `
//         <p>You got an invitation from ${from}</p>
//         <button id="accept-invitation" class="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
//         <button id="refuse-invitation" class="bg-red-500 text-white px-4 py-2 rounded">Refuse</button>
//       `;
//       this.shadowRoot!.appendChild(invitationMessage);
  
//       const acceptButton = invitationMessage.querySelector('#accept-invitation')!;
//       const refuseButton = invitationMessage.querySelector('#refuse-invitation')!;
  
//       acceptButton.addEventListener('click', () => {
//         this.socket!.send(
//           JSON.stringify({
//             type: 'invitation-response',
//             payload: { from, status: 'accepted' },
//           })
//         );
//         window.history.pushState({}, '', '/3dGame');
//         (window as any).loadRoute('/3dGame');
//       });
  
//       refuseButton.addEventListener('click', () => {
//         this.socket!.send(
//           JSON.stringify({
//             type: 'invitation-response',
//             payload: { from, status: 'refused' },
//           })
//         );
//         invitationMessage.remove();
//       });
//     }
//   }
  
//   customElements.define('custom-game-remote', GameRemote);






