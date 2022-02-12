import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Box from "../components/Box/Box";
import "./Register.scss";
import validator from "validator";
import { Link } from "react-router-dom";
import axios from "axios";
import StrengthMeter from "../components/StrengthMeter/StrengthMeter";
import zxcvbn from "zxcvbn";


const Register = () => {
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [allValid, setAllValid] = useState(false);
  const validateUsername = async () => {
    const errors = [];
    if (
      !validator.isAlphanumeric(username, "en-US", { ignore: "._" }) &&
      username
    ) {
      errors.push(
        "Usernames can only use letters, numbers, underscores and periods."
      );
    }
    if (!validator.isLength(username, { min: 3, max: 15 })) {
      errors.push("Usernames must be between 3-15 characters.");
    }
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/exists",
      {
        username: username,
      }
    );

    if (response.data.exists) {
      errors.push(
        <>
          Username already registered. <Link to="/login">Log in?</Link>
        </>
      );
    }
    console.log("errors", errors);
    return errors;
  };

  const validateEmail = async () => {
    const errors = [];
    const normalizedEmail = validator.normalizeEmail(email);
    if (!validator.isEmail(normalizedEmail)) {
      errors.push("Please enter a valid email.");
    }
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/exists",
      {
        email: normalizedEmail,
      }
    );

    if (response.data.exists) {
      errors.push(
        <>
          Email already registered. <Link to="/login">Log in?</Link>
        </>
      );
    }
    return errors;
  };

  const validatePassword = () => {
    const errors = [];
    if (!validator.isLength(password, { min: 8, max: undefined })) {
      errors.push("Passwords must be at least 8 characters.");
    }
    return errors;
  };

  const validateConfirmPassword = () => {
    const errors = [];
    if (confirmPassword !== password) {
      errors.push("Passwords do not match.");
    }
    return errors;
  };

  const history = useHistory()

  useEffect(() => {
    const validate = async () => {
      const usernameErrors = await validateUsername();
      const emailErrors = await validateEmail();
      const passwordErrors = validatePassword();
      const confirmPasswordErrors = validateConfirmPassword();
      if (
        usernameErrors.length ||
        emailErrors.length ||
        passwordErrors.length ||
        confirmPasswordErrors.length
      ) {
        setAllValid(false);
      } else {
        setAllValid(true);
      }
    };
    validate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, email, password, confirmPassword]);

  useEffect(() => {
    setConfirmPasswordErrors(validateConfirmPassword());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword]);

  return (
    <div className="FormPage">
      <Box className="form">
        <h1>Maxgram</h1>
        <h2>Sign up to see photos and videos from your friends.</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const usernameErrors = await validateUsername();
            const emailErrors = await validateEmail();
            const passwordErrors = validatePassword();
            const confirmPasswordErrors = validateConfirmPassword();
            setUsernameErrors(usernameErrors);
            setEmailErrors(emailErrors);
            setPasswordErrors(passwordErrors);
            setConfirmPasswordErrors(confirmPasswordErrors);

            if (
              usernameErrors.length ||
              emailErrors.length ||
              passwordErrors.length ||
              confirmPasswordErrors.length
            ) {
              console.log("check failed");
            } else {
              axios
                .post(process.env.REACT_APP_API_URL + "/register", {
                  username,
                  password,
                  email,
                })
                .then((response) => {
                  localStorage.setItem("token", response.data.token)
                  localStorage.setItem("username", response.data.username)
                  history.push("/")
                });
            }
          }}
        >
          <label for="username">Username</label>
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onBlur={async () => {
              console.log("usernameErrors", usernameErrors);
              setUsernameErrors(await validateUsername());
            }}
            name="username"
            placeholder="Username"
            type="text"
          />
          {usernameErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="email">Email</label>
          <input
            novalidate
            onBlur={async () => {
              setEmailErrors(await validateEmail());
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            placeholder="Email"
            type="email"
          />
          {emailErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="password">Password</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onBlur={(e) => {
              setPasswordErrors(validatePassword());
            }}
            name="password"
            placeholder="Password"
            type="password"
          />
          {password ? (
            <StrengthMeter strength={zxcvbn(password).score} />
          ) : null}

          {passwordErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="confirm-password">Confirm password</label>
          <input
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            name="confirm-password"
            placeholder="Confirm password"
            type="password"
          />
          {confirmPasswordErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <button disabled={!allValid} type="submit">
            Sign up
          </button>
          <p className="warning">This website is is not maintained or updated and therefore may not be up to current security standards. <b>Do not enter sensitive information here.</b></p>

        </form>
      </Box>{" "}
      <Box className="other-box">
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Box>
      <Box className="other-box">
        <p>
          Continue as a <Link to="/explore">guest</Link>
        </p>
      </Box>
    </div>
  );
};

export default Register;
