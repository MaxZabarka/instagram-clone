import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import Icon from "../../Icon/Icon";
import "./Navbar.scss";
import { useHistory } from "react-router-dom";

const Navbar = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const history = useHistory();
  window.onclick = (e) => {
    console.log("window click");
    // avatar icon clicked or child of dropdown clicked
    if (e.target === avatarRef.current || e.target.closest(".dropdown")) return;
    console.log("past");
    if (showDropdown && e.target !== dropdownRef.current) {
      console.log(dropdownRef.current);
      console.log(e.target);
      setShowDropdown(false);
    }
  };
  return (
    <>
      <div className="Navbar">
        <div className="wrapper">
          <div className="brand">
            <Link to="/">
              <h1>Maxgram</h1>
            </Link>
          </div>

          <div className="actions">
            <Link to="/">
              <Icon type="home" filled={props.page === "home"} />
            </Link>
            <Icon type="send" />
            <Link to="/explore">
              <Icon type="compass" filled={props.page === "explore"} />
            </Link>
            <Icon
              type="add"
              onClick={() => {
                if (localStorage.getItem("token")) {
                  props.onCreatePost();
                } else {
                  history.push("/login");
                }
              }}
            />
            {localStorage.getItem("token") ? (
              <Avatar
                ref={avatarRef}
                onClick={() => {
                  setShowDropdown(true);
                }}
                imageUrl={localStorage.getItem("avatarUrl")}
              />
            ) : null}

            {showDropdown ? (
              <div ref={dropdownRef} className="dropdown">
                <ul>
                  <li>
                    <Link to={"/users/" + localStorage.getItem("username")}>
                      <Icon size="18rem" type="user" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to={"/saved"}>
                      <Icon size="18rem" type="save" />
                      Saved
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        history.push("/login");
                      }}
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
