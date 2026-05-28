import { formatearValorMoneda } from "./metodos.js";
import Router from "./router.js"
import TableDatos from "/components/TableDatos.js"
import PageHeader from "./components/PageHeader.js";
import FormDialog from "./components/FormDialog.js";

let boton = document.getElementById("boton-guardar");


let objArray = {};


let clienteValue = document.getElementById("client-name");
let datePago = document.getElementById("date-pago");
let conceptoPago = document.getElementById("concept");
let amount = document.getElementById("amount");

// let table = document.getElementById("table-pagos");
let botonAgregar = document.getElementById("botonAgregarFila");
// let tbody = table.tBodies[0];
let formulario = document.getElementById("formDatos");
let forumlarioDescuentos = document.getElementById("formDatosDescuentos");
let main = document.getElementById("content-main");
let filaEnEdicion = null;
let tarjetaTotal = document.getElementById("tarjeta-total");
let tarjetaRegistros = document.getElementById("tarjeta-registros")
const dialogo = document.getElementById("miDialogo");
const abrir = document.getElementById("abrir");
const cerrar = document.getElementById("cerrar");

export function actualizarTotal(table) {
  let indiceTotal = table.tHead.rows[0].querySelector(
    "th[data-name-col='amount']",
  ).cellIndex;
  let noFilas = table.tBodies[0].rows.length;
  // let tfootCeldaTotal = table.tFoot.rows[0].querySelector(
  //   "td[data-name-col='totalCantidad']",
  // );
  let suma = 0;

  for (let i = 0; i < noFilas; i++) {
    let filaActual = table.tBodies[0].rows[i];

    let valorCelda = +filaActual.cells[indiceTotal].dataset.valorOriginal;

    suma += valorCelda;
  }

  // tfootCeldaTotal.textContent = formatearValorMoneda(suma);
  tarjetaTotal.textContent = formatearValorMoneda(suma);
  tarjetaRegistros.textContent = noFilas;


  // console.log(suma);

  // console.log(noFilas)
  // console.log(table.tBodies[0].rows[])
  //  console.log(indiceTotal.cellIndex);
}

function identificarTabla(e) {
  let table = e.target.closest("table");


  // console.log(thead)
  // console.log(form);
  // console.log(table);
  if (!table) return;
  // let celdaTotal = table.querySelector("td[data-name-col='totalCantidad']")
  // console.log(celdaTotal)
  let thead = table.tHead;
  let form = document.querySelector(`form[data-table="${table.id}"]`);
  let formBoton = form.querySelector('button[type="submit"]');
  let boton = e.target.closest("button");
  let fila = e.target.closest("tr");

  // console.log(fila.cells);
  let celda = e.target.closest("td");
  // console.log(celda)
  let valor = celda.innerText;
  let columna = celda.cellIndex;
  // console.log(`Valor de celda:${valor} , Valor de columna: ${columna}`);
  // let valores = Array.from(fila.cells).map(td => td.innerText);
  // console.log(valores);
  // console.log(celda);
  if (!boton) return;
  if (boton.dataset.accion == "eliminar") {

    let filaEncontrada = objArray[table.dataset.lista].findIndex(obj => obj.id == +fila.dataset.id);
    objArray[table.dataset.lista].splice(filaEncontrada, 1);
    fila.remove();
    console.log(filaEncontrada)
    guardarDatosLocal(table.dataset.lista, objArray[table.dataset.lista]);
    actualizarTotal(table);

  }

  if (boton.dataset.accion == "editar") {

    // console.log(boton.dataset.accion == "cancelar");

    if (boton.dataset.accion == "cancelar") return;

    formBoton.textContent = "Guardar cambios";

    // console.log(fila.cellIndex)
    let noCeldas = table.tHead.rows[0].cells.length;
    let celdas = fila.cells;
    filaEnEdicion = fila;
    // console.log(filaEnEdicion.cells[1].textContent);

    // console.log(noCeldas);

    for (let i = 0; i < noCeldas; i++) {
      // console.log(celdas[i].cellIndex);

      let nombreCampo = thead.rows[0].cells[i].dataset.nameCol;

      // console.log(nombreCampo)
      // console.log(celdas)

      if (form.elements[nombreCampo]) {

        if (form.elements[nombreCampo].name == "amount") {
          // console.log(celdas[i].dataset.valorOriginal);
          form.elements[nombreCampo].value = celdas[i].dataset.valorOriginal;
        } else {
          form.elements[nombreCampo].value = celdas[i].innerText;
        }

      }

    }

    dialogo.showModal();

  }

}

main.addEventListener("click", identificarTabla);


function crearFila(objPago, table) {
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


function agregarDatos(e) {

  e.preventDefault();
  let formData = new FormData(e.target);
  let nombreObtenido = e.target.dataset;
  let table = document.getElementById(nombreObtenido.table);
  let noFilas = table.tHead.rows[0].cells.length;
  let tbody = table.tBodies[0];
  let botonForm = e.target.querySelector('button[type="submit"]');
  let objCliente = {};


  if (filaEnEdicion == null) {

    for (let i = 0; i < noFilas; i++) {

      let columna = table.tHead.rows[0].cells[i].dataset.nameCol;
      let valor = formData.get(columna);

      if (columna == "acciones") continue;

      if (columna == "amount") {
        objCliente[columna] = valor;
      } else {
        objCliente[columna] = valor;
      }

    }

    objCliente.id = Date.now();
    objArray[table.dataset.lista].push(objCliente);
    tbody.append(crearFila(objCliente, table));

  } else {

    let objEncontrado = objArray[table.dataset.lista].find(obj => obj.id == +filaEnEdicion.dataset.id);

    for (let i = 0; i < noFilas; i++) {
      let columna = table.tHead.rows[0].cells[i].dataset.nameCol;
      let valor = formData.get(columna);

      if (columna == "acciones") continue;

      if (columna == "amount") {
        filaEnEdicion.cells[i].textContent = formatearValorMoneda(valor);
        filaEnEdicion.cells[i].dataset.valorOriginal = valor;
        objEncontrado[columna] = valor;
      } else {
        filaEnEdicion.cells[i].textContent = valor;
        objEncontrado[columna] = valor;
      }
    }
  }

  dialogo.close();
  actualizarTotal(table);
  guardarDatosLocal(table.dataset.lista, objArray[table.dataset.lista]);
  console.log(JSON.parse(localStorage.listaPagos))
}



function limpiarFormulario(e) {

  let dialog = e.target;

  let form = dialog.querySelector("form");

  let botonGuardar = form.querySelector('button[type="submit"]');


  botonGuardar.textContent = "Guardar";

  form.reset();

  if (filaEnEdicion) {
    filaEnEdicion = null;
  }

}

function guardarDatosLocal(name, array) {
  let arrayConvertido = JSON.stringify(array);
  localStorage.setItem(name, arrayConvertido);
  console.log(localStorage.getItem(name))
}

function pintarDatos() {

}


let tableAll = document.querySelectorAll("table[data-lista]");

tableAll.forEach(tabla => {
  console.log(tabla);
  if (localStorage[tabla.dataset.lista]) {
    let tbody = tabla.tBodies[0];
    let datosConvertidos = JSON.parse(localStorage[tabla.dataset.lista]);
    console.log(datosConvertidos)
    objArray[tabla.dataset.lista] = datosConvertidos;

    for (let obj of objArray[tabla.dataset.lista]) {

      tbody.append(crearFila(obj, tabla))

      // console.log(crearFila(objArray[tabla.dataset.lista][obj], tabla))

    }
    console.log(objArray[tabla.dataset.lista])

  } else {
    objArray[tabla.dataset.lista] = [];
  }

  actualizarTotal(tabla);

})



console.log(localStorage)

abrir.addEventListener("click", () => dialogo.showModal());

cerrar.addEventListener("click", () => dialogo.close())

dialogo.addEventListener("close", limpiarFormulario);

formulario.addEventListener("submit", agregarDatos);


window.app = {};
app.router = Router;

window.addEventListener("DOMContentLoaded", () => {
  app.router.init();
})



