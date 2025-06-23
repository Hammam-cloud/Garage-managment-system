import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(""); // To display an error if fetching fails

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/getorders");
        if (response.data.success) {
          setOrders(response.data.data); // Set orders if successful
        } else {
          setError(response.data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders. Please try again later.");
      }
    };

    fetchOrders();
  
  useEffect(() => {
    fetchOrders(); // Fetch orders when component mounts
  }, []);
  const handleCompleted = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(`http://localhost:8081/updateorder`, {
        orderId: id, // Key must match what the backend expects
      });

      if (response.data.success) {
        console.log("Order marked as completed!");

        // Update the specific order's status in the local state
        fetchOrders();
      } else {
        console.error("Server Error:", response.data.message);
        alert(response.data.message || "Failed to update order status.");
      }
    } catch (error) {
      console.error("Axios Error:", error);
      alert("Error updating order status. Please try again later.");
    }
  };
  const sortedOrders = orders.sort((a, b) => {
    if (a.order_status === "pending" && b.order_status !== "pending") return -1;
    if (a.order_status !== "pending" && b.order_status === "pending") return 1;
    return 0; // Keep the order the same if both are the same status
  });

  return (
    <div className="cart-container">
      <h2>Orders</h2>
      

      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
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
                <td>{order.date}</td>
                {order.order_status === "pending" && (
                  <td>
                    <button onClick={() => handleCompleted(order.order_id)}>Completed</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>No orders found.</p>
      )}
    </div>
  );
}

export default Order;
