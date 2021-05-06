import View from './View.js';

class addRecipeView extends View {
  _successMessage = 'Recipe was successfully uploaded';
  _parentEl = document.querySelector('.upload');
  _addRecipeButton = document.querySelector('.nav__btn--add-recipe');
  _modalClose = document.querySelector('.btn--close-modal');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();
    this._addRecipeButton.addEventListener('click', this._openModal.bind(this));
    this._modalClose.addEventListener('click', this._closeModal.bind(this));
  }

  _openModal() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _closeModal() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new addRecipeView();
