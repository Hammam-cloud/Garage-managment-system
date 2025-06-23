import React, { useState } from "react";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const response = await axios.get(`http://localhost:8081/orders?email=${email}`);
    setOrders(response.data.data); // Update orders state
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setIsLoading(false); // End loading
    }
  };
  const sortedOrders = orders.sort((a, b) => {
    if (a.order_status === "Pending" && b.order_status !== "Pending") return -1;
    if (a.order_status !== "Pending" && b.order_status === "Pending") return 1;
    return 0; // Keep the order the same if both are the same status
  });

  return (
    <div className="cart-container">
      <h2>Your Orders</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="email">Email*:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  <div className="product-details">
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="product-image"
                    />
                    <span>{order.product_name}</span>
                  </div>
                </td>
                <td>{order.quantity}</td>
                <td>${order.price_product}</td>
                <td>{order.order_status}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Cart;
