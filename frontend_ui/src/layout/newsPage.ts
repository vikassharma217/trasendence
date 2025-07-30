interface Message {
    message: string;
    sender: string;
    created_at: string;

  }
  
class NewsPage extends HTMLElement {
    private messageGet: Message[] = [];
    private fiendInfoFlag: boolean = false;
    private currentUser: string = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initialize();
      }

      private async initialize(): Promise<void>{
        const userInfo = await this.fetchCurrentUser();
        this.currentUser = userInfo.username;
        this.handleFriendRequest();

        this.render();



    
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




    private render(): void {
       
      this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 class="text-2xl font-bold mb-4">News Page</h1>
            <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 class="text-xl font-semibold mb-4"> message</h2>
                ${this.fiendInfoFlag ? `
                    ${this.messageGet.map((message, i) => `
                        <p class="text-gray-700 mb-2">Message ${i + 1}: ${message.message} at ${new Date(message.created_at).toLocaleString()} </p>
                    `).join('')}

                ` : `
                    <p class="text-gray-700 mb-2">No new friend requests.</p>
                `}
            </div>
        </div>
      `;
  
      this.setupListeners();
    }
  
    private setupListeners(): void {


   
    }

    private async handleFriendRequest(): Promise<void> {
   
        const fetchResponse = await fetch('https://localhost/api/friend-message', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        if (fetchResponse.ok) {
            const data = await fetchResponse.json();
            if (data.message.length === 0) {
                return;
            }
             this.messageGet = data.message;

          

      

            this.fiendInfoFlag = true;
            this.render();
        }
        else {
            console.log('Failed to fetch friend request');
        }
    }
  
  }
  
  customElements.define('custom-news', NewsPage);