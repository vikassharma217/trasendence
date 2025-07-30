class CustomSingle extends HTMLElement {
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
					  <div id="Head" class="flex flex-col gap-4 px-4">
							<a id="3d-bot" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
								3D Ai
							</a>
							<a id="1v-bot" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
								2D Ai
							</a>
							<a id="1v1" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
								2D Local 1v1
							</a>
							<a id="2v2" class="px-5 py-3 border-b-2 border-[#eebbc3] bg-[#ff8906] text-[#fffffe] font-bold rounded-xl hover:bg-[#ff6600] hover:shadow-white hover:shadow-md transition-all">
								2D Local 2v2
							</a>
							<a id="back" class="px-5 py-3 border-b-2 border-[#eebbc3] text-[#ff8906] font-bold rounded-xl hover:bg-[#ff6600]/10 hover:shadow-white hover:shadow-md transition-all">Back</a>
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
		this.linkListeners();
	  }
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
customElements.define('custom-single', CustomSingle);