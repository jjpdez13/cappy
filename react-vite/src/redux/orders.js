// react-vite/src/redux/orders.js
import { csrfFetch } from "./csrf";
import { setLoading } from "./session";

/******************************* ACTION TYPES *******************************************/

export const LOAD_ORDERS = "orders/loadOrders";
export const ADD_ORDER = "orders/addOrder";
export const ADD_TO_ORDER = "orders/addToOrder";
export const DELETE_FROM_ORDER = "orders/deleteFromOrder";
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

export const deleteFromOrder = (order) => ({
  type: DELETE_FROM_ORDER,
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
  } finally {
    dispatch(setLoading(false));
  }
};

// Get a sinlge Order
export const getOrder = (orderId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}`);
    if (!res.ok) throw new Error("Failed to fetch order");

    const order = await res.json();
    dispatch(addToOrder(order));
  } catch (e) {
    console.error("Error fetching order", e);
  } finally {
    dispatch(setLoading(false));
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
  } finally {
    dispatch(setLoading(false));
  }
};

// Add Item to an Order
export const addItemToOrder = (orderId, itemId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}`, {
      method: "POST",
      body: JSON.stringify({ item_ids: [itemId] }),
    });

    if (!res.ok) throw new Error("Failed to add item to order");

    const updatedOrder = await res.json();
    dispatch(addToOrder(updatedOrder));
    return updatedOrder;
  } catch (e) {
    console.error("Error adding item to order", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update Items in an Order
export const updateItemQuantity =
  (orderId, itemId, change) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/orders/${orderId}/update-quantity`, {
        method: "POST",
        body: JSON.stringify({ item_id: itemId, change }),
      });

      if (!res.ok) throw new Error("Failed to update item quantity");

      const updatedOrder = await res.json();
      dispatch(addToOrder(updatedOrder));
      return updatedOrder;
    } catch (e) {
      console.error("Error updating item quantity", e);
    } finally {
      dispatch(setLoading(false));
    }
  };

// Remove Items from an Order
export const removeItemsFromOrder = (orderId, itemIds) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}/remove-items`, {
      method: "DELETE",
      body: JSON.stringify({ item_ids: itemIds }),
    });

    if (!res.ok) throw Error("Failed to remove items from order");

    const updatedOrder = await res.json();
    dispatch(deleteFromOrder(updatedOrder));
    return updatedOrder;
  } catch (e) {
    console.error("Error removing items from order", e);
  } finally {
    dispatch(setLoading(false));
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
  } finally {
    dispatch(setLoading(false));
  }
};

// Mark an order as completed (deducts supplies!)
export const completeOrder = (orderId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/orders/${orderId}/complete`, {
      method: "PATCH",
    });

    if (!res.ok) throw Error("Failed to complete order");

    const completedOrder = await res.json();
    dispatch(updateStatus(completedOrder));
    return completedOrder;
  } catch (e) {
    console.error("Error completing order", e);
  } finally {
    dispatch(setLoading(false));
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
  } finally {
    dispatch(setLoading(false));
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

    case DELETE_FROM_ORDER: {
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
