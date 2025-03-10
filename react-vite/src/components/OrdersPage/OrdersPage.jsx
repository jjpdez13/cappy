import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { orderActions } from "../../redux";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const user = useSelector((state) => state.session.user);
  const ordersRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    dispatch(orderActions.getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.fromItemsPage && ordersRef.current) {
      ordersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [orders]);

  const ordersArr = Object.values(orders || {});

  const handleRemoveItem = (orderId, itemId) => {
    dispatch(orderActions.removeItemsFromOrder(orderId, [itemId])).catch(
      (err) => console.error("Error removing item: ", err)
    );
  };

  const handleCompleteOrder = (orderId) => {
    dispatch(orderActions.removeOrder(orderId)).catch((err) =>
      console.error("Error deleting order:", err)
    );
  };

  const handleDeleteOrder = (orderId) => {
    dispatch(orderActions.removeOrder(orderId)).catch((err) =>
      console.error("Error deleting order:", err)
    );
  };

  return (
    <div className="orders-list-container">
      <header className="orders-list-header">
        <h1>Orders</h1>
      </header>
      <ul className="orders-grid">
        {ordersArr.length > 0 ? (
          ordersArr.map((order) => (
            <li key={order.id} className="order-card">
              <h2>Order #{order.id}</h2>
              <p>
                <strong>Krustomer:</strong> {order.krustomer_name}
              </p>
              <p>
                <strong>Status:</strong> {order.status}...<br></br>
                {/* Complete & Delete Order Button */}
                Tap when order READY:
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="complete-order-btn"
                >
                  Order UUUPPP SQUIDWARRRDDD!!!!
                </button>
              </p>
              <ul className="order-items-list">
                {order.items.length > 0 ? (
                  order.items.map((item) => (
                    <li key={item.id}>
                      {item.name}
                      <button
                        onClick={() => handleRemoveItem(order.id, item.id)}
                        className="remove-item-btn"
                      >
                        Out of Item
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No items in this order.</li>
                )}
              </ul>
              {user?.role === "Admin" && (
                <button
                  onClick={() => handleDeleteOrder(order.id)}
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
