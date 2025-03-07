import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { itemActions, orderActions } from "../../redux";
import PlanktonModal from "../PlanktonModal";
import "./ItemsPage.css";

const ItemsPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const [krustomerName, setKrustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [planktonAlert, setPlanktonAlert] = useState(false);
  const [planktonName, setPlanktonName] = useState("");
  const planktonAliases = ["plankton", "sheldon", "evil genius", "tiny menace"];

  useEffect(() => {
    dispatch(itemActions.getItems());
  }, [dispatch]);

  const itemsArr = Object.values(items || {});

  // Add item to order
  const handleAddItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  // Remove item from order
  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the order
  const handleSubmitOrder = () => {
    if (!krustomerName.trim()) {
      alert("Please enter a name!");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item!");
      return;
    }

    // CHECK FOR PLANKTON BEFORE SUBMISSION
    const lowerName = krustomerName.toLowerCase();
    if (planktonAliases.some((alias) => lowerName.includes(alias))) {
      setPlanktonAlert(true);
      setPlanktonName(krustomerName);
      return;
    }

    const itemIds = selectedItems.map((item) => item.id);

    dispatch(
      orderActions.createOrder({
        krustomer_name: krustomerName,
        item_ids: itemIds,
      })
    );

    // Reset the form after submission
    setKrustomerName("");
    setSelectedItems([]);
  };

  return (
    <div className="items-list-container">
      <header className="items-list-header">
        <h1>Items</h1>
      </header>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Enter Krustomer Name"
        value={krustomerName}
        onChange={(e) => setKrustomerName(e.target.value)}
        className="name-input"
      />

      {/* Item Selection */}
      <ul className="items-grid">
        {itemsArr.length > 0 ? (
          itemsArr.map((item) => (
            <li key={item.id} className="item-card">
              <button onClick={() => handleAddItem(item)}>{item.name}</button>
            </li>
          ))
        ) : (
          <p>No items available.</p>
        )}
      </ul>

      {/* Order Summary (Live Preview) */}
      {selectedItems.length > 0 && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item.name}
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmitOrder} className="submit-btn">
            Submit Order
          </button>
        </div>
      )}

      {/* PLANKTON ALERT */}
      {planktonAlert && (
        <PlanktonModal
          planktonName={planktonName}
          onClose={() => setPlanktonAlert(false)}
        />
      )}
    </div>
  );
};

export default ItemsPage;
