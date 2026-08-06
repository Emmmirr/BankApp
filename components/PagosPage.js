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
    this._arrayPagos = null;
    this._arrayPolizas = null;
    this._arrayPlanes = null;
    this._arrayClientes = null;
    this._clientesIndex = null;
    this._planesIndex = null;
    this._polizasIndex = null;
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

                select {

                    height: 35px;
                    width: 250px;
                    max-width: 300px;
                    border-radius: 4px;
                    background: hsl(0, 0%, 97%);
                    border: 1px solid hsl(0, 0%, 80%);
                    padding: 10px;
                
                }

                h2 {
                    font-size: 15px;
                    font-weight: normal;
                }

                label {
                display: block;
                  font-size: 15px;
                  font-weight: normal;
                }
            }


        </style>
          <page-header title="Pagos">
              Pago de todos los clientes
          </page-header>

          <cards-info>

          </cards-info>
        <table-datos id="table-pagos" data-lista="listaPagos" 
        colums="Poliza,Plan,Monto Pagado,Fecha Pago,Fecha Vencimiento,Metodo Pago,Acciones">

          <form slot="form" action="" id="formDatos" data-table="table-pagos">

          <div class="form-section">
            <div>
              <label for="poliza">Póliza:</label>
              
              <select name="poliza" id="poliza">
                <option value="">Selecciona la póliza</option>
              </select>
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
              <h2>Fecha de Vencimiento</h2>
              <input type="date" name="fecha-vencimiento" id="fecha-vencimiento" required />
            </div>

            <div>
              <h2>Método de pago</h2>
              <input type="text" name="metodo-pago" id="metodo-pago" required />
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
    this._arrayPagos = comprobarDatosLocal(this._list);
    this._arrayClientes = comprobarDatosLocal("listaClientes")
    this._arrayPolizas = comprobarDatosLocal("listaPolizas");
    this._arrayPlanes = comprobarDatosLocal("listaPlanes")
    const selectPoliza = this.shadowRoot.querySelector('#poliza'); 
    const inputPlan = this.shadowRoot.querySelector('#plan');
    let form = this.shadowRoot.querySelector('form');


    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))


    this._polizasIndex = this._arrayPolizas.reduce((acc, poliza) => {
      acc[poliza.id] = poliza;
      return acc;
    }, {}); 

    console.log(this._polizasIndex)

    this._clientesIndex = this._arrayClientes.reduce((acc, cliente) => {
      acc[cliente.id] = cliente.nombre;
      return acc;
    }, {});

    this._planesIndex = this._arrayPlanes.reduce((acc, plan) => {
      acc[plan.id] = plan.nombre;

      return acc;
    }, {});


    this.llenarSelect("poliza", this._arrayPolizas, "id", (elem) => {
      let cliente = this._clientesIndex[elem.cliente] ?? "No existe el cliente";
      let plan = this._planesIndex[elem.plan] ?? "No existe el plan";

      return `${cliente} - ${plan}`
    })

    selectPoliza.addEventListener("change", (e) => {

      let poliza = this._polizasIndex[e.target.value];
      let plan = poliza ? this._planesIndex[poliza.plan] : "";

      inputPlan.value = plan;


      console.log(poliza)
      console.log(plan)
    });

    // this.llenarSelect("cliente", this._arrayPolizas, "id",
    //   (elem) => {
    //     console.log(elem)
    //     console.log(this._arrayClientes)

    //     let cliente = this._arrayClientes.find(cliente => cliente.id == elem.cliente)?.nombre ?? "No existe el cliente";

    //     let plan = this._arrayPlanes.find(plan => plan.id == elem.plan)?.nombre ?? "No existe el plan"; 

    //     return  `cliente - plan`;

    //   });


    // this.llenarSelect("plan", this._arrayPlanes, "id", "nombre" );


    this.addEventListener('click-guardar', () => {
      if (form.reportValidity()) {
        let formData = new FormData(form);


        let objForm = Object.fromEntries(formData.entries());

        console.log(objForm)

        if (this._filaEnEdicion) {
          let filaIndex = this._arrayPagos.findIndex(elem => elem.id == +this._filaEnEdicion)
          objForm.id = this._filaEnEdicion;
          this._arrayPagos[filaIndex] = objForm;
        } else {
          objForm.id = Date.now();
          this._arrayPagos.push(objForm)
        }

        guardarDatosLocal(this._list, this._arrayPagos);
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

        this.actualizarInterfaz(this._arrayPagos);

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
        let filaIndex = this._arrayPagos.findIndex(elem => elem.id == +filaId);

        this._arrayPagos.splice(filaIndex, 1);
        guardarDatosLocal(this._list, this._arrayPagos);
        console.log("Boton eliminar pulsado")
        console.log(this._arrayPagos)
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))
        this.actualizarInterfaz(this._arrayPagos);
      }

      if (btnAccion == "editar") {

        this._filaEnEdicion = filaId;
        let filaEditar = this._arrayPagos.find(elem => elem.id == +filaId);
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




        this.actualizarInterfaz(this._arrayPagos);

  }



  //Se hizo un solo metodo para todo aquello que se ejecutaba
  //al inicio o al final de alguna accion como al iniciar la pag.
  //despues de eliminar registro o editar uno.

  actualizarInterfaz(arr) {
    let objDatos = [
      { titulo: "Total cantidad", valor: sumarCantidades(arr, "monto-pagado"), tipo: "money" },
      { titulo: "Registros", valor: arr.length, tipo: "number" }
    ];

    let objPagosTraducidos = arr.map(pago => {

      console.log(this._polizasIndex)

      let poliza = this._polizasIndex[pago?.poliza];


      let cliente = this._clientesIndex[poliza?.cliente];
      let plan = this._planesIndex[poliza?.plan];


      console.log(poliza)
      console.log(cliente)
      console.log(plan)

      return {...pago, poliza: cliente ?? "No existe el cliente", plan: plan ?? "No existe el plan"}
       
    })
    this._compCardsInfo.pintarTarjetas = objDatos;
    this._compTable.pintarDatos(objPagosTraducidos);


    // this._compCardsInfo.setAttribute('total-cantidad', sumarCantidades(arr, "amount"));
    // this._compCardsInfo.setAttribute('total-cantidad-registros', this._arrayClientes.length);
  }

  llenarSelect(idElement, array, campoValor, campoTexto) {
    if (array) {
      const select = this.shadowRoot.getElementById(idElement);
      array.forEach(element => {
        const option = document.createElement('option');
        option.value = element[campoValor];

        console.log(campoTexto)
        console.log(typeof campoTexto)

        if (typeof campoTexto == "string") {
          option.textContent = element[campoTexto];
        } else if (typeof campoTexto == 'function') {
          option.textContent = campoTexto(element);
        } else {
          option.textContent = "Tipo de dato inválido";
        }

        select.append(option);
      })

    }


  }


}

customElements.define("pagos-page", PagosPage);

export default PagosPage;
