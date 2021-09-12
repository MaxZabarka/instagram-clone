import { useState } from "react";
import "./App.css";
import CreatePost from "./components/CreatePost/CreatePost";
import Navbar from "./components/Navigation/Navbar/Navbar";
import Home from "./pages/Home";

function App() {
  const [creatingPost, setCreatingPost] = useState(false);
  return (
    <div className="App">
      <Navbar
        onCreatePost={() => {
          setCreatingPost(true);
          console.log("set true");
        }}
      />
      <Home />
      {creatingPost ? (
        <CreatePost
          onClose={() => {
            setCreatingPost(false);
            console.log("set false");
          }}
        />
      ) : null}
    </div>
  );
}

export default App;
