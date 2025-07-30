class customNewPass extends HTMLElement {
	private datatemp : { username: string; firstname: string; lastname: string; phone: string; address: string; password: string; email: string; avatarPath: string } = {
	  username: '',
	  firstname: '',
	  lastname: '',
	  phone: '',
	  address: '',
	  password: '',
	  email: '',
	  avatarPath: '',
	}; 
	
	constructor() {
	  super();
	  this.attachShadow({ mode: 'open' });
	  this.render();
	}
	
	private async fetchUserInfo(): Promise<{ password: string }> {
	  try {
		const response = await fetch('https://localhost/api/userInfo', {
		  method: 'GET',
		  headers: {
			"Authorization": `Bearer ${localStorage.getItem('access_token')}`,
		  },
		});
		if (response.ok) {
		  const data = await response.json();
		  this.datatemp.username = data.user.username;
		  this.datatemp.firstname = data.user.firstname;
		  this.datatemp.lastname = data.user.lastname;
		  this.datatemp.phone = data.user.phone;
		  this.datatemp.address = data.user.address;
		  this.datatemp.password = data.user.password;
		  this.datatemp.email = data.user.email;
		  this.datatemp.avatarPath = data.user.avatarPath;
		  return {
			  password: data.user.password,
		  };
		} else {
		  console.error('Failed to fetch user info');
		  return { password: ''};
		}
	  } catch (error) {
		console.error('Error fetching user info:', error);
		return { password: ''};
	  }
	}
	  
	private async render(): Promise<void> {
	  const { password } = await this.fetchUserInfo();
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
	      		    		<form id="settings-form" class="flex flex-col gap-4 px-4">
	      		    			<input type="password" id="new-password" placeholder="Enter new Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
	      		    			<input type="password" id="confirm-password" placeholder="Confirm new Password" class="px-4 py-3 shadow-lg bg-white bg-opacity-50 text-black font-bold rounded-lg hover:bg-gray-200 hover:bg-opacity-1" required/>
	      		    			<a href="/settings">
								
								</a>
								<button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
	      							Reset Password
	      						</button>
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
  
      this.setupFormListener();
    }
  
private setupFormListener(): void {
	const form = this.shadowRoot!.getElementById('settings-form') as HTMLFormElement;
	
	form.addEventListener('submit', (event) => {
	  event.preventDefault();
	  const newPassWord = this.shadowRoot!.getElementById('new-password') as HTMLInputElement;
	  const confirmPassWord = this.shadowRoot!.getElementById('confirm-password') as HTMLInputElement;
	  if (newPassWord.value !== confirmPassWord.value) {
		alert('Passwords do not match!');
		return;
	  }
	  if (!this.isValidPassword(confirmPassWord.value)) {
		console.log(confirmPassWord.value);
		alert('Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
		return;
	  }


	  const formData = new FormData(form);
	  formData.append('username', this.datatemp.username);
      formData.append('firstname', this.datatemp.firstname);
      formData.append('lastname', this.datatemp.lastname);
      formData.append('phone', this.datatemp.phone);
      formData.append('address', this.datatemp.address);
	  formData.append('password', newPassWord.value);

	  fetch('https://localhost/api/updateSettings', {
		method: 'POST',
		headers: {
		  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
		},
		body: JSON.stringify({
		 "username": formData.get('username'),
          "firstname": formData.get('firstname'),
          "lastname": formData.get('lastname'),
          "phone": formData.get('phone'),
          "address": formData.get('address'),
          "password": formData.get('password'),
          "avatarPath": formData.get('avatarPath'), 
		}),
		credentials: 'include', 
		mode: 'cors', 
	  })
		.then((response) => {
		  if (response.ok) {
			alert('Password Changed successfully!');
			window.history.pushState({}, '', '/');
            (window as any).loadRoute('/');
		  } else {
			alert('Failed to update settings.');
		  }
		})
		.catch((error) => {
		  console.error('Error updating settings:', error);
		  alert('An error occurred while updating settings.');
		});
	});
  }

  private isValidPassword(password: string): boolean {
	// Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number
	return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);
  }
}
customElements.define('custom-new-pass', customNewPass);