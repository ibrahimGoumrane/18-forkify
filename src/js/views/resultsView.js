import View from './View.js';
import PriviewView from './previewView.js';

class ResultView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = `no recipes found for your query! please try again ;)`;
    _message = '';
    _generateMarkup() {
        return this._data.map(result => PriviewView.render(result, false)).join('');
    }
}
export default new ResultView();