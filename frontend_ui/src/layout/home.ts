import { MessageEvent } from "http";
import { MessagePort } from "worker_threads";

class CustomHome extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // this.handleTokenFromUrl(); // Handle token from URL
        this.render();

        window.addEventListener('auth-changed', () => {
            this.render();
        });
    }
    // private handleTokenFromUrl(): void {
    //     const params = new URLSearchParams(window.location.search);
    //     const token = params.get('token');
    //     console.log('Token from URL:', token);

    //     if (token) {
    //         // Save the token to localStorage
    //         localStorage.setItem('access_token', token);

    //         // Remove the token from the URL
    //         window.history.replaceState({}, document.title, '/');
    //     }
    // }

    private async render(): Promise<void> {
        const accessToken = localStorage.getItem('access_token');
        let isAuthenticated = false;

        if (accessToken) {
            try {
                // Validate the token with the backend
                // console.log('Validating token:', accessToken);
                const response = await fetch('https://localhost/api/validate-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include', 
                    mode: 'cors',
                });

                if (response.ok) {
                    isAuthenticated = true;
                } else {
                    localStorage.removeItem('access_token'); // Remove invalid token
                }
            } catch (error) {
                localStorage.removeItem('access_token'); // Remove token on error
            }
        }

        // Render the navbar based on authentication status
        this.shadowRoot!.innerHTML = `
            <link href="../dist/output.css" rel="stylesheet">
            <body class="overflow-hidden">
	      	<div class="flex flex-row  justify-center items-center bg-[#afd9f2] mix-blend-overlay">
          		<div class="relative w-full h-screen flex justify-end items-center bg-[#232946]/60">
	      			<video
	      			  autoplay
	      			  muted
	      			  loop
	      			  disablepictureinpicture
	      			  aria-hidden="true"
	      			  tabindex="-1"
	      			  class="w-1/4 h-auto object-contain blur-[5.0px] z-[-1]"
	      			>
	      			  <source src="/duck.mp4" type="video/mp4" />
	      			  Your browser does not support the video tag.
	      			</video>
	      		</div>
                  ${
                      isAuthenticated
                      ? `
                      <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md z-[30]">
                          <h1 class="text-4xl font-bold text-white  pb-[20px] break-keep">RETRO GAMER</h1> 
                          <main class="flex flex-col justify-center p">
                            <div id="Link" class="flex flex-col gap-4 px-4">
                                <a id="single" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                    Single Player
                                </a>
                                <a id="multy" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                    Multiplayer
                                </a>
                                <a id="tournament" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                  Tournament
                                </a>
                                <a id="chat" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                  Chat
                                </a>
                                <a id="society" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                  Society
                                </a>
                                 <a id="profile" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                  Profile
                                </a>
                                <div class="flex flex-row justify-center items-center mb-4 gap-6">
                                    <a id="logout-link" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">LogOut</a>
                                    <a id="settings" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Settings</a>
                                </div>
                            </div>
                          </main>
                            `
                            : `
                            <div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md z-[30]">
	      			            <h1 class="text-4xl font-bold text-white pb-[20px] break-keep">RETRO GAMER</h1>
	      			            <main class="flex flex-col justify-center p">
                                    <div class="flex flex-col gap-6">
                                         <div id="Link" class="flex flex-col gap-4 px-4">
                                             <a id="signup" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                                 Sign up
                                             </a>
                                             <a id="signin" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                                               Log in
                                             </a>
                                         </div>
                                    </div>
                                </main>
                            `
                        }
	      		</div>
	      		<footer class="absolute bottom-0 w-full text-center text-[#b8c1ec] font-mono text-sm">
                  <ul class="text-xs">Creators</ul>
                  <div class="flex justify-center gap-2">
                      <a href="https://github.com/wudye" class="hover:text-[#fffffe] transition">mwu |</a>
                      <a href="https://github.com/vikassharma217" class="hover:text-[#fffffe] transition">vsharma |</a>
                      <a href="https://github.com/GGwagons" class="hover:text-[#fffffe] transition">miturk</a>
                  </div>
            </footer>
	      	</div>
	      </body>
        `;
        this.linkListeners();
        if (isAuthenticated) {
            this.setupLogoutListener();
        }
    }

    private setupLogoutListener(): void {
        const logoutLink = this.shadowRoot!.getElementById('logout-link');
       
        if (logoutLink) {
            logoutLink.addEventListener('click', async (event: Event) => {
                event.preventDefault();
    
                try {
                    // Send logout request to the backend
                    const response = await fetch('https://localhost/api/logout', {
                        method: 'GET',
                        credentials: 'include', // Include cookies if needed
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });
    
                    if (response.ok) {
                        localStorage.removeItem('access_token');
                        alert('You have been logged out.');
    
                        window.dispatchEvent(new Event('auth-changed'));
    
                        window.history.pushState({}, '', '/');
                        (window as any).loadRoute('/');
                    } else {
                        alert('Failed to log out. Please try again.');
                    }
                } catch (error) {
                    alert('An error occurred while logging out. Please try again.');
                }
            });
        }
    }

    private linkListeners(): void {
         const otherLinks = this.shadowRoot!.querySelectorAll('#Link a');
         if(otherLinks) {
            otherLinks.forEach((link) => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const href = "/" + (link as HTMLAnchorElement).getAttribute('id');
                    if (href === '/logout-link') {
                        return;
                    }
                    if (href) {
                        window.history.pushState({}, '', href);
                        (window as any).loadRoute(href);
                    }
                });
            })
        }
    }
}


customElements.define('custom-home', CustomHome);