import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './addproduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");
  const [salary, setsalary] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    await axios.post("http://localhost:8081/addproduct", {
        name,
        image,
        salary
      });
      alert("Product added successfully");  
      setname("");
      setimage("");
      setsalary("");
   }catch(err){
    console.log(err);
   }
}

  return (
    
    <div className='display'>
      
      <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>
        {/* Product Name */}
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
        </div>

        {/* Product Image */}
        <div>
          <label htmlFor="image">Product Image(url):</label>
          <input
            type="url"
            id="image"
            name="image"
            value={image}
            onChange={(e) => setimage(e.target.value)}
            required
          />
        </div>

        {/* Product Salary */}
        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={salary}
            onChange={(e) => setsalary(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
      
    </div>
  );
};

export default AddProduct;
