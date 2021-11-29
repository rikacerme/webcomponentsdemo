# webcomponentsdemo

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/webcomponentsdemo)

---

[En]

[Tr]
Web Components???

Merhabalar ilk medium yazımda web component üzerine paylaşımda bulunacağım. Şimdiden iyi okumalar.

Nedir bu web components?
Uygulamalarımızı geliştirirken her zaman kod tekrarından kaçınalım deriz buna dikkat ederiz. Yeni uygulamalar gelecek yeniden kod tekrarına dikkat etmemiz gerekecek. Önyüz uygulamaları için bilindik tüm kütüphanelerde component tabanlı geliştirme yapıyoruz. WebComponent olunca ne oluyor? Web component bizim bol bol kullandığımız <div> <span> gibi tagler oluşturmamızı sağlıyor. Bir kere stillerimizi davranışlarını belirlediğimiz <my-alert/> componenti oluşturmamızı ve her yerde kullanmamızı sağlıyor. Peki bunu ne sayesinde yapıyor?

1)Shadowroot
Componentin ana dom ağacına kapsüllenmiş bir dom olarak çalışmasını sağlar. Çalışan diğer componentlerden ve application dan soyutlanmış şekilde işleri yürütür.

2)custom element
Componentimizin browserlar tarafından tanınmasını sağlar. customElement.define(param1, param2) diye yazılır. Param1 diye verdiğimiz kısım componentimizin ismini belirler. Param2 ise component oluşturduğumuz classımızı verdiğimiz parametre.

3)html template
Componentimiz browser tarafından oluşturulurken ekranda ne göstereceğini çıktısının ne olacağını belirttiğimiz kısımdır.
Daha fazla ayrıntı burada.

Temel olarak webcomponent bu. Yorumlarınız düşüncelerin olursa da bekliyorum.

İlk örneğimizde iki butonu olan ve içinde bir sayısal değer tutan sayaç yapacağız.

Componentimizin son halinde neler var, nasıl görünüyor bir bakalım:
Başlangıçta componentimiz için <template> oluşturuyoruz . Kullanacağımız html elementlerini tanımlıyoruz. Ardından classımızı tanımlamaya başlıyoruz. Classımız için "CounterComponent" ismini seçtim. Extend ettiğimiz yer "HTMLElement" olduğunu görüyorsunuz. Böylece standart html elementinin üstünde ilerleme kaydedebiliriz.

---

LifeCycle:

1. constructor
   Başlatıcı adımımız, "Constructor" fonksiyonumuzdur. İlk değer atamalarımız, tanımlarımız burada yer alır. Componentimiz için olacak tüm ilk tanımları burada yer alır. This.myValue = "First Value" gibi. Burada unutulmaması gereken diğer konu Mixin ve extend edilen classlardan tüm mirası aldığından emin olmaktır. Bunu da "super()" çağrımını ekleyerek tamamlamış oluyoruz. Burada componentimizin shadowDom kullanasına karar verebilir ve html parçamızın eklenmesini yapabiliriz.

2. connectedCallback
   Componentimizin içinde bir öğe eklenmesi durumunda çağrılan adımdır. Bu adımda document.queryselector ile dom üzerinde elementleri bulabiliriz. Bu sayede eventlistener ekleme işlemleri için uygun bir adım olmakta.

3. disconnectedCallback
   Componentimiz dom üzerinden silindiğinde ve ekranda artık çalışmadığında bu lifecycle adımımız tetiklenir. Bu adımda ekli eventlistener bulunuyorsa bunlardan kurtulmamız gerekir. Temizleme ve kaynakları sıfırlama adına, en uygun yerimiz burasıdır.

4. attributeChangedCallback
   Adının hakkını veren lifecycle adımına geldik 😊 Componentimizin üzerine eklenen(örneğimizde observedAttributes) parametrelerde bir değişiklik olması durumunda bu adım tetiklenmekte. 3 parametre ile çağrılır. Bunlar;
   1-parameter adı,
   2-parametrenin eski değeri,
   3-parametrenin yeni değeri

5. adoptedCallback
   Componentimiz içinde bunla ilgili bir örnek yok ama güzel bir şekilde açıklayacağım 😊 uygulamamız içinde bir kaç iframe olması durumunu düşünelim. Her iframe kendi içinde bir "document" a sahip olacak. Eğer componentimiz sayfa içinde bir yerde ekliyken iframe içine taşınırsa. Bu fonksiyonumuz tetiklenir. Burada şöyle bir önemli nokta var. iframe içine taşınan elementimizin "constructor" adımı çağrılmaz. Bu yüzden yapılması gereken işlemleri burada tekrar etmeniz yada yeri değiştiği bir değişiklik uygulayabilirsiniz.
   Componentimiz ilk sayfaya eklenmesi durumundaki adımların sırası:
   constructor > connectedCallback
   Componentimiz farklı bir iframe altına taşınma işleminin yapılması.( nasıl yapılacağı ile ilgili örnek)
   disconnectedCallback > adoptedCallback > connectedCallback

---

Bu adımlardan sonra componentimizi oluşturmaya başlayabiliriz. Componentimiz bir sayaç componenti olacak "-","+" buttonları bulunacak bir de ortalarında değeri gösterdiğimiz alan olacak.
Geliştireceğimiz component burada.
Ilk adım olarak componentimizin html kısmını oluşturuyoruz.
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

Buttonların üst kısmında stiller verilmiş durumda. Arkasından class tanımımızı ekliyoruz.
`export class CounterComponent extends HTMLElement {`
Class ismimiz "CounterComponent" ve extend edilen yer gördüğünüz gibi basic "HTMLElement". İlk önce class içinde kullanacağım parametreleri tanımlıyorum. Burada takip edeceğim tek parametrem olacak.
`static get observedAttributes() { return ['value']; }`

Value üzerinde değişiklikler için set-get metotlarını ekliyorum.
`get value() { return this.getAttribute('value'); } set value(val) { this.setAttribute('value', val); }`

Böylece value ataması olduğunda yada buttonlar tıklandığında attribute de güncellemesini yapmış olacağım. Sonrasında lifecycle adımlarımla devam ediyorum.
`constructor() { // prototip veya extend olunan yerlerdeki işlemleri miras alabilmek için eklenir. super(); // İsteğe bağlı olarak componentinizi shadow dom içine alabilirsiniz this.attachShadow({ mode: 'open' }); this.shadowRoot.appendChild(template.content.cloneNode(true)); // Dom elemenlerini oluşturdugumuz değişkenlere atıyoruz this.increaseButton = this.shadowRoot.querySelector('#increaseBtn'); this.decreaseButton = this.shadowRoot.querySelector('#decreaseBtn'); this.label = this.shadowRoot.querySelector('#label'); this.value = 0; }`
Burada componentim shadow içinde oluşması için
`this.attachShadow({ mode: 'open' });`
ekledim.

`this.shadowRoot.appendChild(template.content.cloneNode(true)); shadowDom içine en başta oluşturduğum html kodunu buraya ekledim. this.increaseButton = this.shadowRoot.querySelector('#increaseBtn'); this.decreaseButton = this.shadowRoot.querySelector('#decreaseBtn'); this.label = this.shadowRoot.querySelector('#label'); this.value = 0;`

html üzerinde olan button ve label için değişkenlerime atamlarımı yaptım aynı zamanda sayacımın "0" dan başlaması için ilk değer atamamı yaptım. Diğer lifecycle adımıma geçtiğimde:
`connectedCallback() { // Buttonların click eventlerine dinleyici ekliyoruz // addEventListener callback fonksiyonuna kendi componentimizi gönderiyoruz bu context üstünde işlem yapabilmesi için this.increaseButton.addEventListener('click', this.\_increase.bind(this)); this.decreaseButton.addEventListener('click', this.\_decrease.bind(this)); }`

Dom üzerinde bulunan elementlerime eventlistener ları ekledim button tıklandığında sayacımı azaltma ve arttırma fonksiyonlarımı çağırıyorum.

Ardından;
`disconnectedCallback() { // dinleyicileri siliyoruz yine kendi contextimizi göndererek this.increaseButton.removeEventListener('click', this.\_increase.bind(this)); this.decreaseButton.removeEventListener('click', this.\_decrease.bind(this)); }`
Lifcycle da bahsettiğimiz gibi bu adımda html elementimizin ekrandan kaldırıldığı durumlarda eventlistenerlarımızı siliyoruz.
Devamında:

`attributeChangedCallback(name, oldValue, newValue) { this.label.innerHTML = newValue; }`

Value üzerinde bir değişiklik olduğunda dom üzerinde bulunan değişkenimizi güncelliyoruz. Geriye kalan kısımda arttırma ve azaltma fonksiyonlarımızı ekliyoruz.

`\_increase() { this.value = parseInt(this.value) + 1; } \_decrease() { this.value = this.value - 1; }`

Ve en sonunda classımızı kapatıp component tanımımızı ekliyoruz.
`} customElements.define('my-parent', CounterComponent);`

Şuanda gördüğünüz gibi componentimizi bir file içinde oluşturduk.
Bunu birde bir html içinde çalıştığını görürsek ilk adım için herşeyi tamamlamış olacağız.

<body>
<my-parent> </my-parent>
<script type="module" src="./my-element.js"></script>
</body>
Elementimizin adını ve oluşturduğumuz dosyanın importunu eklediğimize göre artık önümüzde bir engel kalmamış olmalı 😊
Ekrana gelen ilk hali"+" tıklamaları sonrası"-" tıklamaları sonrasıUmarım faydalı bir yazı olmuştur.

Deneyimlerinizi benle paylaşırsanız çok sevinirim.
