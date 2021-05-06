const { async } = require('q');
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { AJAX } from './helpers.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarkView from './views/bookMarkView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2
// API KEY 247713c3-10e2-4c48-95e2-dfc29aa79652
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    //GET ID
    const id = window.location.hash.slice(1);

    // GUARD CLAUSE
    if (!id) return;

    // RENDER SPINNER
    recipeView.renderSpinner();

    // UPDATE RESULTS VIEW
    resultsView.update(model.getSearchResultsPage());

    // UPDATE BOOKMARK LIST
    bookMarkView.update(model.state.bookmarks);

    // LOAD RECIPE PROMESE
    await model.loadRecipe(id);

    // RENDER RECIPE
    recipeView.render(model.state.recipe);

    //
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    //
    // 1) RENDER SPINER
    resultsView.renderSpinner();

    //
    const query = searchView.query();

    // GUARD CLAUSE

    if (!query) return;
    //

    // SEARCH QUERY PROMISE
    await model.searchRecipe(query);

    // RENDER SEARCH
    resultsView.render(model.getSearchResultsPage(1));

    // RENDER PAGINATION

    paginationView.render(model.state.search);

    //
  } catch (err) {
    console.log(err);
  }
};

const paginationController = function (gotoPage) {
  // RENDER SEARCH
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // RENDER PAGINATION
  paginationView.render(model.state.search);
};

const controllServings = function (newServings) {
  // UPDATE THE SERVINGS
  model.updateServings(newServings);
  // UPDATE THE RECIPE VIEW
  recipeView.update(model.state.recipe);
};

const controllAddBookMark = function () {
  //
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  //
  else model.deleteBookMark(model.state.recipe.id);
  // UPDATE RECIPE VIEW

  recipeView.update(model.state.recipe);

  //

  // RENDER BOOKMARKS
  bookMarkView.render(model.state.bookmarks);
};

const controllBookMark = function () {
  bookMarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    // RENDER SPINNER
    addRecipeView.renderSpinner();
    //
    await model.uploadRecipe(newRecipe);
    // Render Recipe
    recipeView.render(model.state.recipe);
    // Render Success MEssage
    addRecipeView.renderSuccess();

    //Close form window
    setTimeout(function () {
      addRecipeView._closeModal();
    }, MODAL_CLOSE_SEC);

    //RENDER UPLOADED TO BOOKMARK
    bookMarkView.render(model.state.bookmarks);
    // CHANGE THE URL ID
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    //
  } catch (err) {
    addRecipeView.renderError(err);
    console.error(`💥 ${err}`);
  }
};

const newFeature = function () {
  console.log('welcome to application ');
};

const init = function () {
  // BOOKMARKS VIEW HANDLER
  bookMarkView.addHandlerRender(controllBookMark);

  // RECIPE EVENT HANDLER
  recipeView.addHandlerRender(controlRecipe);

  // UPDATE SERVINGS HANDLER
  recipeView.addHandlerUpdateServings(controllServings);

  // SEARCH EVENT HANDLER
  searchView.addHandlerSearch(controlSearch);

  // PAGINATION EVENT HANDLER
  paginationView.addHandlerClick(paginationController);

  // ADD BOOKMARK
  recipeView.addHandlerAddBookMark(controllAddBookMark);

  // UPLOAD RECIPE
  addRecipeView.addHandlerUpload(controlUploadRecipe);

  //
  newFeature();
};
init();
