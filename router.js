import ClientePage from "./components/ClientePage.js";

const Router = {
    init: () => {

        document.addEventListener("click", e => {

            let link = e.target.closest('a');

            if (!link) {
                return;
            }

            e.preventDefault();
            const url = link.getAttribute('href');
            Router.nav(url)

        });

        // document.querySelectorAll('a').forEach(list => {

        //     list.addEventListener('click', e => {
        //         e.preventDefault();
        // const url = e.target.getAttribute('href');
        // Router.nav(url)
        //     });
        // });

        window.addEventListener('popstate', (e) => {
            Router.nav(e.state.route, false)
        });
    },

    nav: (route, addToHistory = true) => {
        console.log(route)
        if (addToHistory) {
            history.pushState({ route }, null, route);
        }

        let el;

        const routes = {
            "/index": () => {
                el = document.createElement("h1");
                el.textContent = "Home"
                return el;
            },
            "/clients": () => {
                el = document.createElement("cliente-page");

                return el;
            },
            404: () => {
                el = document.createElement("h1");
                el.textContent = "Page not found";
                return el;
            }

        }

        let routeFound = routes[route] ? routes[route]() : routes[404]();

            const entry = document.getElementById("content-main");
            entry.innerHTML = "";
            entry.append(routeFound);

    },


}

export default Router;