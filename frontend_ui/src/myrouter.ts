import './layout/login.js';
import './layout/home.js';
import './component/fa2login.js';
import './component/reset_password.js';
import './component/forget_password.js';
import './component/register.js';

import './component/googleAuth.js';
import './component/googleCallback.js';
import './layout/settings.js';
import './layout/profile.js';
import './layout/chat.js';
import './layout/society.js';
import './layout/newsPage.js';
import './layout/multy.js';
import './layout/single.js';
import './game/gameBot.js';
import './game/game1v1.js';
import './game/game2v2.js';
import './game/game_remote1v1.js';
import './component/newPass.js';
import './game/game3D.js';
import './game/game3Dinit.js';
import './game/game3DBotinit.js';
import './game/game3DBot.js';
import './game/tour.js';
import './layout/tournament.js';
import './layout/draw.js';
import './temp.js';

class CustomRouter extends HTMLElement {
  private routes: Record<string, { content: string; element?: string }>;

  constructor() {
    super();
    this.routes = {
      '/': { content: '<custom-home></custom-home>' },
      '/1v1': { content: '<custom-1v1></custom-1v1>' },
      '/1v-bot': { content: '<custom-1v-bot></custom-1v-bot>' },
      '/3d': { content: '<custom-3d></custom-3d>' },
      '/3d-bot': { content: '<custom-3d-bot></custom-3d-bot>' },
      '/2v2': { content: '<custom-2v2></custom-2v2>' },
      '/signin': { content: '<custom-login></custom-login>' },
      '/signup': { content: '<custom-register></custom-register>' },
      '/fa2loqin': { content: '<custom-fa2login-email></custom-fa2login-email>' },
      '/resetPass': { content: '<custom-reset-password></custom-reset-password>' },
      '/forget_password': { content: '<custom-forgot-password></custom-forgot-password>' },
      '/google-auth': { content: '<google-auth></google-auth>' },
      '/google-callback': { content: '<google-callback></google-callback>' },
      '/settings': { content: '<custom-settings></custom-settings>' },
      '/profile': { content: '<custom-profile></custom-profile>' },
      '/game_remote': { content: '<custom-game_remote></custom-game_remote>' },
      '/chat': { content: '<custom-chat></custom-chat>' },
      '/society': { content: '<custom-society></custom-society>' },
      '/news': { content: '<custom-news></custom-news>' },
      '/single': { content: '<custom-single></custom-single>' },
      '/multy': { content: '<custom-multy></custom-multy>' },
      '/new-pass': { content: '<custom-new-pass></custom-new-pass>' },
      '/tournament': { content: '<custom-tournament></custom-tournament>' },
      '/draw': { content: '<custom-draw></custom-draw>' },
      '/tour': { content: '<custom-tour></custom-tour>' },
      '/change_avatar': { content: '<test-upload-form></test-upload-form>' },
    };
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.setupListeners();
    this.loadRoute(window.location.pathname);

    // Expose loadRoute globally
    (window as any).loadRoute = this.loadRoute.bind(this);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.pathname);
    });
  }

  private render(): void {
    this.shadowRoot!.innerHTML = `
      <div id="content"></div>
    `;
  }

  private setupListeners(): void {
    const shadowLinks = this.shadowRoot!.querySelectorAll('a');
    shadowLinks.forEach((link) => {
      link.addEventListener('click', (event: Event) => {
        event.preventDefault();
        const target = event.target as HTMLAnchorElement;
        const path = target.getAttribute('href');
        if (path) {
          window.history.pushState({}, '', path);
          this.loadRoute(path);
        }
      });
    });
  }

  private loadRoute(path: string): void {
    const basePath = path.split('?')[0];
    const route = this.routes[basePath];

    const accessToken = localStorage.getItem('access_token');
    const isAuthenticated = !!accessToken;
    const protectedRoutes = [
      '/settings',
      '/profile',
      '/news',
      '/game_remote',
      '/1v1',
      '/1v-bot',
      '/chat',
      '/society',
      '/single',
      '/multy',
      '/tournament',
      '/draw',
      '/tour',
      '/3d',
      '/3d-bot',
      '/2v2',
      '/new-pass',
      '/change_avatar',
    ];
    if (protectedRoutes.includes(basePath) && !isAuthenticated) {
      alert('You must be logged in to access this page.');
      window.history.pushState({}, '', '/signin');
      this.loadRoute('/signin');
      return;
    }

    const contentDiv = this.shadowRoot!.getElementById('content');
    if (contentDiv) {
      if (route) {
        // Clear the content and render only the route-specific element
        contentDiv.innerHTML = route.content;
      } else {
        // Handle 404 - Route not found
        contentDiv.innerHTML = `
          <h2>404 - Page Not Found</h2>
        `;
      }
    }
  }
}

// Define the custom element
customElements.define('custom-router', CustomRouter);

// Add the custom element to the DOM
document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.getElementById('app');
  if (appDiv) {
    const router = document.createElement('custom-router');
    appDiv.appendChild(router);
  }
});