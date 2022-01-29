import React, { useState } from "react";
import axios from "axios";
import { withAxios } from "react-axios";
import { Link, useHistory } from "react-router-dom";
import "./Login.scss";
import Box from "../components/Box/Box";

const Login = withAxios((props) => {
  const history = useHistory();
  const [error, setError] = useState("");

  return (
    <div className="FormPage">
      <Box className="form">
        <h1>Maxgram</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault(); // Prevent default submission
            console.log(event);
            axios
              .post(process.env.REACT_APP_API_URL + "/login", {
                userID: event.target.userID.value,
                password: event.target.password.value,
              })
              .then((response) => {
                console.log(response);
                for (const key in response.data) {
                  localStorage.setItem(key, response.data[key]);
                }
                history.push("/");
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.errorMessage);
                } else if (error.request) {
                  setError(
                    "We couldn't reach Maxgram. Check your network connection."
                  );
                } else {
                  setError("Something went wrong!");
                }
                // console.log(error)
              });
          }}
        >
          <label for="userID">Username or email</label>
          <input name="userID" placeholder="Username or email" type="text" />
          <label for="password">password</label>
          <input name="password" placeholder="Password" type="password" />
          <button type="submit">Login</button>
          {error ? <p className="error">{error}</p> : null}
        </form>
      </Box>
      <Box className="other-box">
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </Box>
      <Box className="other-box">
        <p>
          Continue as a <Link to="/explore">guest</Link>
        </p>
      </Box>
    </div>
  );
});

export default Login;
