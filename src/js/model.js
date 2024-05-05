// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { API_URL, KEY } from './config.js';
import { RES_PER_PAGE } from './config.js';
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        pages: 0,
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
}
const createRecipeObject = (data) => {
    //destructing objects
    let { data: { recipe: recipeData } } = data;

    //reformate data
    return {
        id: recipeData.id,
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        sourceUrl: recipeData.source_url,
        publisher: recipeData.publisher,
        image: recipeData.image_url,
        servings: recipeData.servings,
        cookingTime: recipeData.cooking_time,
        ...(recipeData.key && { key: recipeData.key }),
    }

}
export const loadRecipe = async function loadRecipe(id) {
    try {
        const url = API_URL.concat(`/${id}?key=${KEY}`);
        const data = await AJAX(url);
        state.recipe = createRecipeObject(data)


        if (state.bookmarks.some(b => b.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        throw err;
    }


}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${state.search.query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        })
        _calcSearchResultsPages()
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
}
const _calcSearchResultsPages = function () {
    let pages = Math.ceil(state.search.results.length / state.search.resultsPerPage);
    if (state.search.results.length - state.search.resultsPerPage * pages > 0) {
        pages++;
    }
    state.search.pages = pages;
}
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const resultsPerPage = state.search.resultsPerPage;
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    return state.search.results.slice(start, end);
}
export const updateServings = function (servNum = 1) {
    state.recipe.ingredients?.forEach(ing =>
        ing.quantity *= servNum / state.recipe.servings);
    state.recipe.servings = servNum;
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const addBookMark = function (recipe) {
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookMark = function (id) {
    const index = state.bookmarks.findIndex((ele) => ele.id === id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
}
const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}
const clearBookMarks = function () {
    localStorage.removeItem('bookmarks');
}
// clearBookMarks();
init();

export const UploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(ing => ing[0].startsWith('ingredient') && ing[1].trim() !== '')
            .map((ing) => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3) {
                    throw new Error('Each ingredient should be in the format of: <quantity> <unit> <description>')
                }
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : '',
                    unit: unit ? unit : '',
                    description: description ? description : '',
                }
            });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            image_url: newRecipe.image,
            servings: newRecipe.servings,
            cooking_time: newRecipe.cookingTime,
            ingredients,
        }
        const data = await AJAX(`${API_URL}/?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookMark(state.recipe);
    } catch (err) {
        throw err;
    }
}