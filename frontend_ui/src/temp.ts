class TestUploadForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    private render(): void {
      this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">
        <body class="overflow-hidden">
          <div class="flex flex-col justify-center items-center h-screen bg-[#232946]">
            <h1 class="text-4xl font-bold text-white mb-6">Test File Upload</h1>
            <form id="upload-form" class="flex flex-col gap-4 px-4 text-white text-left font-mono">
              <input type="file" id="test-file" accept="image/*" class="p-2 border border-gray-300 rounded-md hover:bg-[#ff6600]/10 focus:outline-none focus:ring-2 focus:ring-[#ff6600]" />
              <button type="submit" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
                Upload File
              </button>
            </form>
            <div id="uploaded-image" class="mt-4"></div> <!-- Container for the uploaded image -->
          </div>
        </body>
      `;
  
      this.setupListeners();
    }
  
    private setupListeners(): void {
      const form = this.shadowRoot!.querySelector('#upload-form')!;
      form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
  
        const fileInput = this.shadowRoot!.getElementById('test-file') as HTMLInputElement;
  
        if (!fileInput.files || fileInput.files.length === 0) {
          alert('Please select a file to upload.');
          return;
        }
  
        const formData = new FormData();
        formData.append('testFile', fileInput.files[0]);
  
        try {
          const response = await fetch('https://localhost/api/testUpload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: formData,
            credentials: 'include', 
            mode: 'cors',
          });
  
          if (!response.ok) {
            throw new Error('File upload failed');
          }
  
          const result = await response.json();
          const uploadedImageDiv = this.shadowRoot!.getElementById('uploaded-image')!;
          const fileUrl = `https://localhost/api${result.fileUrl}`; // Construct the full URL

          console.log('File uploaded successfully:', result);
          uploadedImageDiv.innerHTML = `<img src="${fileUrl}" alt="Uploa  ded Image" class="max-w-xs rounded-md shadow-md" />`; // Display the image
          alert(result.message);
          window.history.pushState({}, '', '/profile'); // Update the URL to the home page
          (window as any).loadRoute('/profile');
        } catch (error: any) {
          console.error('Error uploading file:', error);
          alert('File upload failed. Please try again.');
        }
      });
    }
  }
  
  // Define the custom element
  customElements.define('test-upload-form', TestUploadForm);