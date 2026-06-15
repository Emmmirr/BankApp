
export function formatearValorMoneda(cantidad) {

  if(cantidad == undefined) cantidad = 0;
  let numeroFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(+cantidad);
  return numeroFormateado;
}

export function guardarDatosLocal(name, array) {
  let arrayConvertido = JSON.stringify(array);
  localStorage.setItem(name, arrayConvertido);
  console.log(localStorage.getItem(name))
}
      // guardarDatosLocal(list, objForm);
export function comprobarDatosLocal(lista) {

  if (localStorage[lista]) {
    console.log("Existe el dataset componente")
    let datosConvertidos = JSON.parse(localStorage[lista]);
    return datosConvertidos;
  } else {
    return [];
  }
      // guardarDatosLocal(list, objForm);
}



