import PageHeader from "./PageHeader.js";
import TableDatos from "./TableDatos.js";
import FormDialog from "./FormDialog.js";
import CardsInfo from "./CardsInfo.js"

import { comprobarDatosLocal, guardarDatosLocal } from "./utils.js";

class PolizasPage extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._arrayPolizas = null;
    this._filaEnEdicion = null;
    this._list = null;
    this._modal = null;
    this._compTable - null;
    this._compCardsInfo = null;
    this._arrayPagos = null;
    this._arrayPlanes = null;
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
          <page-header title="Polizas">
              Polizas relacionadas con los clientes
          </page-header>

          <cards-info>

          </cards-info>
        <table-datos id="table-polizas" data-lista="listaPolizas" 
        colums="Cliente,Plan,Fecha Inicio,Fecha Fin,Estado,Precio Contratado,Fecha Emision,Acciones">

          <form slot="form" action="" id="formPolizas" data-table="table-polizas">


          <div class="form-section">
            <div>
              <label for="cliente">Cliente:</label>
              
              <select name="cliente" id="cliente">
                <option value="">Selecciona el cliente</option>
              </select>

            </div>

            <div>
              <label for="plan">Plan</label>
              <select name="plan" id="plan"/>
                <option value="">Selecciona el producto</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <div>
              <h2>Fecha Inicio</h2>
              <input type="date" name="fecha-inicio" id="fecha-inicio" />
            </div>

            <div>
              <h2>Fecha Fin</h2>
              <input type="date" name="fecha-fin" id="fecha-fin" />
            </div>
          </div>

          <div class="form-section">
            <div>
              <h2>Estado</h2>
              <select name="estado" id="estado"/>
                <option value="">Selecciona el producto</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <h2>Precio Contratado</h2>
              <input type="number" step="0.01" name="precio-contratado" id="precio-contratado" required />
            </div>
          </div>

          <div class="form-section">
            <div>
              <h2>Fecha Emision</h2>
              <input type="date" name="fecha-emision" id="fecha-emision" />
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
    this._arrayPolizas = comprobarDatosLocal(this._list);
    this._arrayPagos = comprobarDatosLocal("listaPagos");
    this._arrayPlanes = comprobarDatosLocal("listaPlanes")

    console.log(this._arrayPagos)

    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

    this.actualizarInterfaz(this._arrayPolizas);

    let form = this.shadowRoot.querySelector('form');
    let select = this.shadowRoot.querySelector('select');

    this.llenarSelect("cliente",this._arrayPagos, "id", 
    (elem) => `${elem.nombre} ${elem['apellido-paterno'] ?? ""} ${elem['apellido-materno'] ?? ""}`);
    this.llenarSelect("plan", this._arrayPlanes, "id", "nombre" );

    // nombreCliente?.nombre ?? `No existe el usuario: ${elemento.cliente}`



    // if (this._arrayPagos) {

    //   this._arrayPagos.forEach(element => {
    //     const option = document.createElement('option');
    //     option.value = element.id;
    //     option.textContent = element["client-name"];

    //     select.append(option);

    //   })

    // }

    console.log(select)


    this.addEventListener('click-guardar', () => {

      if (form.reportValidity()) {
        let formData = new FormData(form);

        let objForm = Object.fromEntries(formData.entries());

        console.log(objForm)

        if (this._filaEnEdicion) {

          let filaIndex = this._arrayPolizas.findIndex(elem => elem.id == +this._filaEnEdicion)
          objForm.id = this._filaEnEdicion;
          this._arrayPolizas[filaIndex] = objForm;

        } else {
          objForm.id = Date.now();
          this._arrayPolizas.push(objForm)
        }

        guardarDatosLocal(this._list, this._arrayPolizas);
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

        this.actualizarInterfaz(this._arrayPolizas);
        this._compTable.cerrarModal();
      }


    });

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

    this.addEventListener('tabla-click', (e) => {
      let fila = e.detail.fila;
      let filaId = fila.dataset.id;
      let btnAccion = e.detail.btnData;

      if (btnAccion == "eliminar") {
        let filaIndex = this._arrayPolizas.findIndex(elem => elem.id == +filaId);

        this._arrayPolizas.splice(filaIndex, 1);
        guardarDatosLocal(this._list, this._arrayPolizas);
        console.log("Boton eliminar pulsado")
        console.log(this._arrayPolizas)
        // compTable.pintarDatos(this._arrayClientes);
        // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))
        this.actualizarInterfaz(this._arrayPolizas);
      }

      if (btnAccion == "editar") {

        this._filaEnEdicion = filaId;
        let filaEditar = this._arrayPolizas.find(elem => elem.id == +filaId);
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

  sumarCantidades(arr) {

    console.log(arr)
    return arr.reduce((sum, current) => sum + +current['precio-anual'], 0);

  }

  actualizarInterfaz(arr) {

    let objPolizasTraducidas = arr.map(elemento => {
      console.log(elemento.cliente)

      // this._arrayPagos.map(elem => {

      //   console.log(elemento.cliente)
      //   if(elem.id == elemento.cliente){
      //     console.log(elem.nombre)
      //   }

      // })

      let nombreCliente = this._arrayPagos.find(elem => elem.id == elemento.cliente) ;
      let nombrePlan = this._arrayPlanes.find(elem => elem.id == elemento.plan);

      console.log(nombreCliente)
      return {...elemento, cliente: nombreCliente ? nombreCliente.nombre : `No existe el usuario: ${elemento.cliente}` , plan : nombrePlan ? nombrePlan.nombre : `NO existe el plan: ${elemento.plan}`}

      // return {...elemento, cliente:  nombreCliente?.nombre ?? `No existe el usuario: ${elemento.cliente}` , plan : nombrePlan?.nombre ?? "No existe el plan"}


    });

    console.log(objPolizasTraducidas);

    console.log(this._arrayPagos)

    let objDatos = [
      {titulo:"Registros", valor:arr.length, tipo:"number"}
    ]

    this._compCardsInfo.pintarTarjetas = objDatos;
    this._compTable.pintarDatos(objPolizasTraducidas);

    // this._compCardsInfo.setAttribute('total-cantidad', this.sumarCantidades(arr));
    // this._compCardsInfo.setAttribute('total-cantidad-registros', this._arrayPolizas.length);
  }

  llenarSelect(idElement, array, campoValor, campoTexto) {
    if (array) {
      const select = this.shadowRoot.getElementById(idElement);
      array.forEach(element => {
        const option = document.createElement('option');
        option.value = element[campoValor];

        console.log(campoTexto)
        console.log(typeof campoTexto)

        if(typeof campoTexto == "string" ){
          option.textContent = element[campoTexto];
        }else if(typeof campoTexto == 'function'){
          option.textContent = campoTexto(element);
        }else{
            option.textContent = "Tipo de dato inválido";
        }

        select.append(option);
      })

    }


  }

}

customElements.define("polizas-page", PolizasPage);

export default PolizasPage;

