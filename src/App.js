import React from "react";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  // user: null,
  token: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //localStorage.setItem("user", JSON.stringify(action.payload.user));
      action.payload.token
        ? localStorage.setItem("token", JSON.stringify(action.payload.token))
        : localStorage.setItem(
            "token",
            JSON.stringify(action.payload.data.data.accessToken)
          );
      return {
        ...state,
        isAuthenticated: true,
        // user: action.payload.user,
        token: action.payload.token
          ? action.payload.token
          : action.payload.data.data.accessToken
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false
        // user: null
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'))
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      dispatch({
        type: "LOGIN",
        payload: {
          token
        }
      });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Header />
      <div className="App">{!state.isAuthenticated ? <Login /> : <Home />}</div>
    </AuthContext.Provider>
  );
}

export default App;
