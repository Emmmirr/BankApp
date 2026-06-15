import FormDialog from "./FormDialog.js";
import { formatearValorMoneda } from "./utils.js";
import { guardarDatosLocal } from "./utils.js";

class TableDatos extends HTMLElement {
  constructor() {
    super(); //LLama al constructor de htmlElement
    this.attachShadow({ mode: 'open' });
    this._modalExterno = null;
    this._btnCerrar = null;
    this._arObj = {};
  }

  render() {

    const clase = this.getAttribute('class');
    const idTable = this.getAttribute('id');
    const dataTable = this.dataset.lista;
    const colums = this.getAttribute('colums');
    const dataColumn = this.dataset.nameCol;

    let arrayColums = colums.split(',');
    this.shadowRoot.innerHTML = `

        <style>
        .datosContainer {
          display: flex;
          align-items: flex-start;    
          flex-direction: column;
          margin: 0 auto;
          gap: 25px;

          button {
            align-self: flex-end;
          }
        }

  .datosContainerHeader {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
  
.btn-editar {
  background-image: url("images/edit.svg");
  background-repeat: no-repeat;
  height: 20px;
  width: 20px;
  border: none;
  background-color: transparent;

  &:hover {
    cursor: pointer;
  }
}

.btn-eliminar {
  background-image: url("images/trash.svg");
  background-repeat: no-repeat;
  height: 20px;
  width: 20px;
  border: none;
  background-color: transparent;

  &:hover {
    cursor: pointer;
  }
}



.btn-agregar {
  background-image: url("images/plus.svg");
  background-repeat: no-repeat;
  background-size: 14px;
  background-position: left 4px top 3px;
  padding-left: 10px;
  height: 24px;
}

.btn-general {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  line-height: 24px;
  border-radius: 5px;
  min-width: 110px;

  &:hover {
    cursor: pointer;
  }
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

table td:nth-child(4) {
  text-align: right;
}

table tfoot td:nth-child(2) {
  text-align: right;
}

table td {
  border: 1px solid black;
  padding: 12px;
  height: 35px;
  border-bottom: 1px solid #eee;
  border-left: none;
  border-right: none;
}

table th {
  border: 1px solid #eee;
  padding: 12px;
  height: 15px;
  background: hsl(0, 0%, 97%);
  color: hsl(0, 0%, 30%);
  text-transform: uppercase;
  text-align: start;
}

table th:nth-child(5) {
  text-align: center;
}


</style>




    <div class="datosContainer">
      <div class="datosContainerHeader">
        <button class="btn-agregar btn-general" id="abrir">Nuevo pago</button>
      </div>

      <table id="${idTable}" data-lista="${dataTable}">
        <colgroup>
          ${arrayColums.map(column => {
      return "<col />"
    }).join("")}
        </colgroup>

        <thead>
          <tr>
          ${arrayColums.map(column => {
      return `<th data-name-col="${column.trim().toLowerCase().split(" ").join("-")}"> ${column.trim()} </th>`
    }).join("")}

          </tr>
        </thead>

        <tbody></tbody>

        <!-- <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td data-name-col="totalCantidad"></td>
              <td></td>
            </tr>
          </tfoot> -->
      </table>

      <form-dialog>
          <slot name="form"></slot>
      </form-dialog>

    </div>
        `

  }

  connectedCallback() {

    this.render();

    let table = this.shadowRoot.querySelector('table');

    console.log(table)

    table.addEventListener('click', (e) => {
      let btn = e.target.closest('button');
      if (!btn) return;
      let btnData = btn.dataset.accion;
      let fila = e.target.closest('tr');

      // console.log(btn);
      // console.log(fila);
      // console.log(filaId)

      this.dispatchEvent(new CustomEvent('tabla-click', {
        bubbles: true,
        composed: true,
        detail: {
          btnData : btnData,
          fila: fila,
        }

      }))
    });

    this.addEventListener('open-modal', (e) => {
      this._modalExterno = e.detail.value;
      this._btnCerrar = e.detail.boton;


      if (this._btnCerrar) {
        this._btnCerrar.addEventListener('click', () => {
          this._modalExterno.close();
        })
      }
      console.log(this._modalExterno)
      console.log(this._btnCerrar)
    })

    this.shadowRoot.querySelector('#abrir').addEventListener('click', () => {
      if (this._modalExterno) {
        this._modalExterno.showModal();
      } else {
        console.log("Error")
      }
    })


  }


  pintarDatos(array) {

    let table = this.shadowRoot.querySelector('table');
    let tbody = table.tBodies[0];
    tbody.innerHTML = "";
    for (let obj of array) {
      tbody.append(this.crearFila(obj, table))
    }

    console.log(table.dataset.lista)
  }


  cerrarModal() {
    this._modalExterno.close();
  }

  // agregarNuevaFila(obj) {

  //   let table = this.shadowRoot.querySelector('table');
  //   let tbody = table.tBodies[0];
  //   tbody.append(this.crearFila(obj));
  // }



  static get observedAttributes() {
    return ["class", "id", "colums"]
  }

  attributeChangedCallback( ) {
    this.render();
  }

  setBtnText (txt) {
    let formDialog = this.shadowRoot.querySelector('form-dialog');

    console.log(formDialog)

    formDialog.setAttribute('btn-text', txt);

  }


  crearFila(objPago) {
    let table = this.shadowRoot.querySelector('table');
    let fila = document.createElement("tr");
    let celda = document.createElement("td");
    let noFilas = table.tHead.rows[0].cells.length;

    for (let i = 0; i < noFilas; i++) {
      let columna = table.tHead.rows[0].cells[i].dataset.nameCol;
      let celda = document.createElement("td");
      let valor = objPago[columna];

      if (columna == "acciones") {
        let botonEliminar = document.createElement("button");
        let botonEditar = document.createElement("button");
        let div = document.createElement("div");
        botonEditar.dataset.accion = "editar";
        botonEditar.className = "btn-editar";
        botonEliminar.dataset.accion = "eliminar";
        botonEliminar.className = "btn-eliminar";
        div.className = "acciones";
        div.append(botonEliminar);
        div.append(botonEditar);
        celda.append(div);
      } else {

        if (columna == "amount") {

          celda.textContent = formatearValorMoneda(valor);
          celda.dataset.valorOriginal = valor;

        } else {
          celda.textContent = valor;
        }
      }
      fila.dataset.id = objPago.id;
      fila.append(celda);
    }
    return fila;
  }

}

customElements.define("table-datos", TableDatos);

export default TableDatos;