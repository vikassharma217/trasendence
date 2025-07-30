import { renderMessagesPage } from './receive_message';

export function setupMessagesPage(socket: WebSocket): void {
  // Set up the HTML structure for the messages page
  document.body.innerHTML = `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Messages</h1>
      <div id="messages-container"></div>
    </div>
  `;

  // Call the function to render the messages
  renderMessagesPage(socket);
}