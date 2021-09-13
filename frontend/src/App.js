import { useRef, useState } from "react";
import "./App.css";
import CreatePost from "./components/CreatePost/CreatePost";
import Navbar from "./components/Navigation/Navbar/Navbar";
import UserContext from "./contexts/UserContext";
import Home from "./pages/Home";

const user = {
  avatarUrl: "https://picsum.photos/200/200"
}

function App() {
  // const [creatingPost, setCreatingPost] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  return (
    <UserContext.Provider value={user}>
    <div className="App">
        <Navbar
          onCreatePost={() => {
            inputRef.current.click();
          }}
        />
        <Home />
        {files ? (
          <CreatePost
            files={files}
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
            setFiles([...inputRef.current.files]);
            inputRef.current.value = null;
          }}
        />
    </div>
    </UserContext.Provider>
  );
}

export default App;
