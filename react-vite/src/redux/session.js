// session.js
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_LOADING = 'session/setLoading';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

export const thunkAuthenticate = () => async (dispatch) => {
  dispatch(setLoading(true));
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (!data.errors) {
      dispatch(setUser(data));
    }
  }
  dispatch(setLoading(false));
};

export const thunkLogin = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    dispatch(setLoading(false));
    return errorMessages;
  } else {
    dispatch(setLoading(false));
    return { server: "Something went wrong. Please try again" };
  }
  dispatch(setLoading(false));
};

export const thunkSignup = (user) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      dispatch(setLoading(false));
      return null;
    } 

    if (response.status < 500) {
      const errorResponse = await response.json();
      dispatch(setLoading(false));
      return errorResponse.errors || errorResponse;
    } 

    dispatch(setLoading(false));
    return { server: "Something went wrong. Please try again" };
  
  } catch (error) {
    console.error("Signup failed:", error);
    dispatch(setLoading(false));
    return { server: "Network error. Please try again later." };
  }
};

export const thunkLogout = () => async (dispatch) => {
  dispatch(setLoading(true));
  await fetch("/api/auth/logout");
  dispatch(removeUser());
  dispatch(setLoading(false));
};

const initialState = { 
  user: null,
  loading: false
};

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export default sessionReducer;