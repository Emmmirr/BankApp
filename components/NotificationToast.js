class NotificationToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._contenedorToast = null;
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>

    :host {
      --exito: #3ab65c;
      --error: #bf333b;
      --info: #1898c0;
      --warning: #bc8c12;
      --exito-hover: #2d8a46;
      --error-hover: #962a31;
      --info-hover: #147fa0;
      --warning-hover: #9b7512;
      position: fixed;
    }


    .contenedor-toast {
      display: flex;
      flex-direction: column-reverse;
      gap: 15px;
      width: 100%;
      max-width: 400px;
      position: fixed;
      right: 40px;
    }

    .toast{
      background: #ccc;
      display: flex;
      justify-content: space-between;
      border-radius: 10px;
      animation-name: apertura;
      animation-duration: 200ms;
      animation-timing-function: ease-out;
      position: relative;
      overflow: hidden;
    }

    .toast.exito {
      background: var(--exito);
    }

    .toast.error {
      background: var(--error);
    }

    .toast.info {
      background: var(--info);
    }

    .toast.warning {
      background: var(--warning);
    }

    .toast .contenido{
      display: grid;
      grid-template-columns: 30px auto;
      align-items: center;
      gap: 15px;
      padding: 0px 15px;
    }

    .toast .titulo{
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .toast .btn-cerrar{
      background: rgba(0, 0, 0, 0.1);
      border: none;
      cursor: pointer;
      padding: 0px 5px;
      transition: 0.3s ease all;
    }

    .toast .btn-cerrar:hover{
      background: rgba(0, 0, 0, 0.3);
    }

    .toast .btn-cerrar .icono{

      width: 20px;
      height: 20px;
      color: #fff;
    }

    @keyframes apertura {

      from{
        transform: translateY(-100px);
        opacity: 0;
      }

      to{
        transform: translateY(0);
        opacity: 1;
      }
    }

    .toast.cerrando{
      animation-name: cierre;
      animation-duration: 200ms;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }

    @keyframes cierre {
      from{
        transform: translateX(0);
      }

      to{
        transform: translateX(calc(100% + 40px));
      }
    }

    .toast.autoCierre::after{
      content: "";
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.5);
      bottom: 0;
      position: absolute;
      animation-name: autoCierre;
      animation-duration: 5s;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }

    @keyframes autoCierre {
      from{
        width: 100%;
      }

      to{
        width: 0%;
      }
    }



    </style>
    <div class="contenedor-toast" id="contenedor-toast">
      
    </div>
        
    `;
  }

  connectedCallback() {
    this.render();

    this._contenedorToast = this.shadowRoot.getElementById("contenedor-toast");
    this._contenedorToast.addEventListener("click", (e) => {
      const elemento = e.target.closest(".toast");
      if (elemento) {
        this.cerrarToast(elemento);
      }
    });

    const handleAnimacionCerrar = (e) => {
      console.log(e.target);
      if (e.animationName === "cierre") {
        e.target.remove();
      }
    };

    this._contenedorToast.addEventListener(
      "animationend",
      handleAnimacionCerrar,
    );

    this.agregarToast("exito");
    this.agregarToast("error");
    this.agregarToast("info");
    this.agregarToast("warning");
  }

  agregarToast(tipo) {
    const nuevoToast = document.createElement("div");
    const toastId = Date.now();
    nuevoToast.classList.add("toast");
    nuevoToast.classList.add(tipo);
    nuevoToast.classList.add("autoCierre");

    const contenidoToast = {
      exito: {
        titulo: "Exito",
        descripcion: "Este es un  mensaje de exito",
        icono: `
        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21.5303 5.46967C21.8232 5.76256 21.8232 6.23744 21.5303 6.53033L9.53033 18.5303C9.23744 18.8232 8.76256 18.8232 8.46967 18.5303L2.46967 12.5303C2.17678 12.2374 2.17678 11.7626 2.46967 11.4697C2.76256 11.1768 3.23744 11.1768 3.53033 11.4697L9 16.9393L20.4697 5.46967C20.7626 5.17678 21.2374 5.17678 21.5303 5.46967Z"
                fill="currentColor"
              ></path>
            </svg>
        `,
      },
      error: {
        titulo: "Error",
        descripcion: "Este es un mensaje de error",
        icono: `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25Z"
                fill="currentColor"
              ></path>
              <path
                d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
                fill="currentColor"
              ></path>
            </svg>`,
      },
      info: {
        titulo: "Info",
        descripcion: "Este es un mensaje de informacion",
        icono: `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25Z"
                fill="currentColor"
              ></path>
              <path
                d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"
                fill="currentColor"
              ></path>
            </svg>`,
      },
      warning: {
        titulo: "Warning",
        descripcion: "Este es un mensaje de warning",
        icono: `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                fill="currentColor"
              ></path>
              <path
                d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.2944 4.47643C9.36631 3.11493 10.5018 2.25 12 2.25C13.4981 2.25 14.6336 3.11493 15.7056 4.47643C16.7598 5.81544 17.8769 7.79622 19.3063 10.3305L19.7418 11.1027C20.9234 13.1976 21.8566 14.8523 22.3468 16.1804C22.8478 17.5376 22.9668 18.7699 22.209 19.8569C21.4736 20.9118 20.2466 21.3434 18.6991 21.5471C17.1576 21.75 15.0845 21.75 12.4248 21.75H11.5752C8.91552 21.75 6.84239 21.75 5.30082 21.5471C3.75331 21.3434 2.52637 20.9118 1.79099 19.8569C1.03318 18.7699 1.15218 17.5376 1.65314 16.1804C2.14334 14.8523 3.07658 13.1977 4.25818 11.1027L4.69361 10.3307C6.123 7.79629 7.24019 5.81547 8.2944 4.47643ZM9.47297 5.40432C8.49896 6.64148 7.43704 8.51988 5.96495 11.1299L5.60129 11.7747C4.37507 13.9488 3.50368 15.4986 3.06034 16.6998C2.6227 17.8855 2.68338 18.5141 3.02148 18.9991C3.38202 19.5163 4.05873 19.8706 5.49659 20.0599C6.92858 20.2484 8.9026 20.25 11.6363 20.25H12.3636C15.0974 20.25 17.0714 20.2484 18.5034 20.0599C19.9412 19.8706 20.6179 19.5163 20.9785 18.9991C21.3166 18.5141 21.3773 17.8855 20.9396 16.6998C20.4963 15.4986 19.6249 13.9488 18.3987 11.7747L18.035 11.1299C16.5629 8.51987 15.501 6.64148 14.527 5.40431C13.562 4.17865 12.8126 3.75 12 3.75C11.1874 3.75 10.4379 4.17865 9.47297 5.40432Z"
                fill="currentColor"
              ></path>
            </svg>`,
      },
    };

    const tipoElegido = contenidoToast[tipo];

    const estructuraToast = `
          <div class="contenido">
            <div class="icono">
              ${tipoElegido.icono}
            </div>

            <div class="texto">
                <p class="titulo">${tipoElegido.titulo}</p>
                <p class="descripcion">${tipoElegido.descripcion}<p/>
            </div>
          </div>

          <button class="btn-cerrar">
            <div class="icono">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.4697 19.5303C18.7626 19.8232 19.2374 19.8232 19.5303 19.5303C19.8232 19.2374 19.8232 18.7626 19.5303 18.4697L13.0607 12L19.5303 5.53033C19.8232 5.23744 19.8232 4.76256 19.5303 4.46967C19.2374 4.17678 18.7626 4.17678 18.4697 4.46967L12 10.9393L5.53033 4.46967C5.23744 4.17678 4.76256 4.17678 4.46967 4.46967C4.17678 4.76256 4.17678 5.23744 4.46967 5.53033L10.9393 12L4.46967 18.4697C4.17678 18.7626 4.17678 19.2374 4.46967 19.5303C4.76256 19.8232 5.23744 19.8232 5.53033 19.5303L12 13.0607L18.4697 19.5303Z"
                fill="currentColor"
              ></path>
            </svg>
            </div>
          </button>
    `;

    nuevoToast.innerHTML = estructuraToast;

    this._contenedorToast.appendChild(nuevoToast);

    setTimeout(() => {
      nuevoToast.classList.add("cerrando");
    }, 5000);
  }

  cerrarToast(elemento) {
    elemento.classList.add("cerrando");
  }
}

customElements.define("notification-toast", NotificationToast);

export default NotificationToast;
