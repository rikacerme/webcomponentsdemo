// Componentimizin HTML templatini oluşturuyoruz
const template = document.createElement('template');
template.innerHTML = `
  <style>
    button {
      width: 50px;
      height: 50px;
      border: 1px solid orange;
      border-radius: 20%;
      background: red;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:active {
      background-color: #D9391C;
      border: 1px solid red;
      border-radius: 30%;
    }

    button:focus {
        outline: none;
    }

    span {
      display: inline-block;
      margin: 0 5px;
      min-width: 25px;
      text-align: center;
    }
  </style>
  <slot></slot>
  <button id="increaseBtn">+</button>
  <span id="label">0</span>
  <button id="decreaseBtn">-</button>
`;

export class CounterComponent extends HTMLElement {
  // Componentimizin observedAttributes tanımı
  static get observedAttributes() {
    return ['value'];
  }

  // value üzerine gelen guncellemeler için set kullanılan yerler için get eklemesi yapıldı
  get value() {
    return this.getAttribute('value');
  }

  set value(val) {
    this.setAttribute('value', val);
  }

  // Dom üstünde ihtiyacımız olan elementler için değişken oluşturuyoruz
  // increaseButton;
  // decreaseButton;
  // label;

  constructor() {
    // prototip veya extend olunan yerlerdeki işlemleri miraz alabilmek için eklenir.
    super();

    // İsteğe bağlı olarak componentinizi shadow dom içine alabilirsiniz
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // Dom elemenlerini oluşturdugumuz değişkenlere atıyoruz
    this.increaseButton = this.shadowRoot.querySelector('#increaseBtn');
    this.decreaseButton = this.shadowRoot.querySelector('#decreaseBtn');
    this.label = this.shadowRoot.querySelector('#label');
    this.value = 0;
  }
  connectedCallback() {
    // Buttonların click eventlerine dinleyici ekliyoruz
    // addEventListener callback fonksiyonuna kendi componentimizi gönderiyoruz bu context üstünde işlem yapabilmesi için
    this.increaseButton.addEventListener('click', this._increase.bind(this));
    this.decreaseButton.addEventListener('click', this._decrease.bind(this));
  }
  disconnectedCallback() {
    // dinleyicileri siliyoruz yine kendi contextimizi göndererek
    this.increaseButton.removeEventListener('click', this._increase.bind(this));
    this.decreaseButton.removeEventListener('click', this._decrease.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.label.innerHTML = newValue;
  }

  adoptedCallback() {
    console.log('I am adopted!');
  }

  _increase() {
    this.value = parseInt(this.value) + 1;
  }

  _decrease() {
    this.value = this.value - 1;
  }
}

customElements.define('my-parent', CounterComponent);
