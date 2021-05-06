import previewView from './previewView';
import View from './View.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your search. Please try again!';
  _successMessage = '';

  _generateMarkup() {
    const data = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    return data;
  }
}

export default new ResultsView();
