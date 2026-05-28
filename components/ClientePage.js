import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";
import FormDialog from "./FormDialog.js";
class ClientePage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._modalExterno = null;
    }

    render() {
        this.shadowRoot.innerHTML = `

        <style>

        

                *{
            margin : 0;
            padding: 0;
            box-sizing: border-box;
        }
            :host {
              display: flex;
              flex-direction: column;
              gap: 100px;
            }

                                .form-section {
                display: flex;
                gap: 35px;
                width: 100%;
                justify-content: center;

                input {
                    height: 35px;
                    width: 250px;
                    max-width: 300px;
                    border-radius: 4px;
                    background: hsl(0, 0%, 97%);
                    border: 1px solid hsl(0, 0%, 80%);
                    padding: 10px;

                    &:user-invalid{
                    border-color: red;
                    }
                }

                h2 {
                    font-size: 15px;
                    font-weight: normal
                }
            }


        </style>
          <page-header title="Clientes">
              Pago de todos los clientes
          </page-header>
        <table-datos colums="Fecha, Cliente, Precio">

          <form slot="form" action="" id="formDatos" data-table="table-pagos">

            <div class="form-section">
              <div>
                <h2>ID Cliente</h2>
                <input type="number" name="client-id" id="client-id"/>
              </div>

              <div>
                <h2>Nombre</h2>
                <input type="text" name="client-name" id="client-name" />
              </div>
            </div>


            <div class="form-section">
              <div>
                <h2>Apellidos</h2>
                <input type="text" name="client-lastname" id="client-lastname" required />
              </div>

              <div>
                <h2>RFC</h2>
                <input type="number"name="client-rfc" id="client-rfc" required />
              </div>
            </div>

            <div  class="form-section">
              <div>
              <h2>Datos de riesgo</h2>
              <input type="text" name="client-data" id="client-data"/>
              </div>
              <div>
              </div>
            </div>

          </form>
        </table-datos>
        `
    }

    connectedCallback() {
        this.render();

        this.addEventListener('click-guardar', (e) => {
          console.log("Boton para guardar form clickeado!")
        });

        

        
    }
}

customElements.define("cliente-page", ClientePage);

export default ClientePage;

