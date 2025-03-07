import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import SignupFormPage from "../SignupFormPage";

function Navigation() {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
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
          </>
        )}

        {/* Profile/Login Button */}
        <li className="profile-btn">
          <ProfileButton />
        </li>

        {/* Signup Button */}
        <li className="signup-btn">
          <SignupButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
