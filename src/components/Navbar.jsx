import "./../styles/navbar.css";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-container">
        <img src="/logo/pokedex.png" alt="Pokedex Logo" className="logo" />
      </div>

      {/* Right Icons: GitHub & Toggle */}
      <div className="right-icons">
        <a
          href="https://github.com/CraigDaGama/React-Pokedex.git"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img
            src="/logo/github.svg"
            alt="GitHub"
            className={`github-icon ${darkMode ? "dark" : "light"}`}
          />
        </a>

        {/* Dark Mode Toggle */}
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;
