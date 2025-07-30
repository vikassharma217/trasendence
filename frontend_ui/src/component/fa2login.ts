class TwoFactorAuthEmail extends HTMLElement {

    validToken: string = '';
    validTime: number = 0;
    tokenValidityDuration :number= 10 * 60 * 1000; // 10 minutes in milliseconds

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
	        	<main class="flex flex-col justify-center p">
	        		<div class="flex flex-col gap-4 px-4">
	            	<form id="fa2-email-form" class="flex flex-col gap-4 px-4">
	            	<input type="email" id="email" placeholder="Enter your email" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1"/>
	            	<button type="submit" id="send-token" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	        			  Send Token
	        			</button>
	        			<div id="token-section" class="hidden mt-4">
	        			  <input type="text" id="token" placeholder="Enter the 6-digit token" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1"/>
	        			  <button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	        			  	Verify Token
	        			  </button>
	        		  </div>
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
      const sendTokenButton = this.shadowRoot!.getElementById('send-token')!;
      const tokenSection = this.shadowRoot!.getElementById('token-section')!;
      const form = this.shadowRoot!.querySelector('#fa2-email-form')!;
      const tokenInput = this.shadowRoot!.getElementById('token') as HTMLInputElement;
      // const emailInput = this.shadowRoot!.getElementById('email') as HTMLInputElement;
    

  
      // Listener for sending the token
      sendTokenButton.addEventListener('click', async () => {
        const email = (this.shadowRoot!.getElementById('email') as HTMLInputElement).value;
  
        if (!email) {
          alert('Please enter your email.');
          return;
        }
  
        try {
          // Send the email to the backend to generate and send the token
          const response = await fetch('https://localhost/api/send-2fa-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
  
          if (!response.ok) {
            alert('Failed to send token');
            return;
          }
          const data = await response.json();
          this.validToken = data.token; 
          this.validTime = new Date().getTime();
 
          

          alert('A 6-digit token has been sent to your email.');
     
        
          sendTokenButton.setAttribute('disabled', ''); // Disable the send token button
          sendTokenButton.classList.add('bg-gray-500', 'cursor-not-allowed'); // Change button style
          tokenSection.classList.remove('hidden'); // Show the token input section
          tokenInput.setAttribute('required', ''); // Add the `required` attribute dynamically

        } catch (error: any) {
          alert('Failed to send token. Please try again.');
    
        }
      });
  
      // Listener for verifying the token
      form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
  
        const email = (this.shadowRoot!.getElementById('email') as HTMLInputElement).value;
        const token = tokenInput.value;
  
        if (!token) {
          alert('Please enter the 6-digit token.');
          return;
        }
        if (token !== this.validToken) {
          alert('Invalid token. Please try again.');
          return;
        }
        const currentTime = new Date().getTime();
     
        if (this.validTime <= 0 || (currentTime - this.validTime) > this.tokenValidityDuration) {
          alert('Token has expired. Please request a new token.');
          return;
        }

        try {
          // Verify the token with the backend
          const response = await fetch('https://localhost/api/verify-2fa-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email}),
          });
  

          if (!response.ok) {
            throw new Error('Invalid token');
          }
          const data = await response.json();
          localStorage.setItem('access_token', data.access_token);

          this.validToken = ''; 
          this.validTime = 0;

          alert('Token verified successfully! Redirecting to home...');
          window.history.pushState({}, '', '/settings');
          (window as any).loadRoute('/settings');
        } catch (error: any) {
          alert('Invalid token. Redirecting to login...');
          window.history.pushState({}, '', '/signin');
          (window as any).loadRoute('/signin');
        }
      });
    }
  }
  
  // Define the custom element
  customElements.define('custom-fa2login-email', TwoFactorAuthEmail);