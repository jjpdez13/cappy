import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { itemActions, orderActions } from "../../redux";
import { useNavigate, useParams } from "react-router-dom";
import PlanktonModal from "../PlanktonModal";
import "./ItemsPage.css";

const ItemsPage = ({ category }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const orders = useSelector((state) => state.orders.orders);
  const orderRef = useRef(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [krustomerName, setKrustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [newSelectedItems, setNewSelectedItems] = useState([]);
  const [planktonAlert, setPlanktonAlert] = useState(false);
  const [planktonName, setPlanktonName] = useState("");
  const planktonAliases = ["plankton", "sheldon", "evil genius", "tiny menace"];

  useEffect(() => {
    dispatch(itemActions.getItems());
    if (orderId) {
      dispatch(orderActions.getOrder(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (orderId && orders[orderId]) {
      setKrustomerName(orders[orderId].krustomer_name);
      setSelectedItems(orders[orderId].items || []);
    }
  }, [orders, orderId]);

  const itemsArr = Object.values(items || {}).filter(
    (item) => !category || item.category === category
  );

  useEffect(() => {
    if (orderRef.current) {
      orderRef.current.scrollTop = orderRef.current.scrollHeight;
    }
  }, [selectedItems]);

  // Add item to order
  const handleAddItem = (item) => {
    if (orderId) {
      const isAlreadyInOrder = orders[orderId]?.items.some(
        (existingItem) => existingItem.id === item.id
      );

      if (isAlreadyInOrder) {
        alert(
          `${item.name} is already in the order! Update its quantity on the Orders Page.`
        );
        return;
      }

      setSelectedItems((prev) => [...prev, item]);

      dispatch(orderActions.addItemToOrder(orderId, item.id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  // Remove item from order
  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the order
  const handleSubmitOrder = async () => {
    if (!krustomerName.trim()) {
      alert("Please enter a name!");
      return;
    }

    const lowerName = krustomerName.toLowerCase();
    if (planktonAliases.some((alias) => lowerName.includes(alias))) {
      setPlanktonAlert(true);
      setPlanktonName(krustomerName);
      return;
    }

    if (orderId) {
      for (const item of newSelectedItems) {
        await dispatch(orderActions.addItemToOrder(orderId, item.id));
      }
      setNewSelectedItems([]);
      navigate("/orders");
      return;
    }

    const orderData = {
      krustomer_name: krustomerName,
      items: selectedItems.map((item) => ({ item_id: item.id, quantity: 1 })),
    };

    try {
      const newOrder = await dispatch(orderActions.createOrder(orderData));

      if (!newOrder || newOrder.error) {
        throw new Error("Order creation returned undefined or error");
      }

      setKrustomerName("");
      setSelectedItems([]);
      navigate("/orders");
    } catch (error) {
      console.error("Create order error:", error);
      alert("Error creating order. Check console for details.");
    }
  };

  return (
    <div className="items-list-container">
      <header className="items-list-header">
        <h1>{orderId ? `Edit Order #${orderId}` : "New Order"}</h1>
      </header>

      {/* Name Input */}
      {!orderId && (
        <input
          type="text"
          placeholder='Enter "Krustomer" Name'
          value={krustomerName}
          onChange={(e) => setKrustomerName(e.target.value)}
          className="name-input"
        />
      )}

      {/* Item Selection */}
      <div className="order-container">
        <div className="items-grid">
          {itemsArr.length > 0 ? (
            itemsArr.map((item) => (
              <div key={item.id} className="item-card">
                <button
                  onClick={() => handleAddItem(item)}
                  className="item-btn"
                >
                  {item.name}
                </button>
              </div>
            ))
          ) : (
            <p>No items available.</p>
          )}
        </div>

        {/* Order Summary */}
        {selectedItems.length > 0 && (
          <div className="order-summary" ref={orderRef}>
            <h2>Order Summary</h2>
            <div className="selected-items">
              {selectedItems.map((item, index) => (
                <div key={index} className="selected-item">
                  {item.name} (x{item.quantity})
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSubmitOrder} className="submit-btn">
              {orderId ? "Update Order" : "Submit Order"}
            </button>
          </div>
        )}
      </div>

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
