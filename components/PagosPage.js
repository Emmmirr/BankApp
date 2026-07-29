import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";
import FormDialog from "./FormDialog.js";
import CardsInfo from "./CardsInfo.js"
import { comprobarDatosLocal, guardarDatosLocal, sumarCantidades } from "./utils.js";

class PagosPage extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._arrayClientes = null;
    this._filaEnEdicion = null;
    this._list = null;
    this._modal = null;
    this._compTable - null;
    this._compCardsInfo = null;
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
          <page-header title="Pagos">
              Pago de todos los clientes
          </page-header>

          <cards-info>

          </cards-info>
        <table-datos id="table-pagos" data-lista="listaPagos" 
        colums="Cliente,Plan,Monto Pagado,Fecha Pago,Metodo Pago,Acciones">

          <form slot="form" action="" id="formDatos" data-table="table-pagos">

          <div class="form-section">
            <div>
              <h2>Cliente</h2>
              <input type="text" name="cliente" id="cliente" required />
            </div>

            <div>
              <h2>Plan</h2>
              <input type="text" name="plan" id="plan" />
            </div>
          </div>


          <div class="form-section">
            <div>
              <h2>Monto Pagado</h2>
              <input type="number" name="monto-pagado" id="monto-pagado" required />
            </div>

            <div>
              <h2>Fecha de pago</h2>
              <input type="date" name="fecha-pago" id="fecha-pago" required />
            </div>
          </div>

          <div class="form-section">
            <div>
              <h2>Método de Pago</h2>
              <input type="number" name="metodo-pago" id="metodo-pago" required />
            </div>

            <div>
              <h2>Fecha de pago</h2>
              <input type="date" name="fecha-pago" id="fecha-pago" required />
            </div>
          </div>
        </form>
        </table-datos>
        `
  }

  connectedCallback() {
    this.render();

    this._list = this.shadowRoot.querySelector('table-datos').dataset.lista;
    this._compTable = this.shadowRoot.querySelector('table-datos');
    this._compCardsInfo = this.shadowRoot.querySelector('cards-info');
    this._arrayClientes = comprobarDatosLocal(this._list);

    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

    this.actualizarInterfaz(this._arrayClientes);

    let form = this.shadowRoot.querySelector('form');


    this.addEventListener('click-guardar', () => {
      if (form.reportValidity()) {
        let formData = new FormData(form);

        let objForm = Object.fromEntries(formData.entries());

        objForm.amount = +objForm.amount;

        console.log(objForm)

        if (this._filaEnEdicion) {
          let filaIndex = this._arrayClientes.findIndex(elem => elem.id == +this._filaEnEdicion)
          objForm.id = this._filaEnEdicion;
          this._arrayClientes[filaIndex] = objForm;
        } else {
          objForm.id = Date.now();
          this._arrayClientes.push(objForm)
        }

        guardarDatosLocal(this._list, this._arrayClientes);
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

        this.actualizarInterfaz(this._arrayClientes);

        this._compTable.cerrarModal();
      }


    });

    //Para facilitarnos el abrir el modal agregamos el listener
    //del evento que creamos en FormDialog.js

    this.addEventListener('open-modal', (e) => {

      this._modal = e.detail.value;

      if (this._modal) {
        this._modal.addEventListener('close', () => {
          form.reset();

          if (this._filaEnEdicion) {
            this._filaEnEdicion = null;
            this._compTable.setBtnText('Guardar');
          }
        })
      }
    })


    //Lo hacemos para que solamente tengamos un evento en toda
    //la tabla y se active al clickear los botoness

    this.addEventListener('tabla-click', (e) => {
      let fila = e.detail.fila;
      let filaId = fila.dataset.id;
      let btnAccion = e.detail.btnData;

      if (btnAccion == "eliminar") {
        let filaIndex = this._arrayClientes.findIndex(elem => elem.id == +filaId);

        this._arrayClientes.splice(filaIndex, 1);
        guardarDatosLocal(this._list, this._arrayClientes);
        console.log("Boton eliminar pulsado")
        console.log(this._arrayClientes)
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))
        this.actualizarInterfaz(this._arrayClientes);
      }

      if (btnAccion == "editar") {

        this._filaEnEdicion = filaId;
        let filaEditar = this._arrayClientes.find(elem => elem.id == +filaId);
        Object.entries(filaEditar).forEach(([key, value]) => {

          if (key == "id") return;

          if (form.elements[key]) {
            form.elements[key].value = value;
          }
        });

        this._compTable.setBtnText('Actualizar');

        this._modal.showModal();

      }





    })

  }



  //Se hizo un solo metodo para todo aquello que se ejecutaba
  //al inicio o al final de alguna accion como al iniciar la pag.
  //despues de eliminar registro o editar uno.

  actualizarInterfaz(arr) {
    let objDatos = [
      {titulo:"Total cantidad", valor:sumarCantidades(arr,"amount"), tipo:"money"},
      {titulo:"Registros", valor:arr.length, tipo:"number"}
    ];
    this._compCardsInfo.pintarTarjetas = objDatos;
    this._compTable.pintarDatos(arr);


    // this._compCardsInfo.setAttribute('total-cantidad', sumarCantidades(arr, "amount"));
    // this._compCardsInfo.setAttribute('total-cantidad-registros', this._arrayClientes.length);
  }


}

customElements.define("pagos-page", PagosPage);

export default PagosPage;
