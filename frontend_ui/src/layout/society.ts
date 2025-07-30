class Society extends HTMLElement {
    private currentUser: string = '';
    private onlineUsers: { username: string; avatarPath: string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[] = [];
    private friends: { username: string; avatarPath: string;  status:string; winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }[] = [];
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
  
        await this.fetchData();
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
  
    private async fetchData(): Promise<void> {
      // Fetch online users
      const onlineUsersResponse = await fetch('https://localhost/api/online-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!onlineUsersResponse.ok) {
        throw new Error('Failed to fetch online users');
      }
  
      const users = await onlineUsersResponse.json();
      const myonlineUsers = users.map((user: { userInfo: { username: string; avatarPath: string }; gameInformation: { winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number } }) => ({
        username: user.userInfo.username,
        profile: user.userInfo.avatarPath,
        winTimes: user.gameInformation.winTimes,
        loseTimes: user.gameInformation.loseTimes,
        drawTimes: user.gameInformation.drawTimes,
        totalTimes: user.gameInformation.totalTimes,
      }));
  
  
  
      this.onlineUsers = myonlineUsers.filter((user: { username: string }) => user.username !== this.currentUser); 
  
      // Fetch friends
      const friendsResponse = await fetch('https://localhost/api/friends', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!friendsResponse.ok) {
        throw new Error('Failed to fetch friends');
      }
  
      const friends = await friendsResponse.json();
      this.friends = friends.map((friend: { friendInfo: { username: string; avatarPath: string; status: string }; gameInformation: { winTimes: number; loseTimes: number; drawTimes: number; totalTimes: number }}) => ({
        username: friend.friendInfo.username,
        avatarPath: friend.friendInfo.avatarPath,
        status: friend.friendInfo.status,
        winTimes: friend.gameInformation.winTimes,
        loseTimes: friend.gameInformation.loseTimes,
        drawTimes: friend.gameInformation.drawTimes,
        totalTimes: friend.gameInformation.totalTimes,
    
      }));
      
    }
    private render(): void {


  
        this.shadowRoot!.innerHTML = `
      <link href="../dist/output.css" rel="stylesheet">
      <div class="flex flex-col justify-center items-center p-6 bg-[#232946] min-h-screen text-[#fffffe]">
        <h2 class="text-4xl font-bold mb-6 text-center text-[#ff8906]">Game Remote</h2>
        
        <!-- Table 1: Online Users -->
        <h3 class="text-2xl font-bold mb-4 text-center text-[#ff8906]">Online Users</h3>
        <table class="table-auto w-80% border-collapse border border-[#eebbc3] text-[#fffffe]">
          <thead>
            <tr class="bg-[#232946]">
              <th class="border border-[#eebbc3] px-4 py-2">Username</th>
              <th class="border border-[#eebbc3] px-4 py-2">Win Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Lose Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Draw Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Total Games</th>
              <th class="border border-[#eebbc3] px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.onlineUsers
              .map(
           

                (user) => `
                <tr class="hover:bg-[#393e5f]/50">
                  <td class="border border-[#eebbc3] px-4 py-2">${user.username}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.winTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.loseTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.drawTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.totalTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2 text-center">
                    <button class="add-friend-btn bg-[#00b894] text-[#fffffe] px-4 py-2 font-bold rounded hover:bg-[#009874] hover:shadow-md transition-all" data-username="${user.username}">Add Friend</button>
                  </td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
        
        <!-- Table 2: Friends -->
        <h3 class="text-2xl font-bold mt-8 mb-4 text-center text-[#ff8906]">Friends</h3>
        <table class="table-auto justify-cneter w-80% border-collapse border border-[#eebbc3] text-[#fffffe]">
          <thead>
            <tr class="bg-[#232946]">
              <th class="border border-[#eebbc3] px-4 py-2">Username</th>
              <th class="border border-[#eebbc3] px-4 py-2">Avatar</th>
              <th class="border border-[#eebbc3] px-4 py-2">Win Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Lose Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Draw Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Total Games</th>
            </tr>
          </thead>
          <tbody>
          ${this.friends
          .map((friend) => {
            // Check if avatarPath is the default path
            let fileUrl = '/df.jpeg';
            if (friend.avatarPath && friend.avatarPath !== '/public/df.jpeg') {
              fileUrl = `https://localhost/api${friend.avatarPath}`;
            }
      

        return `
          <tr class="hover:bg-[#393e5f]/50">
            <td class="border border-[#eebbc3] px-4 py-2">${friend.username}</td>
            <td class="border border-[#eebbc3] px-4 py-2">
              <img src="${fileUrl}" alt="Avatar" class="w-8 h-8 rounded-full border border-[#eebbc3]" />
            </td>
            <td class="border border-[#eebbc3] px-4 py-2">${friend.winTimes}</td>
            <td class="border border-[#eebbc3] px-4 py-2">${friend.loseTimes}</td>
            <td class="border border-[#eebbc3] px-4 py-2">${friend.drawTimes}</td>
            <td class="border border-[#eebbc3] px-4 py-2">${friend.totalTimes}</td>
          </tr>
        `;
      })
      .join('')}
  </tbody>
        </table>
        <div id="Head" class="flex flex-row justify-center items-center mb-4 gap-6 pt-10">
            <a id="back" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Home</a>
            <a id="settings" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Settings</a>
        </div>
      </div>
    `;
        this.linkListeners();
        this.setupListeners();
    }


    private setupListeners(): void {
        const inviteButtons = this.shadowRoot!.querySelectorAll('.invite-btn');
        const addFriendButtons = this.shadowRoot!.querySelectorAll('.add-friend-btn');
        const seeProfileButtons = this.shadowRoot!.querySelectorAll('.see-profile-btn');
      
        const disableButton = (button: HTMLButtonElement) => {
          button.disabled = true; // Disable the button
          button.classList.remove('bg-blue-500', 'bg-gray-500', 'bg-green-500'); // Remove existing background classes
          button.classList.add('bg-green-500', 'cursor-not-allowed'); // Add green background and disable cursor
          button.textContent = 'Done'; // Optionally change the button text
        };
      
        inviteButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            const username = target.dataset.username!;
            alert(`Invitation sent to ${username}`);
            disableButton(target); // Disable the button after clicking
          });
        });
      
        addFriendButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const target = event.target as HTMLButtonElement;
            const username = target.dataset.username!;
            alert(`Friend request sent to ${username}`);
        
            // Send the friend request to the backend
            await fetch('https://localhost/api/send-friend-request', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify({from:this.currentUser,  to: username }),
            });
        
            disableButton(target); // Disable the button after clicking
          });
        });
        seeProfileButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            const username = target.dataset.username!;
            alert(`Viewing profile of ${username}`);
            disableButton(target); // Disable the button after clicking
          });
        });
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
  
  customElements.define('custom-society', Society);