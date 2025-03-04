// react-vite/src/components/MenusPage/MenusPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { menuActions } from "../../redux";
import "./MenusPage.css";

const MenusPage = () => {
  const dispatch = useDispatch();
  const menus = useSelector((state) => state.menus.menus);

  useEffect(() => {
    dispatch(menuActions.getMenus());
  }, [dispatch]);

  const menusArr = Object.values(menus || {});

  return (
    <div className="menu-list-container">
      <header className="menu-list-header">
        <h1>Menus</h1>
      </header>
      <ul className="menus-grid">
        {menusArr.length > 0 ? (
          menusArr.map((menu) => (
            <li key={menu.id} className="menu-card">
                  <h2>{menu.name}</h2>
                  <p>Click above to begin a {menu.name} order for your "Krustomer"!</p>
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
