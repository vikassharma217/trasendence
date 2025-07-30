class CustomSettings extends HTMLElement {
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

  private async fetchUserInfo(): Promise<{ username: string; firstname: string; lastname: string;  phone: string; address: string, avatarPath: string }> {
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
          username: data.user.username,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          phone: data.user.phone,
          address: data.user.address,
          avatarPath: data.user.avatarPath,
        };
      } else {
        console.error('Failed to fetch user info');
        return { username: '', firstname: '', lastname: '',  phone: '', address: '', avatarPath: '' };
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { username: '', firstname: '', lastname: '', phone: '', address: '' , avatarPath: '' };
    }
  }

  private async render(): Promise<void> {
    const { username, firstname, lastname, phone, address, avatarPath } = await this.fetchUserInfo();

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
          <div id="Head" class="absolute bg-[#0c1024] bg-opacity-95 p-10 border-b-[4px] border-[#eebbc3] rounded-3xl shadow-2xl font-mono text-center w-[90%] max-w-4xl hover:shadow-white hover:shadow-md z-[30]">
            <div class="flex flex-row justify-between items-center mb-4">
              <a id="back"><button class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back</button></a>
              <h1 class="text-4xl font-bold text-white break-keep">RETRO GAMER</h1> 
              <a id="profile"><button class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Profile</button></a>
            </div>
            <main class="flex flex-col gap-6 text-white justify-center items-center">
              <form id="settings-form" class="flex flex-col gap-4 px-4 text-white text-left font-mono">
                <div  class="w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4">
                    <div class="flex flex-col">
                      <label for="username" class="text-sm text-white mb-1">Username: ${username}</label>
                      <input type="text" id="username" placeholder="Enter your username" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
                    </div>
                    <div class="flex flex-col">
                      <label for="firstname" class="text-sm text-white mb-1">First Name: ${firstname}</label>
                      <input type="text" id="firstname" placeholder="Enter your first name" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
                    </div>
                    <div class="flex flex-col">
                      <label for="lastname" class="text-sm text-white mb-1">Last Name: ${lastname}</label>
                      <input type="text" id="lastname" placeholder="Enter your last name" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
                    </div>
                    <div class="flex flex-col">
                      <label for="phone" class="text-sm text-white mb-1">Phone: ${phone}</label>
                      <input type="tel" id="phone" placeholder="Enter your phone number" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
                    </div>
                    <div class="flex flex-col">
                      <label for="address" class="text-sm text-white mb-1">Address: ${address}</label>
                      <input type="text" id="address" placeholder="Enter your address" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
                    </div>

                    <div class="flex flex-col justify-between items-center">
                      <a id="change_avatar"><button type="button" class="px-5 py-2 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Change avatar</button></a>
                    </div>

                    <div class="flex flex-col justify-between items-center">
                      <a id="forget_password"><button type="button" class="px-5 py-2 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Change Password</button></a>
                    </div>
                  </div>
                  <button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">Save Settings</button>
              </form>
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
    // const newPasswordInput = this.shadowRoot!.getElementById('new-password') as HTMLInputElement;
    // const confirmPasswordInput = this.shadowRoot!.getElementById('confirm-password') as HTMLInputElement;
  
    
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = (this.shadowRoot!.getElementById('username') as HTMLInputElement).value;
      const firstname = (this.shadowRoot!.getElementById('firstname') as HTMLInputElement).value;
      const lastname = (this.shadowRoot!.getElementById('lastname') as HTMLInputElement).value;
      const phone = (this.shadowRoot!.getElementById('phone') as HTMLInputElement).value;
      const address = (this.shadowRoot!.getElementById('address') as HTMLInputElement).value;
      

      // if (newPasswordInput.value !== confirmPasswordInput.value) {
        // alert('Passwords do not match!');
        // return;
      // }

      if (username != "" && !this.isValidUsername(username)) {
        alert('Username must be 3-16 characters long.');
        return;
      }

      // if (!this.isValidPassword(newPasswordInput.value)) {
      //   alert('Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
      //   return;
      // }
      if (phone != "" && this.isValidPhone(phone)) {
        alert('Phone number must be 10-15 digits long.');
        return;
      }


      const formData = new FormData(form);
      formData.append('username', username !== "" ? (this.shadowRoot!.getElementById('username') as HTMLInputElement).value : this.datatemp.username);
      formData.append('firstname', firstname !== "" ? (this.shadowRoot!.getElementById('firstname') as HTMLInputElement).value : this.datatemp.firstname);
      formData.append('lastname', lastname !== "" ? (this.shadowRoot!.getElementById('lastname') as HTMLInputElement).value : this.datatemp.lastname);
      formData.append('phone', phone !== "" ? (this.shadowRoot!.getElementById('phone') as HTMLInputElement).value :  this.datatemp.phone);
      formData.append('address', address !== "" ? (this.shadowRoot!.getElementById('address') as HTMLInputElement).value : this.datatemp.address);
     

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
          "password": formData.get('password')
        }),
        credentials: 'include', 
        mode: 'cors', 
      })
        .then((response) => {
          if (response.ok) {
            alert('Settings updated successfully!');
            window.history.pushState({}, '', '/profile'); // Update the URL to the home page
            (window as any).loadRoute('/profile');
          } else {
            alert('Failed to update settings.');
          }
        })
        .catch((error) => {
          console.error('Error updating settings:', error);
          alert('An error occurred while updating settings.');
        });
    });
    this.linkListeners();
  }

  private isValidUsername(username: string): boolean {
    // Username must be 6-16 characters long
    return /^[a-zA-Z0-9]{3,16}$/.test(username);
  }

  private isValidPhone(phone: string): boolean {
    // Phone number must be 10-15 digits long
    return /^\d{10,15}$/.test(phone);
  }

  private isValidEmail(email: string): boolean {
    // Email must be 8-100 characters long and match the format user@example.com
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length >= 8 && email.length <= 100;
  }

  // private isValidPassword(password: string): boolean {
  //   // Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, and one number
  //   return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);
  // }
  private linkListeners(): void {
     const formLinks = this.shadowRoot!.querySelectorAll('#Head a');
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
customElements.define('custom-settings', CustomSettings);