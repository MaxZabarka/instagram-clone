import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import Icon from "../../Icon/Icon";
import "./Navbar.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";

const SEARCH_DEBOUNCE = 500;

const Navbar = (props) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true);

  const searchDropdownRef = useRef(null);

  const history = useHistory();
  window.onclick = (e) => {
    // avatar icon clicked or child of profiledropdown clicked
    if (
      !(e.target === avatarRef.current || e.target.closest(".profile-dropdown"))
    ) {
      if (showProfileDropdown && e.target !== profileDropdownRef.current) {
        setShowProfileDropdown(false);
      }
    }

    if (
      !(
        e.target === searchDropdownRef.current ||
        e.target.closest(".search-dropdown")
      )
    ) {
      if (showSearchDropdown && e.target !== searchDropdownRef.current) {
        setShowSearchDropdown(false);
      }
    }
  };

  const searchHandler = async (query) => {
    const response = await axios.get(
      process.env.REACT_APP_API_URL + "/search/" + query
    );
    setSearchedUsers(response.data);
    setSearchLoading(false);
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
          <div className="search">
            <Icon size="15rem" type="search" />
            <input
              onChange={(e) => {
                setShowSearchDropdown(!!e.target.value);
                clearTimeout(searchTimeoutRef.current);
                setSearchLoading(true);
                searchTimeoutRef.current = setTimeout(() => {
                  if (e.target.value) {
                    searchHandler(e.target.value);
                  }
                }, SEARCH_DEBOUNCE);
              }}
              placeholder="Search"
            />
            {showSearchDropdown ? (
              <div className="search-dropdown" ref={searchDropdownRef}>
                {searchLoading ? (
                  <Spinner size="3rem" />
                ) : searchedUsers.length ? (
                  searchedUsers.map((user) => {
                    return (
                      <Link
                        className="user-search"
                        to={"/users/" + user.username}
                      >
                        <Avatar size="40rem" imageUrl={user.avatarUrl} />
                        <p>{user.username}</p>
                      </Link>
                    );
                  })
                ) : (
                  <p className="no-results">No results found.</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="actions">
            <Link to="/">
              <Icon type="home" filled={props.page === "home"} />
            </Link>
            {/* <Icon type="send" /> */}
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
                  setShowProfileDropdown(true);
                }}
                imageUrl={localStorage.getItem("avatarUrl")}
              />
            ) : null}

            {showProfileDropdown ? (
              <div ref={profileDropdownRef} className="profile-dropdown">
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
