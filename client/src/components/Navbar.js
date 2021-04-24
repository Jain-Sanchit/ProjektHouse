import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/createpost">Create post</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/myFollowersPosts">Feed</Link>
        </li>,
        <li>
          <button
            type="submit"
            className="btn waves-effect hoverable #ff5252 red accent-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            LogOut
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/register">Register</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <Link
          to={state ? "/" : "/login"}
          className="brand-logo left"
          style={{ padding: "0 25px" }}
        >
          ProjektHouse
        </Link>
        <ul
          id="nav-mobile"
          className="right hide-on-med-and-down"
          style={{ padding: "0 25px" }}
        >
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
