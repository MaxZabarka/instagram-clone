import { useRef, useState, useEffect } from "react";
import "./App.css";
import "./Page.scss";
import CreatePost from "./components/CreatePost/CreatePost";
import Navbar from "./components/Navigation/Navbar/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import Login from "./pages/Login";
import Modal from "./components/Modal/Modal";
import "./normalize.css";
import PostPage from "./pages/PostPage";
import User from "./pages/User";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Saved from "./pages/Saved";
require("dotenv").config();
console.log(`process.env`, process.env);

function App() {
  const [files, setFiles] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [processProgress, setProcessProgress] = useState(null);
  const [currentProgressImage, setCurrentProgressImage] = useState(null);

  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        setUploadProgress(null);
        setProcessProgress(null);
      }
    }
  }, []);

  const inputRef = useRef(null);
  console.log(`modalMessage`, modalMessage);
  return (
    <Router>
      <div className="App">
        <Modal
          show={modalMessage}
          options={[
            {
              text: "OK",
              type: "primary",
              action: () => {
                setModalMessage("");
              },
            },
          ]}
          onClose={() => {
            setModalMessage("");
          }}
          title="Could not create post"
          message={modalMessage}
        />
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          runOnMount={true}
        >
          <Route exact path="/">
            <Navbar
              page="home"
              onCreatePost={() => {
                inputRef.current.click();
              }}
            />
            <Home
              currentProgressImage={currentProgressImage}
              uploadProgress={uploadProgress}
              processProgress={processProgress}
            />
          </Route>
          <Route exact path="/explore">
            <Navbar
              page="explore"
              onCreatePost={() => {
                inputRef.current.click();
              }}
            />
            <Explore/>
          </Route>
          <Route exact path="/saved">
            <Navbar
              page="explore"
              onCreatePost={() => {
                inputRef.current.click();
              }}
            />
            <Saved/>
          </Route>
          <Route
            path="/posts/:postId"
            render={(props) => (
              <>
                <Navbar
                  onCreatePost={() => {
                    inputRef.current.click();
                  }}
                />
                <PostPage {...props} />
              </>
            )}
          />
          <Route
            path="/users/:username"
            render={(props) => (
              <>
                <Navbar
                  onCreatePost={() => {
                    inputRef.current.click();
                  }}
                />
                <User {...props} />
              </>
            )}
          />

          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </AnimatedSwitch>

        {files ? (
          <CreatePost
            files={files}
            onUploadProgressChange={(progress, image) => {
              setUploadProgress(progress);
              setCurrentProgressImage(image);
            }}
            onProcessProgressChange={(progress, image) => {
              console.log(`progress`, progress);
              setProcessProgress(progress);
              setCurrentProgressImage(image);
            }}
            onClose={() => {
              setFiles([]);
            }}
          />
        ) : null}
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
          accept=".jpg,.png,.jpeg"
          multiple
          onChange={() => {
            setUploadProgress(null);
            setProcessProgress(null);
            if (inputRef.current.files.length > 10) {
              setModalMessage("Please select less than 10 images");
            } else {
              setFiles([...inputRef.current.files]);
            }
            inputRef.current.value = null;
          }}
        />
      </div>
      {/* </UserContext.Provider> */}
    </Router>
  );
}

export default App;
