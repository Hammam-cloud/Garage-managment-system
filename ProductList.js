import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const[email,setemail]=useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/getproduct");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (productId, price) => {
    const quantity = 1; // Default quantity
    // Retrieve userId from localStorage 
    if(!email){
      alert("Please enter your email");
    }
  
    try {
      
      const response = await axios.post(
        
        "http://localhost:8081/create-order",
        {
          productId,
          quantity,
          price,
          email
         
        }
        
      );
  
      if (response.data.success) {
        alert("Product added to cart!");
        setCart([...cart, { productId, quantity, price }]);
      }
    } catch (error) {
      console.error("Error creating order:", error);
     
    }
  };
  
  return (
    <div className="products-container">
      <h2>Products</h2>
      <form >
        <div>
            <label htmlFor="cartype">Email*:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>
          </form>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleBuy(product.id, product.price)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
