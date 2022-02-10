import React, { useEffect, useState } from "react";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import PostGrid from "../components/PostGrid/PostGrid";
import Spinner from "../components/Spinner/Spinner";
import axios from "axios";
import { Link } from "react-router-dom";
import Box from "../components/Box/Box";
import "./Saved.scss";

const Saved = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/saved", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          if (error.response.status === 404) {
            setError({
              message:
                "The link you followed may be broken, or the page may have been removed.",
              title: "Sorry, this page isn't available.",
            });
          } else {
            setError({
              title: null,
              message: error.response.errorMessage,
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError({
            message: "Check your network connection.",
            title: "We couldn't reach maxgram.",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          setError({
            message: "Please try again.",
            title: null,
          });
        }
      });
  }, []);

  let main;
  if (error) {
    main = <ErrorBox errorTitle={error.title} errorMessage={error.message} />;
  } else if (response) {
    main =
      response.length > 0 ? (
        <PostGrid posts={response} />
      ) : (
        <Box className="Saved empty">
          <h2>You don't have any posts saved. </h2>
          <Link to="/explore">Go save some!</Link>
        </Box>
      );
  } else {
    main = <Spinner />;
  }
  return <div className="Page">{main}</div>;
};

export default Saved;
