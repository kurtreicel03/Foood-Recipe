import 'regenerator-runtime/runtime';
import { AJAX } from './helpers.js';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    source: recipe.source_url,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const { recipes } = data.data;

    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = state.recipe.servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // ADD RECIPE TO BOOKMARKS ARRAY
  state.bookmarks.push(recipe);
  // MARK CURRENT RECIPE AS BOOKMARKED
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookMark = function (id) {
  // DELETE BOOKMARK
  const index = state.bookmarks.findIndex(bm => bm.id === id);
  state.bookmarks.splice(index, 1);
  // MARK CURRENT  RECIPE AS NOT BOOKMARK
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArray = entry[1].split(',').map(ing => ing.trim());
        if (ingArray.length !== 3) {
          throw new Error('Wrong Ingredient, Please use the corect format');
        }
        const [quantity, unit, description] = ingArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };

// clearBookmarks();
