import ClientePage from "./components/ClientePage.js";
import PolizasPage from "./components/PolizasPage.js";
import PlanesPage from "./components/PlanesPage.js";
import PagosPage from "./components/PagosPage.js";

const Router = {
  init: () => {
    document.addEventListener("click", (e) => {
      let link = e.target.closest("a");

      if (!link) {
        return;
      }

      e.preventDefault();
      const url = link.getAttribute("href");
      Router.nav(url);
    });

    // document.querySelectorAll('a').forEach(list => {

    //     list.addEventListener('click', e => {
    //         e.preventDefault();
    // const url = e.target.getAttribute('href');
    // Router.nav(url)
    //     });
    // });

    window.addEventListener("popstate", (e) => {
      Router.nav(e.state.route, false);
    });
  },

  nav: (route, addToHistory = true) => {
    console.log(route);
    if (addToHistory) {
      history.pushState({ route }, null, route);
    }

    // if (route.length == 0) {
    //   location = "/";
    // }

    let el;

    const routes = {
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
      404: () => {
        el = document.createElement("h1");
        el.textContent = "Page not found";
        return el;
      },
    };

    let routeFound = routes[route] ? routes[route]() : routes[404]();

    const entry = document.getElementById("content-main");
    entry.innerHTML = "";
    entry.append(routeFound);
  },
};

export default Router;
