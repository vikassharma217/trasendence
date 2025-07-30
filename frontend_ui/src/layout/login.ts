class CustomLogin extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    private render(): void {
      this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">

           <body class="overflow-hidden">
	      	<div class="flex flex-row shrink-0 justify-center items-center bg-[#afd9f2] mix-blend-overlay">
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
	      		<div class="absolute bg-[#121629] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-md hover:shadow-white hover:shadow-md z-[30]">
	      			<h1 class="text-4xl font-bold text-white pb-[20px] break-keep">RETRO GAMER</h1>
	      		  <main class="flex flex-col justify-center">
	            	<div class="flex flex-col gap-4 px-4">
	              		<form class="flex flex-col gap-4 px-4">
	              		  <input type="text" id="username" placeholder="Username" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
	              		  <input type="password" id="password" placeholder="Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
	              		  <button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md">
	            			    Log in
	            		    </button>
	            		    <a id="fa2loqin" id="qr-login-link" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	            		    	Log in with 2FA
	            		    </a>
	            		    <a id="google-auth" id="google-auth-link" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	            		    	Log in with Google
	            		    </a>
	            		    <a id="forget_password" id="forget-password-link" class="text-white text-xs hover:underline">
	            		    	Forgot Password?
	            		    </a>
	            		    <a id="signup" id="register-link" class="text-white text-xs hover:underline">
	            		    	Create Account
	            		    </a>
                      <a id="back" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back</a>
                    </form>
	            	</div>
	            </main>
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
      this.setupListeners();
    }
    
    private setupListeners(): void {
      const form = this.shadowRoot!.querySelector('form')!;
      form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
        const username = (this.shadowRoot!.getElementById('username') as HTMLInputElement).value;
        const password = (this.shadowRoot!.getElementById('password') as HTMLInputElement).value;
          
        try {
          // Send login info to the backend
          const response = await fetch('https://localhost/api/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            mode: 'cors', // Enable CORS
            credentials: 'include', // Include cookies
          });
    
          if (!response.ok) {
            throw new Error('Login failed');
          }
    
          const data = await response.json();
    
          // Save the JWT token to localStorage
          localStorage.setItem('access_token', data.access_token);
          window.dispatchEvent(new Event('auth-changed'));

    
          // Redirect to the home page automatically
          alert('Login successful!');
          window.history.pushState({}, '', '/'); // Update the URL to the home page
          (window as any).loadRoute('/'); // Call the router to load the home page
        } catch (error: any) {
          alert('Invalid username or password');
        }
      });
      this.linkListeners();
    }

    private linkListeners(): void {
      // Only select links inside the login form, not in the footer
      const formLinks = this.shadowRoot!.querySelectorAll('form a');
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

// Define the custom element
customElements.define('custom-login', CustomLogin);