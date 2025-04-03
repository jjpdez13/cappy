// react-vite/src/redux/expenses.js
import { csrfFetch } from "./csrf";
import { setLoading } from "./session";

/******************************* ACTION TYPES *******************************************/

export const LOAD_EXPENSES = "expenses/loadExpenses";
export const ADD_EXPENSE = "expenses/addExpense";
export const UPDATE_EXPENSE = "expenses/updateExpense";
export const DELETE_EXPENSE = "expenses/deleteExpense";

/******************************* ACTION CREATORS *******************************************/

export const loadExpenses = (expenses) => ({
  type: LOAD_EXPENSES,
  payload: expenses,
});

export const addExpense = (expense) => ({
  type: ADD_EXPENSE,
  payload: expense,
});

export const updateExpense = (expense) => ({
  type: UPDATE_EXPENSE,
  payload: expense,
});

export const deleteExpense = (expenseId) => ({
  type: DELETE_EXPENSE,
  payload: expenseId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Expenses
export const getExpenses = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch("/api/expenses/");
    if (!res.ok) throw new Error("Failed to get expenses");
    const data = await res.json();
    dispatch(loadExpenses(data));
  } catch (e) {
    console.error("Error loading expenses", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add an Expense
export const createExpense = (expenseData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch("/api/expenses/", {
      method: "POST",
      body: JSON.stringify(expenseData),
    });

    if (!res.ok) throw new Error("Failed to create expense");

    const newExpense = await res.json();
    dispatch(addExpense(newExpense));
    return newExpense;
  } catch (e) {
    console.error("Error creating expense", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an Expense
export const editExpense = (expenseId, expenseData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch(`/api/expenses/${expenseId}`, {
      method: "PUT",
      body: JSON.stringify(expenseData),
    });

    if (!res.ok) throw new Error("Failed to update expense");

    const updatedExpense = await res.json();
    dispatch(updateExpense(updatedExpense));
    return updatedExpense;
  } catch (e) {
    console.error("Error updating expense", e);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete an Expense with SpongeBob's password
export const removeExpense = (expenseId, spongebobPassword) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch(`/api/expenses/${expenseId}`, {
      method: "DELETE",
      body: JSON.stringify({ spongebob_password: spongebobPassword }),
    });

    if (!res.ok) throw new Error("Failed to delete expense");

    dispatch(deleteExpense(expenseId));
  } catch (e) {
    console.error("Error deleting expense", e);
  } finally {
    dispatch(setLoading(false));
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  expenses: {},
};

const expensesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EXPENSES: {
      if (!Array.isArray(action.payload)) {
        console.error("Expected array but got:", action.payload);
        return state;
      }

      const expensesObj = action.payload.reduce((acc, expense) => {
        acc[expense.id] = expense;
        return acc;
      }, {});

      return { ...state, expenses: expensesObj };
    }

    case ADD_EXPENSE: {
      return {
        ...state,
        expenses: { ...state.expenses, [action.payload.id]: action.payload },
      };
    }

    case UPDATE_EXPENSE: {
      return {
        ...state,
        expenses: { ...state.expenses, [action.payload.id]: action.payload },
      };
    }

    case DELETE_EXPENSE: {
      const newExpenses = { ...state.expenses };
      delete newExpenses[action.payload];
      return { ...state, expenses: newExpenses };
    }

    default:
      return state;
  }
};

export default expensesReducer;