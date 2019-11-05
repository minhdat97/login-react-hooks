import React from "react";
import logo from "../logo.svg";
import axios from "axios";
import { AuthContext } from "../App";

export const Login = () => {
  const { dispatch } = React.useContext(AuthContext);
  const initialState = {
    account: "",
    password: "",
    isSubmitting: false,
    errorMessage: null
  };

  const [data, setData] = React.useState(initialState);

  const handleInputChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null
    });
    axios("https://sbx-account.payme.vn/Account/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        account: data.account,
        password: data.password
      })
    })
      .then(res => {
        console.log("res", res);
        if (res.data.code === 1000) {
          return res;
        }
        throw res;
      })
      .then(resJson => {
        console.log("Resjson Login", resJson);
        dispatch({
          type: "LOGIN",
          payload: resJson
        });
      })
      .catch(error => {
        console.log("error", error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error.data.data.message
        });
      });
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <h1>Login</h1>

            <label htmlFor="account">
              Account
              <input
                type="text"
                value={data.account}
                onChange={handleInputChange}
                name="account"
                id="account"
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                value={data.password}
                onChange={handleInputChange}
                name="password"
                id="password"
              />
            </label>

            {data.errorMessage && (
              <span className="form-error">{data.errorMessage}</span>
            )}

            <button disabled={data.isSubmitting}>
              {data.isSubmitting ? (
                <img className="spinner" src={logo} alt="loading icon" />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
