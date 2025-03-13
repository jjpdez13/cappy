import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionActions } from "../../redux";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { useNavigate } from "react-router-dom";
import "./ProfileButton.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    navigate("/");
    closeMenu();
  };

  const demoLogin = () => {
    dispatch(sessionActions.thunkLogin({ email: "money.krabs@kk.io", password: "$money$" }));
    closeMenu();
  };

  // Assign Emojis Based on Username
  const emojiMap = {
    "MoneyKrab$": "🦀",
    "SquiddyClarinet105": "🦑",
    "MuscleBob300": "🧽",
    "Patrick": "⭐",
  };

  // Default emoji if not listed
  const userEmoji = user ? emojiMap[user.username] || "👨‍🍳" : "❓";

  return (
    <>
      {user ? (
        <button onClick={toggleMenu} className="profile-btn">
          <span className="profile-emoji">{userEmoji}</span>
        </button>
      ) : (
        <div className="auth-buttons">
          <OpenModalMenuItem
            itemText={<button className="login-btn">Log In</button>}
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <button onClick={demoLogin} className="demo-btn">Demo</button>
        </div>
      )}

      {showMenu && user && (
        <ul className="profile-dropdown" ref={ulRef}>
          <li>{userEmoji} {user.username}</li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </>
  );
}
export default ProfileButton;