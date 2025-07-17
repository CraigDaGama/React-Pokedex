import "./../styles/navbar.css";
import { useState, useEffect } from "react";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/logo/pokedex.png" alt="Pokedex Logo" className="logo" />
      </div>

      <div className="right-icons">
        <a
          href="https://github.com/your-username/your-pokedex-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img src="/logo/github-light.png" alt="GitHub Light" className="github-icon light-mode" />
          <img src="/logo/github-dark.png" alt="GitHub Dark" className="github-icon dark-mode" />
        </a>

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
