import React, { useState } from "react";
import './Carservices.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Carsservice = () => {
  const services=["Air Filter & Cabin Filter Replacement","Coolant Flush & Refill","Battery Check & Replacement","Check Engine Light Diagnosis","Fuel System Cleaning & Repair","Fuel Pump Replacement","Car Detailing & Polishing","LED & HID Lighting Upgrades","Flat Tire Repair & Replacement","Oil Change Service"]
  const navigate = useNavigate();

  const [carnumber, setCarnumber] = useState("");
  const [servicetype, setservicetype] = useState("");
  const[servicename,setservicename]=useState("")
 
  /**
   * Handles form submission, sends a POST request to the server to add a
   * service request, and clears the form fields on success. If there is an
   * error, it logs the error and alerts the user to try again.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!carnumber || !servicename || !servicetype) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:8081/addservice", {
        type: servicetype,
        number: carnumber,
        name: servicename,
      });

      alert("Service added successfully! Go to the car status page to check the status.");
      navigate("/custumer");
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Please try again.");
    }
  };

  return (
    <div className="add-service-container">
      <h2>Add Service</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
        <label htmlFor="number">Plate number*:</label>
          <input
            type="text"
            id="mumder"
            value={carnumber}
            onChange={(e) => setCarnumber(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
        <label htmlFor="servicename">Service name*:</label>
          <input
            type="text"
            id="sevicename"
            value={servicename}
            onChange={(e) => setservicename(e.target.value)}
            required
          />
          </div>
          <div>
            <label htmlFor="service type">Select type*:</label>
            <select id="service type" name="service type" value={servicetype} required
              onChange={(e) => setservicetype(e.target.value)}>
                <option value="">Select type</option>
              {services.map((servicetype) => (
                <option key={servicetype} value={servicetype}>
                  {servicetype}
                </option>
              ))}
            </select>
          </div>
          
        
        
        
        
        <button type="submit" className="button-small" >
          Submit
        </button>
       
      </form>
    </div>
  );
};

export default Carsservice;
