import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/" className="nav-link">Home</NavLink>
        </li>

        {user && (
          <>
            <li>
              <NavLink to="/menus" className="nav-link">Menus</NavLink>
            </li>
            <li>
              <NavLink to="/items" className="nav-link">Items</NavLink>
            </li>
            <li>
              <NavLink to="/orders" className="nav-link">Orders</NavLink>
            </li>
          </>
        )}

        {/* Profile Button */}
        <li className="profile-button">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;