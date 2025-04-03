import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import usersReducer from "./users";
import menusReducer from "./menus";
import itemsReducer from "./items";
import ordersReducer from "./orders";
import suppliesReducer from "./supplies";
import expensesReducer from "./expenses";

const rootReducer = combineReducers({
  session: sessionReducer,
  users: usersReducer,
  menus: menusReducer,
  items: itemsReducer,
  orders: ordersReducer,
  supplies: suppliesReducer,
  expenses: expensesReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
