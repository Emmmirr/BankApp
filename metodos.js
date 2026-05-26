
export function formatearValorMoneda(cantidad) {

  let numeroFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(+cantidad);

  return numeroFormateado;
}``

