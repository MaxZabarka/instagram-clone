import { useRef, useState, useEffect } from "react";
import "./App.css";
import CreatePost from "./components/CreatePost/CreatePost";
import Navbar from "./components/Navigation/Navbar/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Modal from "./components/Modal/Modal";
import "./normalize.css"
require('dotenv').config();
console.log(`process.env`, process.env)

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
        <Switch>
          <Route exact path="/">
            <Navbar
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
          <Route path="/login">
            <Login />
          </Route>
        </Switch>

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
