// react-vite/src/components/MenusPage/MenusPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { menuActions } from "../../redux";
import "./MenusPage.css";
import { useNavigate } from "react-router-dom";

const MenusPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menus = useSelector((state) => state.menus.menus);
  const user = useSelector((state) => state.session.user);
  const [editMenu, setEditMenu] = useState(null);
  const [menuName, setMenuName] = useState("");
  const [newMenuName, setNewMenuName] = useState("");

  useEffect(() => {
    dispatch(menuActions.getMenus());
  }, [dispatch]);

  const menusArr = Object.values(menus || {});

  const handleEdit = async (menu) => {
    if (editMenu === menu.id && menuName !== menu.name) {
      const updatedMenu = await dispatch(
        menuActions.editMenu(menu.id, { name: menuName })
      );

      if (updatedMenu) setMenuName(updatedMenu.name);
    }
    setEditMenu(editMenu === menu.id ? null : menu.id);
    setMenuName(menu.name);
  };

  const handleDelete = (menuId) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      dispatch(menuActions.removeMenu(menuId));
    }
  };

  const handleCreateMenu = async () => {
    if (newMenuName.trim() === "") return;
    const createdMenu = await dispatch(
      menuActions.createMenu({ name: newMenuName })
    );
    if (createdMenu) setNewMenuName("");
  };

  return (
    <div className="menu-list-container">
      <header className="menu-list-header">
        <h1>Menu Categories</h1>
      </header>

      {/* Admin-Only: Add New Menu Input and Button */}
      {user?.role === "Admin" && (
        <div className="add-menu-container">
          <input
            type="text"
            value={newMenuName}
            onChange={(e) => setNewMenuName(e.target.value)}
            placeholder="Enter new menu name"
            className="menu-add-input"
          />
          <button onClick={handleCreateMenu} className="add-btn">
            ADD
          </button>
        </div>
      )}
      {/* Main */}
      <ul className={`menus-grid ${user?.role === "Admin" ? "admin-view" : "employee-view"}`}>
        {menusArr.length > 0 ? (
          menusArr.map((menu) => (
            <li key={menu.id} className="menu-card">
              <button
                onClick={() => navigate("/items")}
                className="menu-button"
              >
                {menu.name}
              </button>
              <div className="menu-description">
                <p>
                  Click ABOVE to begin a {menu.name} order for your "Krustomer"!
                </p>
              </div>

              {/* Admin-only: Edit & Delete Menu Buttons */}
              {user?.role === "Admin" && (
                <div className="menu-actions">
                  {editMenu === menu.id ? (
                    <>
                      <input
                        type="text"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        className="menu-edit-input"
                      />
                      <button onClick={() => handleEdit(menu)}>Save</button>
                      <button onClick={() => setEditMenu(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditMenu(menu.id)}>EDIT</button>
                      <button onClick={() => handleDelete(menu.id)}>
                        DELETE
                      </button>
                    </>
                  )}
                  <p></p>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No menus available.</p>
        )}
      </ul>
    </div>
  );
};

export default MenusPage;
