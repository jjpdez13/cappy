// react-vite/src/redux/menus.js
import { csrfFetch } from "./csrf";
import { setLoading } from "./session";

/******************************* ACTION TYPES *******************************************/

export const LOAD_SUPPLIES = "supplies/loadSupplies";
export const ADD_SUPPLY_ITEM = "supplies/addSupplyItem";
export const UPDATE_SUPPLY_ITEM = "supplies/updateSupplyItem";
export const DELETE_SUPPLY_ITEM = "supplies/deleteSupplyItem";

/******************************* ACTION CREATORS *******************************************/

export const loadSupplies = (supplies) => ({
  type: LOAD_SUPPLIES,
  payload: supplies,
});

export const addSupplyItem = (supplyItem) => ({
  type: ADD_SUPPLY_ITEM,
  payload: supplyItem,
});

export const updateSupplyItem = (supplyItem) => ({
  type: UPDATE_SUPPLY_ITEM,
  payload: supplyItem,
});

export const deleteSupplyItem = (supplyItemId) => ({
  type: DELETE_SUPPLY_ITEM,
  payload: supplyItemId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Supplies
export const getSupplies = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/supplies/");
    if (!res.ok) throw Error("Failed to get supplies");
    const data = await res.json();
    dispatch(loadSupplies(data));
  } catch (e) {
    console.error("Error loading supplies", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a Supply Item
export const createMenu = (supplyData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/supplies/", {
      method: "POST",
      body: JSON.stringify(supplyData),
    });

    if (!res.ok) throw Error("Failed to create supply item");

    const newSupplyItem = await res.json();
    dispatch(addMenu(newSupplyItem));
    return newSupplyItem;
  } catch (e) {
    console.error("Error creating supply item", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an existing Supply Item
export const editMenu = (supplyItemId, supplyData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/supplies/${supplyItemId}`, {
      method: "PUT",
      body: JSON.stringify(supplyData),
    });

    if (!res.ok) throw Error("Failed to update supplies");

    const updatedSupplies = await res.json();
    dispatch(updateMenu(updatedSupplies));
    return updatedSupplies;
  } catch (e) {
    console.error("Error updating supplies", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a Supply
export const removeSupplyItem = (supplyItemId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/supplies/${supplyItemId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw Error("Failed to delete supply item");

    dispatch(deleteSupplyItem(supplyItemId));
  } catch (e) {
    console.error("Error deleting item", e);
  } finally {
    dispatch(setLoading(false));
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  supplies: {},
};
const suppliesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SUPPLIES: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected array but got:", action.payload);
        return state;
      }

      const suppliesObj = action.payload.reduce((acc, supplyItem) => {
        acc[supply.id] = supplyItem;
        return acc;
      }, {});

      return { ...state, supplies: suppliesObj };
    }

    case ADD_SUPPLY_ITEM: {
      return {
        ...state,
        supplies: { ...state.supplies, [action.payload.id]: action.payload },
      };
    }

    case UPDATE_SUPPLY_ITEM: {
      return {
        ...state,
        supplies: { ...state.supplies, [action.payload.id]: action.payload },
      };
    }

    case DELETE_SUPPLY_ITEM: {
      const newSupplies = { ...state.supplies };
      delete newSupplies[action.payload];
      return { ...state, supplies: newSupplies };
    }

    default:
      return state;
  }
};

export default suppliesReducer;
