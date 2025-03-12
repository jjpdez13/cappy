// react-vite/src/redux/items.js
import { csrfFetch } from "./csrf";
import { setLoading } from "./session";

/******************************* ACTION TYPES *******************************************/

export const LOAD_ITEMS = "items/loadItems";
export const ADD_ITEM = "items/addItem";
export const DELETE_ITEM = "items/deleteItem";

/******************************* ACTION CREATORS *******************************************/

export const loadItems = (items) => ({
  type: LOAD_ITEMS,
  payload: items,
});

export const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item,
});

export const deleteItem = (itemId) => ({
  type: DELETE_ITEM,
  payload: itemId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Items
export const getItems = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/menu-items/");

    if (!res.ok) throw Error("Failed to get items");

    const data = await res.json();
    dispatch(loadItems(data));
  } catch (e) {
    console.error("Error loading items", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a Item
export const createItem = (itemData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/menu-items/", {
      method: "POST",
      body: JSON.stringify(itemData),
    });

    if (!res.ok) throw Error("Failed to create item");

    const newItem = await res.json();
    dispatch(addItem(newItem));
    return newItem;
  } catch (e) {
    console.error("Error creating item", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete an Item
export const removeItem = (itemId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/items/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw Error("Failed to delete item");

    dispatch(deleteItem(itemId));
  } catch (e) {
    console.error("Error deleting item", e);
  } finally {
    dispatch(setLoading(false));
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  items: {},
};
const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected array but got:", action.payload);
        return state;
      }

      const itemsObj = action.payload.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      return { ...state, items: itemsObj };
    }

    case ADD_ITEM: {
      return {
        ...state,
        items: { ...state.items, [action.payload.id]: action.payload },
      };
    }

    case DELETE_ITEM: {
      const newItems = { ...state.items };
      delete newItems[action.payload];
      return { ...state, items: newItems };
    }

    default:
      return state;
  }
};

export default itemsReducer;
