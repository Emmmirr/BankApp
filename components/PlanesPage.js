import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";
import FormDialog from "./FormDialog.js";
import CardsInfo from "./CardsInfo.js";

import {
  comprobarDatosLocal,
  guardarDatosLocal,
  sumarCantidades,
  transformarFormAObjeto,
  notificarToast,
  comprobarRelacion,
  filtrarDatos,
} from "./utils.js";

class PlanesPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._arrayPlanes = null;
    this._filaEnEdicion = null;
    this._list = null;
    this._modal = null;
    this._compTable - null;
    this._compCardsInfo = null;
    this._contenidoABuscar = null;
  }

  render() {
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./forms.css" />
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

            

        </style>
          <page-header title="Planes">
              Lista de planes existentes de seguros
          </page-header>

          <cards-info>

          </cards-info>
        <table-datos id="table-planes" data-lista="listaPlanes" 
        colums="Nombre,Descripcion,Precio Anual:Money,Acciones">

          <form slot="form" action="" id="formPlanes" data-table="table-planes">



            <div>
            <h2>Nombre</h2>
              <input type="text" name="nombre" id="nombre" required />
            </div>

            <div>
            <h2>Descripcion</h2>
              <input type="text" name="descripcion" id="descripcion" required />
            </div>


            <div>
              <h2>Precio Anual</h2>
              <input type="number" step="0.01" name="precio-anual" id="precio-anual" />
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
    this._arrayPlanes = comprobarDatosLocal(this._list);

    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

    this.actualizarInterfaz(this._arrayPlanes);

    let form = this.shadowRoot.querySelector("form");

    this.addEventListener("click-guardar", () => {
      if (form.reportValidity()) {
        let objForm = transformarFormAObjeto(form);
        let tituloToast;
        let descToast;

        console.log(objForm);

        // objForm['precio-anual'] = +objForm['precio-anual'];

        if (this._filaEnEdicion) {
          let filaIndex = this._arrayPlanes.findIndex(
            (elem) => elem.id == +this._filaEnEdicion,
          );
          objForm.id = this._filaEnEdicion;
          this._arrayPlanes[filaIndex] = objForm;
          tituloToast = "Plan actualizado";
          descToast = "Se ha actualizado correctamente el plan";
        } else {
          objForm.id = Date.now();
          this._arrayPlanes.push(objForm);
          tituloToast = "Plan registrado";
          descToast = "Se ha registrado correctamente el plan";
        }

        guardarDatosLocal(this._list, this._arrayPlanes);
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

        this.actualizarInterfaz(this._arrayPlanes);
        this._compTable.getModal().close();
        notificarToast("exito", tituloToast, descToast);
      }
    });

    this.addEventListener("tabla-buscador", (e) => {
      this._contenidoABuscar = e.detail;

      this.actualizarInterfaz();
    });

    this.addEventListener("click-nuevo-registro", () => {
      this._compTable.getModal().show();
    });

    this.addEventListener("modal-cerrado", () => {
      if (this._filaEnEdicion) {
        this._filaEnEdicion = null;
      }
    });

    this.addEventListener("tabla-click", (e) => {
      let fila = e.detail.fila;
      let filaId = +fila.dataset.id;
      let btnAccion = e.detail.btnData;

      if (btnAccion == "eliminar") {
        if (comprobarRelacion(filaId, "listaPolizas", "plan")) {
          notificarToast(
            "info",
            "Plan no eliminado",
            "El plan no puede ser eliminado, tiene una póliza vinculada",
          );

          return;
        }

        let filaIndex = this._arrayPlanes.findIndex(
          (elem) => elem.id == filaId,
        );

        this._arrayPlanes.splice(filaIndex, 1);
        guardarDatosLocal(this._list, this._arrayPlanes);
        this.actualizarInterfaz(this._arrayPlanes);
        notificarToast(
          "exito",
          "Plan eliminado",
          "Se ha eliminado correctamente el plan",
        );
      }

      if (btnAccion == "editar") {
        this._filaEnEdicion = filaId;
        let filaEditar = this._arrayPlanes.find((elem) => elem.id == +filaId);
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

  actualizarInterfaz() {
    let arrayAUsar;

    if (this._contenidoABuscar) {
      arrayAUsar = filtrarDatos(this._arrayPlanes, this._contenidoABuscar);
    } else {
      arrayAUsar = this._arrayPlanes;
    }
    let objDatos = [
      {
        titulo: "Total cantidad",
        valor: sumarCantidades(arrayAUsar, "precio-anual"),
        tipo: "money",
      },
      { titulo: "Registros", valor: arrayAUsar.length, tipo: "number" },
    ];

    this._compCardsInfo.pintarTarjetas = objDatos;
    this._compTable.pintarDatos(arrayAUsar);
    // this._compCardsInfo.setAttribute('total-cantidad', sumarCantidades(arr, "precio-anual"));
    // this._compCardsInfo.setAttribute('total-cantidad-registros', this._arrayPlanes.length);
  }
}

customElements.define("planes-page", PlanesPage);

export default PlanesPage;
