const content = `

<style>
.cta {
  background-color: #FFFAD6;
  background-color: var(--color-yellow-light);
  border-radius: 0.625rem;
  border-radius: var(--radius-lg);
  margin: 0.5rem auto;
  margin: var(--spacing-1) auto;
  max-width: 90%;
  position: relative;
  overflow: hidden;
}
.cta .cta-note {
  display: flex;
  justify-content: space-between;
}
.cta-note .cta-note-body {
  padding: 1rem;
  padding: var(--spacing-2);
  padding-left: 2.5rem;
  padding-left: var(--spacing-4);
}
.cta-note .cta-note-heading {
  font-size: 1.1875rem;
  font-size: var(--font-size-lg);
  font-weight: 600;
  font-weight: var(--font-weight-3);
  line-height: calc(24 / 19);
  line-height: var(--line-height-lg);
  margin-bottom: 0.5rem;
  margin-bottom: var(--spacing-1);
}
.cta-note img {
  margin: 1rem;
  margin: var(--spacing-2);
  transform: rotate(15deg);
  -o-object-fit: contain;
     object-fit: contain;
}
.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0px;
  height: 0px;
  border-radius: 0 0 0.625rem 0;
  border-radius: 0 0 var(--radius-lg) 0;
  border-width: 16px;
  border-color: #f4f6f8 #FFEC64 #FFEC64 #f4f6f8;
  border-color: var(--color-gray-100) var(--color-yellow) var(--color-yellow) var(--color-gray-100);
  border-style: solid;
}
@media only percy {
  .cta-note .cta-note-heading,
  .cta-note img {
    visibility: hidden;
  }
}
</style>

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
  }
}
