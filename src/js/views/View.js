import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *
   * @param {*} data
   * @param {*} render
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    // NEW DOM

    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElement = Array.from(newDom.querySelectorAll('*'));

    const curElement = Array.from(this._parentEl.querySelectorAll('*'));

    newElement.forEach((el, i) => {
      const curEl = curElement[i];
      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = el.textContent;
      }

      if (!el.isEqualNode(curEl)) {
        Array.from(el.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
           <svg>
             <use href="${icons}#icon-loader"></use>
           </svg>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `<div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
