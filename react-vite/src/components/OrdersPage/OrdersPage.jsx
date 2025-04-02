import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { orderActions } from "../../redux";
import ConfirmationModal from "../ConfirmationModal";
import { useModal } from "../../context/Modal";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const user = useSelector((state) => state.session.user);
  const loading = useSelector((state) => state.session.loading);
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const ordersRef = useRef(null);
  const location = useLocation();
  const [completedItems, setCompletedItems] = useState(new Set());

  useEffect(() => {
    dispatch(orderActions.getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.fromItemsPage && ordersRef.current) {
      ordersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [orders, location.state]);

  if (loading) return <div className="loading">Loading items...</div>;
  
  const handleUpdateQuantity = (orderId, itemId, change) => {
    dispatch(orderActions.updateItemQuantity(orderId, itemId, change));
  };

  const handleRemoveItem = (orderId, itemId) => {
    dispatch(orderActions.removeItemsFromOrder(orderId, [itemId])).catch(
      (err) => console.error("Error removing item:", err)
    );
  };

  const handleCompleteItem = (orderId, itemId) => {
    setCompletedItems((prev) => new Set(prev).add(`${orderId}-${itemId}`));
  };

  const isOrderComplete = (order) => {
    return order.items.every((item) =>
      completedItems.has(`${order.id}-${item.id}`)
    );
  };

  const handleCompleteOrder = (orderId) => {
    dispatch(orderActions.completeOrder(orderId))
      .then(() => {
        setTimeout(() => {
          dispatch(orderActions.removeOrder(orderId));
        }, 3000); // 3 seconds
      })
      .catch((err) => {
        console.error("Error completing order:", err);
      });
  };

  const handleDeleteOrder = (order) => {
    setModalContent(
      <ConfirmationModal
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${order.krustomer_name}'s order?`}
        onConfirm={() => dispatch(orderActions.removeOrder(order.id))}
      />
    );
  };

  return (
    <div className="orders-list-container">
      <header className="orders-list-header">
        <h1>Orders</h1>
      </header>
      <ul className="orders-grid">
        {orders && Object.values(orders).length > 0 ? (
          Object.values(orders).map((order) => (
            <li key={order.id} className="order-card">
              <button
                className="add-to-order-btn"
                onClick={() => navigate(`/items/${order.id}`)}
              >
                + Add to Order
              </button>
              <h2>Order #{order.id}</h2>
              <p>
                <strong>Krustomer:</strong> {order.krustomer_name}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>Order is READY:
              <button
                onClick={() => handleCompleteOrder(order.id)}
                className="complete-order-btn"
                disabled={!isOrderComplete(order)}
              >
                Order UUUPPP SQUIDWARRRDDD!!!!
              </button>

              <ul className="order-items-list">
                {order.items.length > 0 ? (
                  order.items.map((item) => {
                    const itemKey = `${order.id}-${item.id}`;
                    const isCompleted = completedItems.has(itemKey);
                    return (
                      <li key={itemKey} className="order-item">
                        <div className="item-info">
                          {item.name} (x{item.quantity})
                          {!isCompleted && (
                            <div className="quantity-controls">
                              {item.quantity > 1 && (
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(order.id, item.id, -1)
                                  }
                                  className="quantity-btn"
                                >
                                 ➖ 
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(order.id, item.id, 1)
                                }
                                className="quantity-btn"
                              >
                                ➕ 
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="item-actions">
                          {isCompleted ? (
                            <span className="completed-checkmark">✅</span>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleRemoveItem(order.id, item.id)
                                }
                                className="remove-item-btn"
                              >
                                X Remove
                              </button>
                              <button
                                onClick={() =>
                                  handleCompleteItem(order.id, item.id)
                                }
                                className="complete-item-btn"
                              >
                                ✅ Complete
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="no-items">No items in this order.</li>
                )}
              </ul>

              {user?.role === "Admin" && (
                <button
                  onClick={() => handleDeleteOrder(order)}
                  className="delete-order-btn"
                >
                  X
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No active orders.</p>
        )}
        <div ref={ordersRef}></div>
      </ul>
    </div>
  );
};

export default OrdersPage;
