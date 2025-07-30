export function renderMessagesPage(socket: WebSocket): void {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');

  const container = document.getElementById('messages-container')!;
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Received Messages</h2>
    <ul class="list-none">
      ${messages
        .map(
          (message: { from: string }) => `
        <li class="mb-4 p-4 border border-gray-300 rounded-lg">
          <p><strong>From:</strong> ${message.from}</p>
          <button class="accept-btn bg-green-500 text-white px-4 py-2 rounded" data-from="${message.from}">Accept</button>
          <button class="refuse-btn bg-red-500 text-white px-4 py-2 rounded" data-from="${message.from}">Refuse</button>
        </li>
      `
        )
        .join('')}
    </ul>
  `;

  const acceptButtons = container.querySelectorAll('.accept-btn');
  const refuseButtons = container.querySelectorAll('.refuse-btn');

  acceptButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      const from = target.dataset.from!;

      socket.send(
        JSON.stringify({
          type: 'invitation-response',
          payload: { from, status: 'accepted' },
        })
      );

      window.history.pushState({}, '', '/3dGame');
      (window as any).loadRoute('/3dGame');
    });
  });

  refuseButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      const from = target.dataset.from!;

      socket.send(
        JSON.stringify({
          type: 'invitation-response',
          payload: { from, status: 'refused' },
        })
      );

      alert(`You refused the invitation from ${from}.`);
    });
  });
}