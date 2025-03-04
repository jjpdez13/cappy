import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { orderActions } from "../../redux";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(orderActions.getOrders());
  }, [dispatch]);

  const ordersArr = Object.values(orders || {});

  // Handler to delete order when marked complete
  const handleCompleteOrder = (orderId) => {
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
                <strong>Status:</strong> {order.status}
              </p>
              <ul className="order-items-list">
                {order.items.length > 0 ? (
                  order.items.map((item) => <li key={item.id}>{item.name}</li>)
                ) : (
                  <li>No items in this order.</li>
                )}
              </ul>
                  <p></p>
              {/* Complete & Delete Order Button */}
              <button
                onClick={() => handleCompleteOrder(order.id)}
                className="complete-order-btn"
              >
                Order UUUPPP SQUIDWARRRDDD!!!!
              </button>
            </li>
          ))
        ) : (
          <p>No active orders.</p>
        )}
      </ul>
    </div>
  );
};

export default OrdersPage;
