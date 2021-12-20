import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import Icon from "../../Icon/Icon";
import "./Navbar.scss";


const Navbar = (props) => {
  return (
    <>
      <div className="Navbar">
        <div className="wrapper">
          <div className="brand">
          <Link to="/"><h1>Maxgram</h1></Link>

            
          </div>
          {/* <div className="search">
                    <input/>
                </div> */}
          <div className="actions">
            <Icon type="home" />
            <Icon type="send" />
            <Icon type="compass" />
            <Icon type="add" onClick={props.onCreatePost} />
            <Avatar imageUrl={localStorage.getItem("avatarUrl")} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
