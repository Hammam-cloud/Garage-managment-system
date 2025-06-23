import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import'./acceptservice.css'
import axios from "axios";

function AcceptService() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state; // Retrieve the service details passed from Services.js
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payment, setPayment] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedService = {
      service_id: service.id, // Ensure this is defined and valid
      start_date: startDate,  // Ensure this is defined and valid
      end_date: endDate,      // Ensure this is defined and valid
      payment: payment,       // Ensure this is defined and valid
      // Automatically set as "completed"
    };
    console.log(updatedService);
  
    axios
      .post("http://localhost:8081/updateService", updatedService)
      .then((response) => {
        if (response.data.success) {
          alert("Service updated successfully!");
          navigate("/services");
        }
      })
      .catch((error) => {
        console.error("Error updating service:", error);
      });
  };
  
  
  

  return (
    <div className="accept-service-container">
      <h2>Accept Service</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <label>
          Payment:
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          />
        </label>
        
        <button type="submit">Submit</button>
       
      </form>
    </div>
  );
}

export default AcceptService;
