class PageHeader extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    render() {

        const title = this.getAttribute('title') ?? 'Sin titulo';
        this.shadowRoot.innerHTML = `

        <style>
        .page-header {
        padding: 10px;
        height: 20px;

            h1 {
                font-weight: 600;
            }
        }   

        </style>

        <div class="page-header">
            <h1>${title}</h1>
            <small>
                <slot></slot>
            </small>
        </div>
        
        `
    }

    connectedCallback() {
        this.render()
    }


}


customElements.define("page-header", PageHeader)

export default PageHeader;