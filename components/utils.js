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
