// Import the Babylon.js init func form game3D
import { initializeBabylon } from "./game3D.js";

// new custom HTML element, attach shdow DOM tree in open mode to allow access
class Custom3D extends HTMLElement {
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

  // init 3D renedering by passing the canvas to Babylon.js
  initializeBabylonEffect() {
    const canvas = this.shadowRoot!.getElementById(
      "renderCanvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      initializeBabylon(canvas); // Pass the canvas element directly
    } else {
      console.error("Canvas element not found in <custom-3d>");
    }
  }
}

// Define the custom element to be used in HTML
customElements.define("custom-3d", Custom3D);
