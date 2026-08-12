import { formatearValorMoneda } from "./utils.js";

class CardsInfo extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
        this._arrayDatosTarjetas = [];
    }

    render() {

        this.shadowRoot.innerHTML =
            `

        <style>

            .tarjetas-resumen {
                display: flex;
                width: 100%;
                border: 1px solid #eee;
            }

            .tarjetas {
                display: flex;
                flex-direction: column;
                border-right: 1px solid #eee;
                width: 25%;
                height: 110px;
                border-left: none;
                padding: 10px;
                gap: 10px;

                span {
                    font-size: 30px;
                }
            }

        </style>

        <div class="tarjetas-resumen">

            ${this._arrayDatosTarjetas.map(dato => {

                let valorFormateado;
                
                if(dato.tipo == "money"){
                    valorFormateado = formatearValorMoneda(dato.valor);
                }else if(dato.tipo == "number"){
                    valorFormateado = dato.valor;
                }else{
                    valorFormateado = "Tipo de dato no válido"
                }
                
                return ` <div class = "tarjetas"> <h2>${dato.titulo}</h2> <span>${valorFormateado}</span> </div>`
            }).join("")}
            
        </div>
        `
    }

    connectedCallback() {
        this.render();
    }

    set pintarTarjetas(array) {
        this._arrayDatosTarjetas = array;
        this.render();
    }

    static get observedAttributes() {
        
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
}

customElements.define("cards-info", CardsInfo);

export default CardsInfo;