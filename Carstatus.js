import { useState } from "react";
import axios from "axios";
import './Carstatus.css';

function Carstatus() {
  const [carnumber, setCarnumber] = useState("");
  const [service, setService] = useState([]); // Initialize as an array

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    console.log("Car number being sent:", carnumber);

    try {
      const response = await axios.get(`http://localhost:8081/getservice?carnumber=${carnumber}`);
      if (response.data.success) {
        // Format dates in the response
        const formattedServices = response.data.data.map((serviceItem) => ({
          ...serviceItem,
          start_date: formatDate(serviceItem.start_date),
          end_date: formatDate(serviceItem.end_date),
        }));
        setService(formattedServices);
      } else {
        alert(response.data.message || "No services available.");
        setService([]); // Clear service list if no data is found
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      alert(error.response?.data?.error || "Error fetching services. Please try again.");
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString || dateString === "1899-11-29T22:00:00.000Z") {
      return "0/0/0"; // Default to "0/0/0" if date is invalid or not provided
    }
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "0/0/0"; // Return "0/0/0" if the date is invalid
    }
    return date.toLocaleDateString(); // Return formatted date
  };

  return (
    <div className="add-service-container">
      <h2>Display Service</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="carnumber">plate number*:</label>
          <input
            type="number"
            id="carnumber"
            value={carnumber}
            onChange={(e) => setCarnumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-small">
          Submit
        </button>
      </form>
      {service.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Car Number</th>
              <th>Service Name</th>
              <th>Service Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Payment</th>
              
            </tr>
          </thead>
          <tbody>
            {service.map((serviceItem, index) => (
              <tr key={index}>
                <td>{carnumber}</td>
                <td>{serviceItem.service_name}</td>
                <td>{serviceItem.service_type}</td>
                <td>{serviceItem.start_date}</td>
                <td>{serviceItem.end_date}</td>
                <td>{serviceItem.payment}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No services found.</p>
      )}
    </div>
  );
}

export default Carstatus;
