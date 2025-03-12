// react-vite/src/redux/menus.js
import { csrfFetch } from "./csrf";
import { setLoading } from "./session";

/******************************* ACTION TYPES *******************************************/

export const LOAD_MENUS = "menus/loadMenus";
export const ADD_MENU = "menus/addMenu";
export const UPDATE_MENU = "menus/updateMenu";
export const DELETE_MENU = "menus/deleteMenu";

/******************************* ACTION CREATORS *******************************************/

export const loadMenus = (menus) => ({
  type: LOAD_MENUS,
  payload: menus,
});

export const addMenu = (menu) => ({
  type: ADD_MENU,
  payload: menu,
});

export const updateMenu = (menu) => ({
  type: UPDATE_MENU,
  payload: menu,
});

export const deleteMenu = (menuId) => ({
  type: DELETE_MENU,
  payload: menuId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Menus
export const getMenus = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/menus/");
    if (!res.ok) throw Error("Failed to get menus");
    const data = await res.json();
    dispatch(loadMenus(data));
  } catch (e) {
    console.error("Error loading menus", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a Menu
export const createMenu = (menuData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/menus/", {
      method: "POST",
      body: JSON.stringify(menuData),
    });

    if (!res.ok) throw Error("Failed to create menu");

    const newMenu = await res.json();
    dispatch(addMenu(newMenu));
    return newMenu;
  } catch (e) {
    console.error("Error creating menu", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an existing Menu
export const editMenu = (menuId, menuData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/menus/${menuId}`, {
      method: "PUT",
      body: JSON.stringify(menuData),
    });

    if (!res.ok) throw Error("Failed to update menu");

    const updatedMenu = await res.json();
    dispatch(updateMenu(updatedMenu));
    return updatedMenu;
  } catch (e) {
    console.error("Error updating menu", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a Menu
export const removeMenu = (menuId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/menus/${menuId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw Error("Failed to delete menu");

    dispatch(deleteMenu(menuId));
  } catch (e) {
    console.error("Error deleting menu", e);
  } finally {
    dispatch(setLoading(false));
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  menus: {},
};
const menusReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MENUS: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected array but got:", action.payload);
        return state;
      }

      const menusObj = action.payload.reduce((acc, menu) => {
        acc[menu.id] = menu;
        return acc;
      }, {});

      return { ...state, menus: menusObj };
    }

    case ADD_MENU: {
      return {
        ...state,
        menus: { ...state.menus, [action.payload.id]: action.payload },
      };
    }

    case UPDATE_MENU: {
      return {
        ...state,
        menus: { ...state.menus, [action.payload.id]: action.payload },
      };
    }

    case DELETE_MENU: {
      const newMenus = { ...state.menus };
      delete newMenus[action.payload];
      return { ...state, menus: newMenus };
    }

    default:
      return state;
  }
};

export default menusReducer;
