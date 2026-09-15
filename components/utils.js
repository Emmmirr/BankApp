export function formatearValorMoneda(cantidad) {
  if (cantidad == undefined) cantidad = 0;
  let numeroFormateado = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(+cantidad);
  return numeroFormateado;
}

export function guardarDatosLocal(name, array) {
  let arrayConvertido = JSON.stringify(array);
  localStorage.setItem(name, arrayConvertido);
  console.log(localStorage.getItem(name));
}
// guardarDatosLocal(list, objForm);
export function comprobarDatosLocal(lista) {
  if (localStorage[lista]) {
    let datosConvertidos = JSON.parse(localStorage[lista]);
    return datosConvertidos;
  } else {
    return [];
  }
  // guardarDatosLocal(list, objForm);
}

export function sumarCantidades(arr, nombreCampo) {
  return arr.reduce((sum, current) => sum + (+current[nombreCampo] || 0), 0);
}

export function comprobarRelacion(idBuscado, listaBusqueda, campoRelacionado) {
  let lista = comprobarDatosLocal(listaBusqueda);

  return lista.some((el) => el[campoRelacionado] === idBuscado);
}

export function transformarFormAObjeto(form) {
  let objForm = {};

  for (const element of form.elements) {
    if (!element.name) continue;

    const valor = element.value.trim();

    if (valor === "") continue;

    if (element.type === "number" || element.dataset.type === "number") {
      objForm[element.name] = Number(valor);
    } else {
      objForm[element.name] = valor;
    }
  }
  return objForm;
}

export function notificarToast(tipo, titulo, descripcion) {
  window.dispatchEvent(
    new CustomEvent("notificar-toast", {
      detail: {
        tipo,
        titulo,
        descripcion,
      },
    }),
  );
}

export function filtrarDatos(array, textoBusqueda) {
  let datosEncontrados = array.filter(({ id, ...obj }) =>
    Object.values(obj).some((v) =>
      (v ?? "").toString().toLowerCase().includes(textoBusqueda.toLowerCase()),
    ),
  );

  return datosEncontrados;
}

export function crearIndice(array, campoClave, campoAGuardar = null) {
  if (!Array.isArray(array)) return {};
  return array.reduce((acc, objArray) => {
    acc[objArray[campoClave]] =
      campoAGuardar === null ? objArray : objArray[campoAGuardar];
    return acc;
  }, {});
}

export function llenarSelect(elemento, array, campoValor, campoTexto) {
  const fragment = document.createDocumentFragment();
  console.log(elemento);
  console.log(array);
  console.log(campoValor);
  console.log(typeof campoTexto);
  if (!elemento || !Array.isArray(array)) return;

  array.forEach((el) => {
    const option = document.createElement("option");
    option.value = el[campoValor];

    if (typeof campoTexto == "string") {
      option.textContent = el[campoTexto];
    } else if (typeof campoTexto == "function") {
      option.textContent = campoTexto(el);
    } else {
      option.textContent = "Tipo de dato inválido";
    }

    fragment.append(option);
  });

  elemento.append(fragment);
}

export function guardarRegistro({ form, filaEnEdicion, array, list, funcion }) {
  if (form.reportValidity()) {
    let objForm = transformarFormAObjeto(form);
    let tituloToast;
    let descToast;

    if (filaEnEdicion) {
      let filaIndex = array.findIndex((elem) => elem.id == +filaEnEdicion);
      objForm.id = filaEnEdicion;
      array[filaIndex] = objForm;
    } else {
      objForm.id = Date.now();
      array.push(objForm);
    }

    guardarDatosLocal(list, array);
    // compTable.pintarDatos(this._arrayClientes);
    // compCardInfo.setAttribute('total-cantidad', this.sumarCantidades(this._arrayClientes))

    // this.actualizarInterfaz();
    // this._compTable.getModal().close();
    funcion(Boolean(filaEnEdicion));
  }
}
