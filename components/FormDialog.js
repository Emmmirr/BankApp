class FormDialog extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
    }

    render() {

        const btnText = this.getAttribute('btn-text') || 'Guardar';


        this.shadowRoot.innerHTML =
            `

        <style>

        *{
            margin : 0;
            padding: 0;
            box-sizing: border-box;
        }



            dialog {
                border: none;
                border-radius: 10px;
                height: 800px;
                width: 600px;
                margin: auto;

                &::backdrop {
                    backdrop-filter: blur(5px);
                }
            }


                        .dialogoContainer {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 25px;
                height: 100%;
                padding: 20px;

                form {
                    width: 100%;
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
            }


            .button-form-section {
                display: flex;
                margin-top: auto;
                width: 100%;
                justify-content: center;
                gap: 20px;
            }

            .btn-general {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 24px;
                line-height: 24px;
                border-radius: 5px;
                min-width: 110px;

                &:hover {
                    cursor: pointer;
                }
            }
        
        </style>
        <dialog id="miDialogo">
        <div class="dialogoContainer">

            <slot>
            
            </slot>

            <div class="button-form-section">
                <button class="btn-general" type="submit" id="boton-guardar">${btnText}</button>

                <button class="btn-general" id="cerrar" data-accion="cerrar">Cerrar</button>
            </div>
        </div>
        </dialog>
        `
    }

    connectedCallback() {
        this.render();

        setTimeout(() => {
            let dialog = this.shadowRoot.getElementById('miDialogo');
            let btn = this.shadowRoot.querySelector('#cerrar')
            let btnGuardar = this.shadowRoot.querySelector('#boton-guardar')


            this.dispatchEvent(new CustomEvent('open-modal', {
                bubbles: true,
                composed: true,
                detail: {
                    value: dialog,
                    boton: btn
                }
            }));

            btnGuardar.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('click-guardar', {
                    bubbles: true,
                    composed: true,
                }));
            });
        }, 0);
    }

    static get observedAttributes() {
        return ['btn-text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue) return;

        let btnGuardar = this.shadowRoot.querySelector('#boton-guardar');

        if (btnGuardar) {
            btnGuardar.textContent = this.getAttribute('btn-text');
        }
    }
}


customElements.define("form-dialog", FormDialog)

export default FormDialog;

