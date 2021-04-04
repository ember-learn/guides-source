import PageService from 'ember-guides/services/page';

Object.defineProperty(PageService.prototype, 'pages', {
  get() {
    return this._pages;
  },

  set(pages) {
    if (pages) {
      this._pages = pages.filter(page => {
        const pageId = page.id ?? '';

        return !pageId.includes('toc-heading');
      });
    }
  }
});

export function initialize() {}

export default {
  initialize,
};
