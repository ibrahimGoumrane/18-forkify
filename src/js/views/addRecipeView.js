import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2 :for any static files .




class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully added to the api';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }
    _generateMarkup() {

    }
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }
    addHandlerUpload(Uploadcontroller) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = [...new FormData(this)];
            const dataObj = Object.fromEntries(data);
            Uploadcontroller(dataObj);
        })
    }
}
export default new AddRecipeView();