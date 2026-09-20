import ClientePage from "./components/ClientePage.js";
import PolizasPage from "./components/PolizasPage.js";
import PlanesPage from "./components/PlanesPage.js";
import PagosPage from "./components/PagosPage.js";

//Creación del objeto Router que contiene 2 elementos
//los cuales son funciones ejecutables
// init() → configura los eventos de navegación
// nav()  → realiza/renderiza la navegación
let linkActivo = null;
const Router = {
  //Detectamos un click en todo el documento hasta
  //y desde el elemento clickeado busca hacía arriba
  //hasta encontrar el a más cercano
  init: () => {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");

      //En caso de no ser a no hacemos nada
      if (!link) {
        return;
      }

      // link.classList.add("color-a");

      //Evitamos que el navegador haga la navegación
      //normal del a para tomar nosotros el control
      //con nuestro router
      e.preventDefault();
      //Obtenemos el href que contiene el anchor
      //y lo mandamos a la función nav del objeto
      //Router
      const url = link.getAttribute("href");
      Router.nav(url, link);
    });

    // document.querySelectorAll('a').forEach(list => {

    //     list.addEventListener('click', e => {
    //         e.preventDefault();
    // const url = e.target.getAttribute('href');
    // Router.nav(url)
    //     });
    // });

    //Detectamos cuando el navegador cambia a otra entrada
    //mediante la navegación histórica
    window.addEventListener("popstate", (e) => {
      //Consultamos lo que contiene el state asociado a la entrada
      // del historial a la que el navegador acaba de navegar y
      //en caso de ser una ruta que ha sido creada por medio
      //de pushState entonces e.state contendrá el objeto
      //y se podrá acceder a .route

      // Si la entrada del historial no tiene un state asociado,
      // e.state puede ser null.
      // En ese caso obtenemos la ruta directamente de la URL
      // mediante window.location.pathname.

      let route = e.state?.route || window.location.pathname;
      let link;
      if (route === "/" || route === "/index") {
        link = document.querySelector(`a[href="/pagos"]`);
        console.log(link);
      } else {
        link = document.querySelector(`a[href="${route}"]`);
        console.log(link);
      }

      Router.nav(route, link, false);
    });
  },

  //Obtenemos la url y dependiendo si es addToHistory = true
  //entonces agregamos esta navegación al historial
  // false indica que no queremos crear una nueva entrada
  // en el historial, ya que el navegador ya cambió a una
  // entrada existente mediante la navegación histórica.
  nav: (route, link, addToHistory = true) => {
    console.log(route);
    console.log(link);

    if (linkActivo) {
      linkActivo.classList.remove("activo");
    }
    if (link) {
      link.classList.add("activo");
      linkActivo = link;
    }
    // Si debemos agregar la navegación al historial,
    // creamos una nueva entrada mediante pushState().
    // Guardamos la ruta en el state y actualizamos la URL.
    if (addToHistory) {
      history.pushState(
        { route }, // state que guardamos
        null, // segundo argumento no utilizado
        route, // URL que aparecerá en el navegador
      );
    }

    // if (route.length == 0) {
    //   location = "/";
    // }

    let el;

    //Definimos nuestrar rutas a las que se accedera por medio
    //del route que tiene nav que es prácticamente la ruta
    const routes = {
      //Las rutas / y /index usan la misma ruta de pagos
      "/": () => routes["/pagos"](),

      "/index": () => routes["/pagos"](),

      "/pagos": () => {
        el = document.createElement("pagos-page");
        return el;
      },
      "/clients": () => {
        el = document.createElement("cliente-page");
        return el;
      },
      "/polizas": () => {
        el = document.createElement("polizas-page");
        return el;
      },
      "/planes": () => {
        el = document.createElement("planes-page");
        return el;
      },

      //Cuando la ruta solicitada no existe
      //en nuestro objeto de routes accedemos
      //directamente a esta
      404: () => {
        el = document.createElement("h1");
        el.textContent = "Page not found";
        return el;
      },
    };

    //Si existe routes[route] entonces ejecuta lo que tiene dentro
    //Si no existe entonces se va directo al 404
    let routeFound = routes[route] ? routes[route]() : routes[404]();

    //Obtenemos el elemento donde se inserta la página
    const entry = document.getElementById("content-main");
    //Limpiamos el contenido de la página anterior
    entry.innerHTML = "";
    //Insertamos la nueva página

    entry.append(routeFound);
  },
};

export default Router;
