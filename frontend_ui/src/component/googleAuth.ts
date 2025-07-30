class GoogleAuth extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = `
            <link href="../dist/output.css" rel="stylesheet">
            <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h2 class="text-2xl font-bold mb-4 text-center">Google Authentication</h2>
                <p class="text-center text-gray-600 mb-4">Redirecting to Google...</p>
            </div>
        `;

        this.redirectToGoogle();
    }

    private redirectToGoogle(): void {
        const clientId = "1067547967742-1bhs7076he7rclnf57eq349vt52n17t9.apps.googleusercontent.com";
        const redirectUri = 'https://localhost/api/auth/google/callback';
        const scope = 'email profile';

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&approval_prompt=force`;
        window.location.href = googleAuthUrl;
    }

}

customElements.define('google-auth', GoogleAuth);