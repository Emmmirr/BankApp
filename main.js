let firstValue = document.getElementById("inputFirstValue");

let secondValue = document.getElementById("inputSecondValue");
let showResults = document.querySelector(".results");

let boton = document.getElementById("boton-guardar");

function sumarValores() {
  let suma = +firstValue.value + +secondValue.value;
  showResults.textContent = suma;
}

// boton.addEventListener("click", sumarValores);

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

function actualizarTotal(table) {
  let indiceTotal = table.tHead.rows[0].querySelector(
    "th[data-name-col='amount']",
  ).cellIndex;
  let noFilas = table.tBodies[0].rows.length;
  let tfootCeldaTotal = table.tFoot.rows[0].querySelector(
    "td[data-name-col='totalCantidad']",
  );
  let suma = 0;

  for (let i = 0; i < noFilas; i++) {
    let filaActual = table.tBodies[0].rows[i];

    let valorCelda = +filaActual.cells[indiceTotal].textContent;

    suma += valorCelda;
  }

  tfootCeldaTotal.textContent = `$${suma}`;
  tarjetaTotal.textContent = suma.toFixed(2);
  tarjetaRegistros.textContent = noFilas;


  console.log(suma);

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
    fila.remove();
        actualizarTotal(table);
  }
  if (boton.dataset.accion == "editar") {
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

      if (form.elements[nombreCampo]) {
        form.elements[nombreCampo].value = celdas[i].innerText;
      }

      // console.log(thead.rows[0].cells[i].dataset.nameCol)
    }

    dialogo.showModal();


    // console.log(thead.rows[0].cells)

    //Recorremetos el formullario obteniendo sus elementos y valores de estos
    //Ignorando los botones

    // for (let elemento of form.elements) {
    //   // Filtramos para no afectar a los botones, solo a los campos de datos
    //   if (elemento.name) {
    //     console.log(`Nombre: ${elemento.name}, Valor: ${elemento.value}`);
    //   }
    // }
  }
  // console.log(boton);

  // console.log(fila);
}

main.addEventListener("click", identificarTabla);

// main.onclick = function (e) {
//   let table = e.target.closest("table")
//   console.log(table)
//   if(!table) return;
//   let boton = e.target.closest("button");
//   let fila = e.target.closest("tr");
//   if (!boton) return;
//   if (boton.dataset.accion == "eliminar") {
//     fila.remove();
//   }
//   console.log(boton);

//   console.log(fila);
// };

function agregarDatos(e) {
  e.preventDefault();
  let formData = new FormData(e.target);
  let nombreObtenido = e.target.dataset;
  let table = document.getElementById(nombreObtenido.table);
  let noFilas = table.tHead.rows[0].cells.length;
  let tbody = table.tBodies[0];
  let botonForm = e.target.querySelector('button[type="submit"]');

  if (filaEnEdicion == null) {
    let fila = document.createElement("tr");
    // console.log(noFilas);
    // console.log(table);
    // console.log(nombreObtenido.table);

    // console.log(e.target);
    // console.log(e.target.dataset);

    for (let i = 0; i < noFilas; i++) {
      let columna = table.tHead.rows[0].cells[i].dataset.nameCol;
      let celda = document.createElement("td");

      if (columna == "acciones") {
        let botonEliminar = document.createElement("button");
        let botonEditar = document.createElement("button");
        let div = document.createElement("div");
        // botonEditar.textContent = "Editar";
        botonEditar.dataset.accion = "editar";
        botonEditar.className = "btn-editar";
        // botonEliminar.textContent = "Eliminar";
        botonEliminar.dataset.accion = "eliminar";
        botonEliminar.className = "btn-eliminar";
        div.className = "acciones";
        div.append(botonEliminar);
        div.append(botonEditar);
        celda.append(div);
        // celda.append(botonEliminar);
        // celda.append(botonEditar);
      } else {
        celda.textContent = formData.get(columna);
        // console.log(columna);
      }

      fila.append(celda);
    }

    // for (let [name, value] of formData) {
    //   let celda = document.createElement("td");
    //   celda.textContent = formData.get(name);
    //   fila.append(celda);
    // }
    tbody.append(fila);

    e.target.reset();

    actualizarTotal(table);
  } else {
    for (let i = 0; i < noFilas; i++) {
      let columna = table.tHead.rows[0].cells[i].dataset.nameCol;

      if (columna == "acciones") continue;
      filaEnEdicion.cells[i].textContent = formData.get(columna);
    }

    botonForm.textContent = "Guardar";
    e.target.reset();
    filaEnEdicion = null;
    actualizarTotal(table);
  }
}



abrir.addEventListener("click", () => dialogo.showModal());
cerrar.addEventListener("click", () => dialogo.close());

formulario.addEventListener("submit", agregarDatos);

forumlarioDescuentos.addEventListener("submit", agregarDatos);
