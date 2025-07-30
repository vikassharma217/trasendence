interface OnlineUser {
  username: string;
  profile: string;
  winTimes: number;
  loseTimes: number;
  drawTimes: number;
  totalTimes: number;
}

class CustomChat extends HTMLElement {
  private socket: WebSocket | null = null;
  private currentUser: string = "";
  private onlineUsers: OnlineUser[] = [];
  private chatPartner: string = "";

  // initialization
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.initialize();
  }

  // Initialize the chat component
  // Fetch current user and online users from the server
  private async initialize(): Promise<void> {
    try {
      const userInfo = await this.fetchCurrentUser();
      this.currentUser = userInfo.username;
      this.onlineUsers = await this.fetchOnlineUsers();
      this.connectWebSocket();
      this.render();
    } catch (error) {
      console.error("Error initializing chat:", error);
      this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to initialize chat. Please try again later.</p>`;
    }
  }
  
  // Fetch the current user information from the backend API
  private async fetchCurrentUser(): Promise<{ username: string }> {
    const response = await fetch("https://localhost/api/userInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }
    const user = await response.json();
    return { username: user.user.username };
  }

  private async fetchOnlineUsers(): Promise<{
      username: string;
      profile: string;
      winTimes: number;
      loseTimes: number;
      drawTimes: number;
      totalTimes: number;
    }[]> {
    const response = await fetch("https://localhost/api/online-users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch online users");
    }
    const users = await response.json();
    const newUsers = users.map(
      (user: {
        userInfo: { username: string; avatarPath: string };
        gameInformation: {
          winTimes: number;
          loseTimes: number;
          drawTimes: number;
          totalTimes: number;
        };
      }) => ({
        username: user.userInfo.username,
        profile: user.userInfo.avatarPath,
        winTimes: user.gameInformation.winTimes,
        loseTimes: user.gameInformation.loseTimes,
        drawTimes: user.gameInformation.drawTimes,
        totalTimes: user.gameInformation.totalTimes,
      })
    );
    return newUsers.filter(
      (user: { username: string }) => user.username !== this.currentUser
    );
  }

  // Connect the frontend to the WebSocket server
  private connectWebSocket(): void {
    const token = localStorage.getItem("access_token");
    // create a new WebSocket connection with the current user and token
    this.socket = new WebSocket(
      `wss://localhost/api/ws?username=${this.currentUser}&token=${token}`
    );
    // eent: websocket connection is open
    this.socket.onopen = () => {
      //   this.socket!.send(
      //     JSON.stringify({
      //         type: 'chat-message',
      //         payload: { from: this.currentUser , message: `${this.currentUser} say hi to everyone` },
      //     })
      // );
    };
    // event: incoming messages from the server
    this.socket.onmessage = (event) => {
      //Parse the JSON string to an object
      const data = JSON.parse(event.data);
      //public message
      if (data.type === "chat-message-all") {
        // validation check for tournament message
        // if (data.payload.message.includes("has joined the chat")) {
        //    return; // Do not forward or display
        // }
        this.chatPartner = data.payload.to;
        console.log("chat-message all", this.currentUser, this.chatPartner);
        // respond back to the sender to open a private chat
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                from: this.currentUser,
                to: this.chatPartner,
                message: data.payload.message,
              },
            })
          );
        }
        console.log("chat-message all2", this.currentUser, this.chatPartner);
        this.displayMessage(data.payload.message, data.payload.from);
      }
      // private handshake message to establish a private chat 
      else if (data.type === "chat") { 
        this.chatPartner = data.payload.from;
        this.displayMessage(data.payload.message, data.payload.from);
      }
      // private message from the chat partner 
      else if (data.type === "chat-message" && data.payload.from === this.chatPartner) {
        this.chatPartner = data.payload.from;
        console.log("chat-message", this.currentUser, this.chatPartner);
        this.displayMessage(data.payload.message, data.payload.from);
      }
      // invite message to play a game 
      else if (data.type === "invite") {
        console.log(data.payload);
        this.chatPartner = data.payload.from;
        this.showInvitationChoice(`You have been invited to play a game by ${data.payload.from}.`,data.payload.from);
      }
      // invitation accepted: redirect to the game page 
      else if (data.type === "accept-invite" && data.payload.from === this.chatPartner) {
        console.log(`Invitation accepted by ${data.payload.from}`);
        this.chatPartner = data.payload.from;
        window.location.href = `/game_remote?player1=${this.currentUser}&player2=${this.chatPartner}`;
      }
    };

    // event: websocket connection is closed
    this.socket.onclose = () => {
      console.error("WebSocket connection closed");
    };

    // event: websocket error
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  // Render the chat component 
  private render(): void {
    this.shadowRoot!.innerHTML = `
      <link href="../dist/output.css" rel="stylesheet">
      <div class="p-6 bg-[#232946] min-h-screen text-[#fffffe]">
        <h2 class="text-4xl font-bold mb-6 text-center text-[#ff8906]">Chat with ${
          this.chatPartner || "..."
        }</h2>
        <div class="flex flex-row justify-left items-center gap-4 py-4 pr-10">
          <input id="username-input2" type="text" class="w-50% p-2 border border-[#eebbc3] rounded bg-[#232946] text-[#fffffe] placeholder-[#b8c1ec]" placeholder="Enter username" />
          <button id="invite-button" class="px-4 py-2 bg-[#ff8906] text-[#fffffe] font-bold rounded hover:bg-[#ff6600] hover:shadow-md transition-all">Invite</button>
        </div>
        <div id="chat-board" class="p-4 bg-[#121629] border border-[#eebbc3] rounded-lg h-96 overflow-y-auto shadow-lg">
          <!-- Messages will be dynamically added here -->
        </div>
      <tbody>
        <div class="mt-6">
        <div class="flex flex-col justify-items-center w-full border-collapse border border-[#eebbc3] rounded-lg text-[#fffffe]">
          <div>
              <div class="flex flex-row justify-between items-center gap-4 px-4 py-4 p-10">
                <input id="username-input" type="text" class="w-20% p-2 border border-[#eebbc3] rounded bg-[#232946] text-[#fffffe] placeholder-[#b8c1ec]" placeholder="Enter username" />
                <input id="message-input" type="text" class="w-full p-2 border border-[#eebbc3] rounded bg-[#232946] text-[#fffffe] placeholder-[#b8c1ec]" placeholder="Enter message" />
                <button id="send-button" class=" px-4 py-2 bg-[#ff8906] text-[#fffffe] font-bold rounded hover:bg-[#ff6600] hover:shadow-md transition-all">Send</button>
                <button id="block-button" class="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 hover:shadow-md transition-all">Block</button>
                </div>
            </div>
          </div>
        </div>
      </tbody>
        <h3 class="text-2xl font-bold mt-8 mb-4 text-center text-[#ff8906]">Online Users</h3>
        <table class="table-auto w-full border-collapse border border-[#eebbc3] text-[#fffffe]">
          <thead>
            <tr class="bg-[#232946]">
              <th class="border border-[#eebbc3] px-4 py-2">Username</th>
              <th class="border border-[#eebbc3] px-4 py-2">Profile</th>
              <th class="border border-[#eebbc3] px-4 py-2">Win Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Lose Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Draw Times</th>
              <th class="border border-[#eebbc3] px-4 py-2">Total Games</th>
            </tr>
          </thead>
          <tbody>
            ${this.onlineUsers
              .map(


                (user) => {
                  let fileUrl = '/df.jpeg';
                  if (user.profile && user.profile !== '/public/df.jpeg') {
                    fileUrl = `https://localhost/api${user.profile}`;
                  }
                  console.log("fileUrl", fileUrl, user.profile);
            
                  return `
                <tr class="hover:bg-[#393e5f]/50">
                  <td class="border border-[#eebbc3] px-4 py-2">${user.username}</td>
                  <td class="border border-[#eebbc3] px-4 py-2"><img src="${fileUrl}" alt="Avatar" class="w-8 h-8 rounded-full border border-[#eebbc3]" /></td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.winTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.loseTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.drawTimes}</td>
                  <td class="border border-[#eebbc3] px-4 py-2">${user.totalTimes}</td>
                </tr>
              `}
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    this.setupListeners();
  }

  connectedCallback(): void {
    this.render();
    this.setupListeners();
  }
  
  // Check if the username is valid: not empty, not current user, should be online users
  private isValidUsername(username: string): boolean {
    if (!username) {
      return true;
    }
    if (username === this.currentUser) {
      return false;
    }
    return this.onlineUsers.map((user) => user.username).includes(username);
  }

  // Set up event listeners for buttons and inputs
  private setupListeners(): void {
    const sendButton = this.shadowRoot!.querySelector("#send-button") as HTMLButtonElement;
    const inviteButton = this.shadowRoot!.querySelector("#invite-button") as HTMLButtonElement;
    const blockButton = this.shadowRoot!.querySelector("#block-button") as HTMLButtonElement;
    const usernameInput = this.shadowRoot!.querySelector("#username-input") as HTMLInputElement;
    const usernameInput2 = this.shadowRoot!.querySelector("#username-input2") as HTMLInputElement;
    const messageInput = this.shadowRoot!.querySelector("#message-input") as HTMLInputElement;

    // Block user button listener
    blockButton.addEventListener("click", async () => {
      const usernameToBlock = usernameInput.value.trim();
      // validation checks before blocking a user
      if (!usernameToBlock) {
        alert("Enter a username to block.");
        return;
      }
      if (usernameToBlock === this.currentUser.trim()) {
        alert("You cannot block yourself.");
        return;
      }
      try {
        // fetch the email of the user to block
        const emailResponse = await fetch(`https://localhost/api/get-email/${usernameToBlock}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
        // check if the response is ok othrwise throw an error  
        if (!emailResponse.ok) throw new Error("Failed to fetch user email");
        const { email: blockedEmail } = await emailResponse.json();

        // Get current user's email
        const userResponse = await fetch("https://localhost/api/userInfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // check if the response is ok othrwise throw an error
        if (!userResponse.ok) throw new Error("Failed to fetch user info");
        const userInfo = await userResponse.json();
        const blockerEmail = userInfo.user.email;

        // Send a POST request  to backend with emails to save the block information
        const response = await fetch("https://localhost/api/block-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            blockerEmail,
            blockedEmail,
          }),
        });

        // check if the response is ok othrwise throw an error
        if (!response.ok) throw new Error("Failed to block user");
        alert(`${usernameToBlock} has been blocked.`);
      } catch (error) {
        console.error("Block request failed:", error);
        alert("Could not block user. Please try again.");
      }
    });
    
    // Send message button listener
    sendButton.addEventListener("click", () => {
      this.chatPartner = usernameInput.value.trim();
      const message = messageInput.value.trim();
      
      // validation checks before sending a message
      if (!this.isValidUsername(this.chatPartner)) {
        alert("Please enter a valid username before sending a message.");
        return;
      }
      if (!message) {
        alert("Please enter a message before sending.");
        return;
      }
      // send message, if the socket is connected
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: "chat-message",
            payload: { from: this.currentUser, to: this.chatPartner, message },
          })
        );
        // display own message in the chat board
        this.displayMessage(message, this.currentUser);
        // clear the input fields after sending the message
        usernameInput.value = "";
        messageInput.value = "";
      }
    });

    // Invite button listener
    inviteButton.addEventListener("click", () => {
      this.chatPartner = usernameInput2.value.trim();
      // validation checks before sending an invite
      if (!this.chatPartner) {
        alert("Please enter a username before sending an invite.");
        return;
      }
      if (!this.isValidUsername(this.chatPartner)) {
        alert("Please enter a valid username before sending a message.");
        return;
      }
      if (this.chatPartner === this.currentUser) {
        alert("You cannot invite yourself.");
        return;
      }
      // send invite message to backend using websocket
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: "invite",
            payload: { from: this.currentUser, to: this.chatPartner },
          })
        );
        // display the invite message locally 
        this.displayMessage(
          `You invited ${this.chatPartner} to play a game.`,
          this.currentUser
        );
        // clear the input field after sending the invite
        usernameInput.value = "";
      }
    });
  }

  // Display a message in the chat board
  private displayMessage(message: string, sender: string): void {
    const chatBoard = this.shadowRoot!.querySelector("#chat-board") as HTMLDivElement;
    const messageElement = document.createElement("p");
    messageElement.classList.add("mb-2", "p-2", "rounded", "text-white");
    // set tag got public(GEN) or private(PRI) message
    let tag = "GEN"; // default to global message
    if (sender === this.currentUser || sender === this.chatPartner) {
      tag = "PRI";
    }
    messageElement.textContent = `${sender} (${tag}): ${message}`;
    if (sender === this.currentUser) {
      messageElement.classList.add("bg-green-800", "text-right", "font-bold");
    } else {
      messageElement.classList.add("bg-gray-500", "text-left", "font-bold");
    }
    if (tag === "PRI") {
      messageElement.classList.add("border", "border-blue-400", "border-bold");
    }
    chatBoard.appendChild(messageElement);
    chatBoard.scrollTop = chatBoard.scrollHeight;
  }

  // Show invitation choice:  accept or decline
  private showInvitationChoice(message: string, sender: string): void {
    const chatBoard = this.shadowRoot!.querySelector("#chat-board") as HTMLDivElement;
    const invitationContainer = document.createElement("div");
    invitationContainer.classList.add("mb-4", "p-2", "rounded", "bg-gray-400");
    const messageElement = document.createElement("p");
    messageElement.classList.add("mb-2", "text-black", "font-bold");
    messageElement.textContent = `${sender}: ${message}`;
    invitationContainer.appendChild(messageElement);
    
    // Create accept button
    const acceptButton = document.createElement("button");
    acceptButton.classList.add("bg-green-500","text-white","px-4","py-2","rounded","mr-2", "font-bold");
    acceptButton.textContent = "Accept";

    // Event listener for accept button: redirect to game page
    acceptButton.addEventListener("click", () => {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: "accept-invite",
            payload: { from: this.currentUser, to: sender },
          })
        );
      }
      window.location.href = `/game_remote?player1=${this.currentUser}&player2=${sender}`;
    });

    // Create decline button
    const declineButton = document.createElement("button");
    const declineMessage = "you have been decline by" + this.currentUser;
    declineButton.classList.add("bg-red-500","text-white","px-4","py-2","rounded", "font-bold");
    declineButton.textContent = "Decline";
    
    // event listener for decline button: send decline message and remove invitation
    declineButton.addEventListener("click", () => {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: "chat-message",
            payload: { from: this.currentUser, to: sender, message: declineMessage },
          })
        );
      }
      alert("You decline the invitation.");
      invitationContainer.remove();
    });
    invitationContainer.appendChild(acceptButton);
    invitationContainer.appendChild(declineButton);
    chatBoard.appendChild(invitationContainer);
    chatBoard.scrollTop = chatBoard.scrollHeight;
  }

  // send public message for tournament annocument
  public sendPublicMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "chat-message",
          payload: {
            from: this.currentUser,
            to: "", // Empty string = broadcast
            message: message,
          },
        })
      );
    }
  }
}


customElements.define("custom-chat", CustomChat);
