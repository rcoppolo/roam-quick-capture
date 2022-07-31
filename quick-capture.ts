const YOUR_SERVER_URL = "<REPLACE_ME>";
const YOUR_SERVER_KEY = "<REPLACE_ME>";

const highlightColor = "rgb(213, 234, 255)";

const template = `
  <template id="highlightTemplate">
    <span class="highlight" style="background-color: ${highlightColor}; display: inline"></span>
  </template>

  <button id="roamQuickCapture">
    <img src="https://roamresearch.com/assets/astrolabe-white.png" width="30" height="30" />
  </button>
`;

const styled = ({ display = "none", left = 0, top = 0 }) => `
  #roamQuickCapture {
    align-items: center;
    background-color: black;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: ${display};
    justify-content: center;
    left: ${left}px;
    padding: 5px 10px;
    position: fixed;
    top: ${top}px;
    width: 40px;
    z-index: 9999;
  }
  .text-marker {
    fill: white;
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;

class RoamQuickCapture extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  get markerPosition() {
    return JSON.parse(this.getAttribute("markerPosition") || "{}");
  }

  get styleElement() {
    return this.shadowRoot.querySelector("style");
  }

  get highlightTemplate() {
    return this.shadowRoot.getElementById("highlightTemplate");
  }

  static get observedAttributes() {
    return ["markerPosition"];
  }

  render() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styled({});
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML += template;
    this.shadowRoot
      .getElementById("roamQuickCapture")
      .addEventListener("click", () => this.highlightSelection());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "markerPosition") {
      this.styleElement.textContent = styled(this.markerPosition);
    }
  }

  highlightSelection() {
    var selectedText = window.getSelection().toString();
    fetch(`${YOUR_SERVER_URL}/roam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: YOUR_SERVER_KEY,
        text: selectedText
      })
    }).then(function(r) {
      console.log('response', r)
    });
    window.getSelection().empty();
  }
}

window.customElements.define("roam-quick-capture", RoamQuickCapture);
