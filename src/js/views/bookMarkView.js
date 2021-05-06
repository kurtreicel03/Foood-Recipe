import previewView from './previewView.js';
import View from './View.js';

class BookMarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet! find a nice recipe and bookmark it.';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const data = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    return data;
  }
}

export default new BookMarksView();
