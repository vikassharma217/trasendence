class ForgetPassword extends HTMLElement {

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
	      		  <main class="flex flex-col justify-center">
	            	<div class="flex flex-col gap-4 px-4">
	              	<form class="flex flex-col gap-4 px-4" id="forget-password-form">
	              	  <input type="email" id="email" placeholder="Enter your Email" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
	              	  <button type="button" id="send-code" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md">
	            		    Send Code
	            		  </button>
                    <div id="code-section" class="hidden mt-4">
                    <input
                      type="text"
                      id="token"
                      placeholder="Enter 6-digit code"
                      class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    />
                    <button
                      type="submit"
                      class="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                    >
                      Verify Code
                    </button>
                    </div>
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
      const sendCodeButton = this.shadowRoot!.getElementById('send-code')!;
      const codeSection = this.shadowRoot!.getElementById('code-section')!;
      const form = this.shadowRoot!.querySelector('#forget-password-form')!;
      const emailSection = this.shadowRoot!.getElementById('email')!;
      const tokenInput = this.shadowRoot!.getElementById('token') as HTMLInputElement;
  
      sendCodeButton.addEventListener('click', async () => {
        const email = (this.shadowRoot!.getElementById('email') as HTMLInputElement).value;
  
        if (!email) {
          alert('Please enter your email.');
          return;
        }
  
        try {
          // Send the email to the backend to generate and send the code
          const response = await fetch('https://localhost/api/send-2fa-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to send reset code');
          }
  
          const data = await response.json();
          this.validToken = data.token; 
          this.validTime = new Date().getTime();

          alert('A 6-digit code has been sent to your email.');
          emailSection.classList.add('hidden'); // Hide the email input section
          sendCodeButton.classList.add('hidden'); // Hide the send code button

          codeSection.classList.remove('hidden'); // Show the code input section
        } catch (error: any) {
          alert('Failed to send reset code. Please try again.');
        }
      });
  
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
        this.validTime = 0; 
        this.validToken = ''; 

        try {
          alert('Code verified successfully!');
          const encodedEmail = encodeURIComponent(email); 
          window.history.pushState({}, '', `/resetPass?email=${encodedEmail}`);
          (window as any).loadRoute(`/resetPass?email=${encodedEmail}`);
        } catch (error: any) {
          alert('An error occurred. Please try again.');
        }
      
      });
    }
  }
  
  // Define the custom element
  customElements.define('custom-forgot-password', ForgetPassword);



