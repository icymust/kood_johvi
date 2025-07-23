import "./Header.css";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import apiCall from "../../auth/apiCall";
import { useState } from "react";

function Header() {
  const { accessToken, setAccessToken } = useAuth(); // Added setAccessToken
  const isLoggedIn = !!accessToken; // !! converts it to boolean, checks truthyness
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await apiCall({ method: "post", url: "/auth/logout" });
      setAccessToken(null); // Clear accessToken from memory
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="header">
      <p className="logo">MatchMe</p>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <nav>
        <ul className={`nav-links ${menuOpen ? "open" : "closed"}`}>
          <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
            <Link to="/">Home</Link>
          </li>
          {!isLoggedIn && (
            <>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/login">Login</Link>
              </li>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/registration">Registration</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/recommendations">Recommendations</Link>
              </li>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/connections">Connections</Link>
              </li>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/chatList">Chats</Link>
              </li>
              <li onClick={() => setMenuOpen(false)} role="button" tabIndex="0">
                <Link to="/profile">Profile</Link>
              </li>
              <li
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                role="button"
                tabIndex="0"
              >
                <button className="logout-button">Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
