// react-vite/src/components/MenusPage/MenusPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { itemActions } from "../../redux";
import "./ItemsPage.css";

const ItemsPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);

  useEffect(() => {
    dispatch(itemActions.getItems());
  }, [dispatch]);

  const itemsArr = Object.values(items || {});

  return (
    <div className="items-list-container">
      <header className="items-list-header">
        <h1>Items</h1>
      </header>
      <ul className="items-grid">
        {itemsArr.length > 0 ? (
          itemsArr.map((item) => (
            <li key={item.id} className="item-card">
                  <h2>{item.name}</h2>
                  <p>{item.price}</p>
                  {/* if item is out it will be "is_active = false" (grayed out) */}
            </li>
          ))
        ) : (
          <p>No items available.</p>
        )}
      </ul>
    </div>
  );
};

export default ItemsPage;
