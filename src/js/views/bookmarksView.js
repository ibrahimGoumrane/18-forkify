import View from './View.js';
import PriviewView from './previewView.js';



class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = `no bookmarks yet fin a nice recipe and bookmark it ;)`;
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
    _generateMarkup() {
        return this._data.map(bookmark => PriviewView.render(bookmark, false)).join('');
    }
}
export default new BookmarksView();