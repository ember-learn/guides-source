const content = `

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <slot>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
`;

export default class ZoeySays extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = content;
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      shadow.appendChild(link.cloneNode(true));
    });
  }
}
