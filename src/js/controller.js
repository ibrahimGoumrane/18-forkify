
import 'core-js/stable'; //poly-filling eveything else to make them available in older browsers
import 'regenerator-runtime/runtime.js';//polyfilling async await.
import { async } from 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   //page not reloading the data
//   module.hot.accept();
// }


// the controller is responsible for handling the user interaction and updating the view
// the controller is not responsible for the html code generation
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log('the hash id of the url is : ', id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0-1) update results view to mark  the selected search results 
    resultsView.update(model.getSearchResultsPage());
    // 0-2) Updating bookmark
    bookmarksView.update(model.state.bookmarks);


    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) rendering recipe
    const { recipe } = model.state;
    recipeView.render(recipe);

  } catch (err) {
    console.log(err);
    recipeView.renderError();
  } finally {
    console.log('operation has ended');
  }
}
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get the search results from the input that is currently listenned in the searchview
    const query = searchView.getQuery();
    if (!query) return;
    // 2) load the search results based on the query we got
    await model.loadSearchResults(query);

    // 3) render the search results
    renderSearchResultsPage();

  } catch (err) {
    console.log(err);
  }
}
const renderSearchResultsPage = function (page = 1) {
  // 3) render the search results
  resultsView.render(model.getSearchResultsPage(page));

  // 4) render pagination navigation
  paginationView.render(model.state.search);

}
const controlPagination = function (action) {
  if (action === 'prev') {
    renderSearchResultsPage(model.state.search.page - 1);
  } else {
    renderSearchResultsPage(model.state.search.page + 1);

  }
}
const controlServings = function (newServings) {
  //upadte the recipe serving 
  model.updateServings(newServings);
  //update the recipe view
  const { recipe } = model.state;
  // recipeView.renderrender(recipe);
  recipeView.update(recipe);
}
const controlAddBookmark = function (action) {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe);

  // 2) Update Recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks view
  bookmarksView.render(model.state.bookmarks);
}
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.UploadRecipe(newRecipe);
    //render the new recipe
    recipeView.render(model.state.recipe);

    //display a success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close the form window 
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }
  catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
}
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();