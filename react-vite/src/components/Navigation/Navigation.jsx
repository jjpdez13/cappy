import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SignupButton from "./SignupButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Sign Up button on `/signup` page OR if user is logged in
  const hideSignup = user || location.pathname === "/signup";

  // 🔹 Dynamic Page Titles
  const pageTitles = {
    "/": "The Krusty Krab B.O.S.S. ",
    "/login": "🔑",
    "/signup": "📝",
    "/menus": "🍽️",
    "/items": "📦",
    "/orders": "🛒",
  };

  // Default title if route is not in `pageTitles`
  const currentTitle = pageTitles[location.pathname] || "The Krusty Krab B.O.S.S.";

  return (
    <nav className="navbar">
      <button className="crab-btn" onClick={() => navigate("/")}>
        <img src="/images/crab-logo.png" alt="Krusty Krab" className="crab-logo" />
      </button>
      {/* 🔹 Dynamic Title (Left Side) */}
      <h1 className="nav-title">{currentTitle}</h1>

      {/* 🔹 Navigation Links */}
      <ul className="nav-list">
        {user && (
          <>
            <li>
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menus" className="nav-link">
                Menus
              </NavLink>
            </li>
            <li>
              <NavLink to="/items" className="nav-link">
                Items
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className="nav-link">
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/supply" className="nav-link">
                Supplies
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* 🔹 Buttons (Right Side) */}
      <div className="nav-buttons">
        <div className="profile-btn">
          <ProfileButton />
        </div>

        {!hideSignup && (
          <div className="signup-btn">
            <SignupButton />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;