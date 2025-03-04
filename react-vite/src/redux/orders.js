// react-vite/src/redux/orders.js

import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_ORDERS = "orders/loadOrders";
export const ADD_ORDER = "orders/addOrder";
export const ADD_TO_ORDER = "orders/addToOrder";
export const UPDATE_STATUS = "orders/updateStatus";
export const DELETE_ORDER = "orders/deleteOrder";

/******************************* ACTION CREATORS *******************************************/

export const loadOrders = (orders) => ({
  type: LOAD_ORDERS,
  payload: orders,
});

export const addOrder = (order) => ({
  type: ADD_ORDER,
  payload: order,
});

export const addToOrder = (order) => ({
  type: ADD_TO_ORDER,
  payload: order,
});

export const updateStatus = (order) => ({
  type: UPDATE_STATUS,
  payload: order,
});

export const deleteOrder = (orderId) => ({
  type: DELETE_ORDER,
  payload: orderId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Orders
export const getOrders = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/orders/");
    if (!res.ok) throw Error("Failed to get orders");

    const data = await res.json();
    dispatch(loadOrders(data));
  } catch (e) {
    console.error("Error loading orders", e);
  }
};

// Create a New Order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    if (!res.ok) throw Error("Failed to create order");

    const newOrder = await res.json();
    dispatch(addOrder(newOrder));
    return newOrder;
  } catch (e) {
    console.error("Error creating order", e);
  }
};

// Add Item to an Order
export const addItemToOrder = (orderId, itemId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}`, {
      method: "POST",
      body: JSON.stringify({ item_ids: [itemId] }), 
    });

    if (!res.ok) throw Error("Failed to add item to order");

    const updatedOrder = await res.json();
    dispatch(addToOrder(updatedOrder));
    return updatedOrder;
  } catch (e) {
    console.error("Error adding item to order", e);
  }
};

// Update Order Status (e.g., pending → completed)
export const updateOrder = (orderId, status) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw Error("Failed to update order");

    const updatedOrder = await res.json();
    dispatch(updateStatus(updatedOrder));
    return updatedOrder;
  } catch (e) {
    console.error("Error updating order status", e);
  }
};

// Delete an Order
export const removeOrder = (orderId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw Error("Failed to delete order");

    dispatch(deleteOrder(orderId));
  } catch (e) {
    console.error("Error deleting order", e);
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  orders: {},
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ORDERS: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected array but got:", action.payload);
        return state;
      }

      const ordersObj = action.payload.reduce((acc, order) => {
        acc[order.id] = order;
        return acc;
      }, {});

      return { ...state, orders: ordersObj };
    }

    case ADD_ORDER: {
      return {
        ...state,
        orders: { ...state.orders, [action.payload.id]: action.payload },
      };
    }

    case ADD_TO_ORDER: {
      return {
        ...state,
        orders: { ...state.orders, [action.payload.id]: action.payload },
      };
    }

    case UPDATE_STATUS: {
      return {
        ...state,
        orders: { ...state.orders, [action.payload.id]: action.payload },
      };
    }

    case DELETE_ORDER: {
      const newOrders = { ...state.orders };
      delete newOrders[action.payload];
      return { ...state, orders: newOrders };
    }

    default:
      return state;
  }
};

export default ordersReducer;