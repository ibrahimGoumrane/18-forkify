import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2 :for any static files .




class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    addHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            btn.classList.contains('pagination__btn--next') ? handler('next') : handler('prev');
        });
    }

    _generateMarkup() {
        const numPages = this._data.pages;
        const currPage = this._data.page;


        //page 1 , and there are other pages
        if (currPage === 1 && numPages > 1) {
            return this._generatenextmarkup(currPage);
        }
        //last page
        if (currPage === numPages && numPages > 1) {
            return this._generateprevmarkup(currPage);
        }
        //  other pages
        if (currPage < numPages) {
            return this._generateprevmarkup(currPage).concat(this._generatenextmarkup(currPage));
        }
        //page 1 , and there are no other pages
        return '';
    }
    _generatenextmarkup(currPage) {
        return `<button class="btn--inline pagination__btn--next">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                    <span>Page ${currPage + 1}</span>
                </button>`
    }
    _generateprevmarkup(currPage) {
        return `<button class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>`;
    }
}

export default new PaginationView();