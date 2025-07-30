class GoogleCallback extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleTokenFromUrl();
  }

    // private  handleTokenFromUrl(): void {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get('token');
    //     console.log('Token from URL:', token);

        
    //     if (token) {

    //         // Save the token to localStorage
    //         localStorage.setItem('access_token', token);
    //         window.dispatchEvent(new Event('auth-changed'));

    //         // Redirect to the home page
    //         if (typeof (window as any).loadRoute === 'function') {
    //             window.history.pushState({}, '', '/'); // Update the URL to the home page
    //             (window as any).loadRoute('/'); // Call the router to load the home page
    //         } else {
    //             console.error('loadRoute is not defined');
    //             // Optionally, redirect manually
    //             window.location.href = '/'; // Fallback to profile page
    //         }
    //     } else {
    //         console.error('No token found in the URL');
    //         // Optionally, redirect to an error page or show an error message
    //     }
    // }

    private handleTokenFromUrl(): void {
        const token = this.extractTokenFromUrl();
        if (token) {
          localStorage.setItem('access_token', token);
          if (typeof (window as any).loadRoute === 'function') {
            (window as any).loadRoute('/');
          } else {
            console.error('loadRoute is not defined');
            window.location.href = '/'; // Fallback to manual redirection
          }
        } else {
          console.error('Token not found in URL');
          this.shadowRoot!.innerHTML = `<p class="text-red-500">Failed to authenticate. Please try again.</p>`;
        }
      }
    
      private extractTokenFromUrl(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');  
      }

}

// Define the custom element
customElements.define('google-callback', GoogleCallback);

