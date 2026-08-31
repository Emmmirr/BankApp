import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";
import FormDialog from "./FormDialog.js";
import CardsInfo from "./CardsInfo.js";
import NotificationToast from "./NotificationToast.js";
import {
  comprobarDatosLocal,
  guardarDatosLocal,
  sumarCantidades,
  comprobarRelacion,
  transformarFormAObjeto,
  notificarToast,
} from "./utils.js";

class ClientePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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

          <page-header title="Clientes">
              Registro de los clientes
          </page-header>

          <cards-info>

          </cards-info>
        <table-datos id="table-clientes" data-lista="listaClientes" 
        colums="Nombre,Apellido Paterno,Apellido Materno,Telefono,Acciones">

          <form slot="form" action="" id="formDatos" data-table="table-clientes">

          <div class="form-section">
            <div>
              <h2>Nombre</h2>
              <input type="text" name="nombre" id="nombre" required />
            </div>

            <div>
              <h2>Apellido paterno</h2>
              <input type="text" name="apellido-paterno" id="apellido-paterno" />
            </div>
          </div>


          <div class="form-section">
            <div>
              <h2>Apellido materno</h2>
              <input type="text" name="apellido-materno" id="apellido-materno" required />
            </div>

            <div>
              <h2>Télefono</h2>
              <input type="tel" maxlength="10" pattern="[0-9]{10}" name="telefono" placeholder="7471233489" id="telefono" required />
            </div>
          </div>
        </form>
        </table-datos>
        `;
  }

  connectedCallback() {
    this.render();

    this._list = this.shadowRoot.querySelector("table-datos").dataset.lista;
    this._compTable = this.shadowRoot.querySelector("table-datos");
    this._compCardsInfo = this.shadowRoot.querySelector("cards-info");
    this._arrayClientes = comprobarDatosLocal(this._list);

    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

    this.actualizarInterfaz(this._arrayClientes);

    let form = this.shadowRoot.querySelector("form");

    this.addEventListener("click-guardar", () => {
      if (form.reportValidity()) {
        let objForm = transformarFormAObjeto(form);
        let tituloToast;
        let descToast;

        if (this._filaEnEdicion) {
          let filaIndex = this._arrayClientes.findIndex(
            (elem) => elem.id == +this._filaEnEdicion,
          );
          objForm.id = this._filaEnEdicion;
          this._arrayClientes[filaIndex] = objForm;
          tituloToast = "Cliente actualizado";
          descToast = "Se ha actualizado correctamente el cliente";
        } else {
          objForm.id = Date.now();
          this._arrayClientes.push(objForm);
          tituloToast = "Cliente registrado";
          descToast = "Se ha registrado correctamente el cliente";
        }

        guardarDatosLocal(this._list, this._arrayClientes);
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

        this.actualizarInterfaz(this._arrayClientes);
        this._compTable.getModal().close();
        notificarToast("exito", tituloToast, descToast);
      }
    });

    //Para facilitarnos el abrir el modal agregamos el listener
    //del evento que creamos en FormDialog.js

    this.addEventListener("click-nuevo-registro", () => {
      this._compTable.getModal().show();
    });

    this.addEventListener("modal-cerrado", () => {
      if (this._filaEnEdicion) {
        this._filaEnEdicion = null;
      }
    });

    //Lo hacemos para que solamente tengamos un evento en toda
    //la tabla y se active al clickear los botoness

    this.addEventListener("tabla-click", (e) => {
      let fila = e.detail.fila;
      let filaId = +fila.dataset.id;
      let btnAccion = e.detail.btnData;

      if (btnAccion == "eliminar") {
        if (comprobarRelacion(filaId, "listaPolizas", "cliente")) {
          notificarToast(
            "info",
            "Cliente no eliminado",
            "El cliente no puede ser eliminado, tiene póliza activa",
          );
          return;
        }

        let filaIndex = this._arrayClientes.findIndex(
          (elem) => elem.id == filaId,
        );

        this._arrayClientes.splice(filaIndex, 1);
        guardarDatosLocal(this._list, this._arrayClientes);
        this.actualizarInterfaz(this._arrayClientes);
        notificarToast(
          "exito",
          "Cliente eliminado",
          "Se ha eliminado correctamente el cliente",
        );
      }

      if (btnAccion == "editar") {
        this._filaEnEdicion = filaId;
        let filaEditar = this._arrayClientes.find((elem) => elem.id == filaId);
        Object.entries(filaEditar).forEach(([key, value]) => {
          if (key == "id") return;

          if (form.elements[key]) {
            form.elements[key].value = value;
          }
        });

        this._compTable.setBtnText("Actualizar");
        this._compTable.getModal().show();
      }
    });
  }

  //Se hizo un solo metodo para todo aquello que se ejecutaba
  //al inicio o al final de alguna accion como al iniciar la pag.
  //despues de eliminar registro o editar uno.

  actualizarInterfaz(arr) {
    let objDatos = [{ titulo: "Registros", valor: arr.length, tipo: "number" }];
    this._compCardsInfo.pintarTarjetas = objDatos;
    this._compTable.pintarDatos(arr);

    // this._compCardsInfo.setAttribute('total-cantidad', sumarCantidades(arr, "amount"));
    // this._compCardsInfo.setAttribute('total-cantidad-registros', this._arrayClientes.length);
  }
}

customElements.define("cliente-page", ClientePage);

export default ClientePage;
