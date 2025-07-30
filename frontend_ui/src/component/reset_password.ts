class ResetPassword extends HTMLElement {
    email: string | null = null;
    
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.extractEmailFromURL();
      this.render();
    }
    private extractEmailFromURL(): void {
      const urlParams = new URLSearchParams(window.location.search);
      this.email = urlParams.get('email');
      console.log('Extracted email:', this.email);
      if (!this.email) {
        alert('Invalid email address. Please try again.');
        window.history.pushState({}, '', '/forget-password'); // Redirect to forget password page
        (window as any).loadRoute('/forget-password');
      }
    }
    
    private withoutEmail(): void {
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
	      			<main class="flex flex-col justify-center p">
	      				<div class="flex flex-col gap-4 px-4">
	      		    		<form  id="reset-password-form" action="indexLog.html" method="get" class="flex flex-col gap-4 px-4">
	      		    			<input type="password" id="new-password" placeholder="Enter new Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1"/>
	      		    			<input type="password" id="confirm-password" placeholder="Confirm new Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1"/>
	      		    		<button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	      						  Reset Password
	      					  </button>
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

      console.log('Setting up listeners for reset password form');
      const form = this.shadowRoot!.querySelector('#reset-password-form')!;
      form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
  
        const newPassword = (this.shadowRoot!.getElementById('new-password') as HTMLInputElement).value;
        const confirmPassword = (this.shadowRoot!.getElementById('confirm-password') as HTMLInputElement).value;
  
        // Validate password rules
        if (!this.isValidPassword(newPassword)) {
          alert('Password must be 8-16 characters long, contain both letters and numbers, and include at least one uppercase letter.');
          return;
        }
  
        // Check if passwords match
        if (newPassword !== confirmPassword) {
          alert('Passwords do not match. Please try again.');
          return;
        }
        console.log(' debug  New password:', newPassword);
  
        try {
          // Send the new password to the backend
          const response = await fetch('https://localhost/api/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: this.email, password: newPassword }),
          });
          console.log('Request sent to change password:', {email: this.email, password: newPassword });

          console.log('Response:', response);
  
          if (!response.ok) {
            throw new Error('Failed to reset password');
          }
  
          alert('Password reset successful!');
          window.history.pushState({}, '', '/'); // Redirect to login page
          (window as any).loadRoute('/');
        } catch (error: any) {
          alert('Failed to reset password. Please try again.');
        }
      });
    }
  
    private isValidPassword(password: string): boolean {
      // Password must be 8-16 characters long, contain both letters and numbers, and include at least one uppercase letter
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
      return passwordRegex.test(password);
    }
  }
  
  // Define the custom element
  customElements.define('custom-reset-password', ResetPassword);