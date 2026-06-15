import { formatearValorMoneda } from "./utils.js";

class CardsInfo extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
    }

    render() {
        const totalCantidad = this.getAttribute('total-cantidad') || 0;
        const totalCantidadRegistros = this.getAttribute('total-cantidad-registros') || 0;


        this.shadowRoot.innerHTML =
            `

        <style>

            .tarjetas-resumen {
                display: flex;
                width: 100%;
            }

            .tarjetas {
                display: flex;
                flex-direction: column;
                border: 1px solid #eee;
                width: 25%;
                height: 110px;
                border-left: none;
                border-right: none;
                padding: 10px;
                gap: 10px;

                span {
                    font-size: 30px;
                }
            }

            .tarjetas:nth-child(1),
            .tarjetas:nth-child(2),
            .tarjetas:nth-child(3) {
                border-right: 1px solid #eee;
            }
        </style>

        <div class="tarjetas-resumen">
            <div class="tarjetas">
                <h2>Total</h2>
                <span id="tarjeta-total">${totalCantidad}</span>
            </div>
            <div class="tarjetas">
                <h2>Registros</h2>
                <span id="tarjeta-registros">${totalCantidadRegistros}</span>
            </div>
            <div class="tarjetas"></div>
            <div class="tarjetas"></div>
        </div>
        `
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['total-cantidad', 'total-cantidad-registros'];
    }




    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue) return;

        let tarjetaTotal = this.shadowRoot.querySelector('#tarjeta-total');
        let tarjetaTotalRegistros = this.shadowRoot.querySelector('#tarjeta-registros');

        if (tarjetaTotal) {
            tarjetaTotal.textContent = formatearValorMoneda(this.getAttribute('total-cantidad'));
        }

        if (tarjetaTotalRegistros) {
            tarjetaTotalRegistros.textContent = this.getAttribute('total-cantidad-registros');
        }



    }
}

customElements.define("cards-info", CardsInfo);

export default CardsInfo;