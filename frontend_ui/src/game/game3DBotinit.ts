import { initializeBabylonBot } from "./game3DBot.js";

class Custom3DBot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initializeBabylonEffect();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <link href="../dist/output.css" rel="stylesheet">

  <div class="w-full h-full flex items-center justify-center bg-gray-900">
      <canvas id="renderCanvas" class="w-full h-full"></canvas>
    </div>    `;
  }

  initializeBabylonEffect() {
    const canvas = this.shadowRoot!.getElementById(
      "renderCanvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      initializeBabylonBot(canvas); // Pass the canvas element directly
    } else {
      console.error("Canvas element not found in <custom-3d>");
    }
  }
}

// Define the custom element
customElements.define("custom-3d-bot", Custom3DBot);