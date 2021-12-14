import React, { useState } from "react";
import Input from "../components/Input/Input";
import { withAxios } from "react-axios";
import { useHistory } from "react-router-dom";

const Login = withAxios((props) => {
  // const [userID, setUserID] = useState("");
  // const [password, setPassword] = useState("");
  const history = useHistory();

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // Prevent default submission
          props.axios
            .post(process.env.REACT_APP_API_URL + "/login", {
              userID: event.target.userID.value,
              password: event.target.password.value,
            })
            .then((response) => {
              for (const key in response.data) {
                localStorage.setItem(key, response.data[key]);
              }
              history.push("/");
            }).catch((error) => {
              alert(error)
            });
        }}
      >
        <Input name="userID" type="text" />
        <Input name="password" type="password" />
        <input type="submit" value="Login" />
        {/* <button
        // onClick={() => {
        //   props.axios
        //     .post("http://localhost:5000/login", { userID, password })
        //     .then((response) => {
        //       for (const key in response.data) {
        //         localStorage.setItem(key, response.data[key]);
        //       }
        //       history.push("/");
        //     });
        // }}
      // >
      //   login
      // </button> */}
      </form>
    </div>
  );
});

export default Login;
