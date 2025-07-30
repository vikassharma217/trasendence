import fetch from 'node-fetch';

interface GoogleOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export class GoogleOAuth {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;

    constructor(config: GoogleOAuthConfig) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = config.redirectUri;
    }

    // Generate the Google authorization URL
    public generateAuthUrl(scope: string[]): string {
        const baseUrl = 'https://accounts.google.com/o/oauth2/auth';
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: scope.join(' '),
            access_type: 'offline',
            approval_prompt: 'force',
        });

        return `${baseUrl}?${params.toString()}`;
    }

    // Exchange authorization code for access token
    public async getAccessToken(code: string): Promise<string> {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to exchange authorization code:', errorText);
            throw new Error('Failed to exchange authorization code for access token');
        }

        const tokenData = await response.json();
        return tokenData.access_token;
    }

    // Fetch user info using the access token
    public async getUserInfo(accessToken: string): Promise<{ email: string; name: string }> {
        const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        const response = await fetch(userInfoUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch user info:', errorText);
            throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json();
        return { email: userInfo.email, name: userInfo.name };
    }
}