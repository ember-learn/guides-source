import PageService from '../services/page';

Object.defineProperty(PageService.prototype, 'pages', {
  get() {
    return this._pages;
  },

  set(pages) {
    if (pages) {
      this._pages = pages.filter(page => page.id.indexOf('toc-heading') === -1);
    }
  }
});

export default {
  initialize() {}
};
