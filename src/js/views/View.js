// import icons from '../img/icons.svg' ; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2 :for any static files .
console.log(icons);
export default class View {
  _data;
  /**
   * Render the received Object to the DOM
   * @param {Object | Object[]} data  the data to be rendered (receipe)
   * @param {boolean} [render=true] if false ,create markup string instead of rendering to the DOM
   * @returns {undefined | string } A markup string is returned if the render=false
   * @this {Object} View instance
   * @author Ibrahim gumrane
   * @todo finish implementation 
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data?.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data?.length === 0)) return;
    this._data = data;

    //generate new markup

    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);

    //selecting old and new elements
    const oldEle = Array.from(this._parentElement.querySelectorAll('*'));
    const curEle = Array.from(newDom.querySelectorAll('*'));
    //comparing both old and new elements
    curEle.forEach((newEle, index) => {
      const elements = oldEle[index]

      //update changed text
      if (
        !newEle.isEqualNode(elements)
        && newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        elements.textContent = newEle.textContent;
      }
      //update changed attributes
      if (
        !newEle.isEqualNode(elements)
      ) {
        [...newEle.attributes].forEach((attr) => {
          elements.setAttribute(attr.name, attr.value);
        })
      }
    })
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner = function () {
    const markup = `
          <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="recipe">
          <div class="message">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

}