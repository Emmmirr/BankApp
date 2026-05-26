class TableDatos extends HTMLElement {
    constructor() {
        super(); //LLama al constructor de htmlElement
        this.attachShadow({ mode: 'open' });
    }

    render() {

        const clase = this.getAttribute('class');

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

  .datosContainerHeader {
  display: flex;
  width: 100%;
  justify-content: space-between;
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

      <table id="table-pagos" data-lista="listaPagos">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>

        <thead>
          <tr>
            <th data-name-col="date-pago">Fecha</th>
            <th data-name-col="client-name">Cliente</th>
            <th data-name-col="concept">Concepto</th>
            <th data-name-col="amount">Cantidad</th>
            <th data-name-col="acciones">Acciones</th>
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
    </div>
        `
    }

    connectedCallback() {
        this.render()
    }
}

customElements.define("table-datos", TableDatos);

export default TableDatos;