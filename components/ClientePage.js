import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";

class ClientePage extends HTMLElement {

    constructor (){
        super();
        this.attachShadow({mode : 'open'});
    }

    render(){
        this.shadowRoot.innerHTML = `

        <style>
            :host {
              display: flex;
              flex-direction: column;
              gap: 100px;
            }
        </style>
            <page-header>

            </page-header>
            <table-datos></table-datos>
        `
    }

    connectedCallback (){
        this.render();
    }
}

customElements.define("cliente-page", ClientePage);

export default ClientePage;

