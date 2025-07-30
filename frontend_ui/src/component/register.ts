class RegisterForm extends HTMLElement {
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
              	<form class="flex flex-col gap-4 px-4" id="register-form">
                  <input type="email" id="email" name="email" placeholder="Email" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
                  <input type="username" id="username" name="username" placeholder="Username" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
                  <input type="password" id="password" name="password" placeholder="Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
                  <input type="password" id="confirm-password" name="confirmPassword" placeholder="Confirm Password" class="px-4 py-3 bg-white shadow-lg bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
                  <button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                    Sign up
          	    	</button>
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
      this.linkListeners();
      const form = this.shadowRoot!.querySelector('#register-form')!;
      form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
  
        const username = (this.shadowRoot!.getElementById('username') as HTMLInputElement).value;
        const email = (this.shadowRoot!.getElementById('email') as HTMLInputElement).value;
        const password = (this.shadowRoot!.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (this.shadowRoot!.getElementById('confirm-password') as HTMLInputElement).value;
  
        // Validate username 
        if (!this.isValidUsername(username)) {
          alert('Username must be 3-16 characters long and no special char.');
          return;
        }
  
        // Validate email
        if (!this.isValidEmail(email)) {
          alert('Email must be 8-100 characters long and in the format user@example.com.');
          return;
        }
  
        // Validate password
        if (!this.isValidPassword(password)) {
          alert('Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, one number and no special char.');
          return;
        }
  
        // Check if passwords match
        if (password !== confirmPassword) {
          alert('Passwords do not match. Please try again.');
          return;
        }
  
        try {
          const avatar = 'df.jpeg';
          // Send the registration data to the backend
          const response = await fetch('https://localhost/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, avatar }),
          });
  
          if (!response.ok) {
            throw new Error('Registration failed');
          }
  
          alert('Registration successful! Redirecting to signin...');
          window.history.pushState({}, '', '/signin');
          (window as any).loadRoute('/signin');
        } catch (error: any) {
          alert('Registration failed. Please try again.');
        }
      });
    }
  
    private isValidUsername(username: string): boolean {
      // Username must be 3-16 characters long
      return /^[a-zA-Z0-9]{3,16}$/.test(username);
    }
  
    private isValidEmail(email: string): boolean {
      // Email must be 8-100 characters long and match the format user@example.com
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length >= 8 && email.length <= 100;
    }
  
    private isValidPassword(password: string): boolean {
      // Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number
      return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);
    }

    private linkListeners(): void {
     const formLinks = this.shadowRoot!.querySelectorAll('#register-form a');
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
  customElements.define('custom-register', RegisterForm);