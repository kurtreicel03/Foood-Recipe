import View from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  query() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInputs();
    return query;
  }

  _clearInputs() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
