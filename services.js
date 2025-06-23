import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './services.css';

function Services() {
  const [service, setService] = useState([]); // Initialize as an array
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/getservices`);
        if (response.data.success) {
          // Format dates and sort services
          const formattedServices = response.data.data
            .map((serviceItem) => ({
              ...serviceItem,
              start_date: formatDate(serviceItem.start_date),
              end_date: formatDate(serviceItem.end_date),
            }))
            .sort((a, b) => {
              // Place services with payment null or "0.00" first
              if ((a.payment === null || a.payment === "0.00") && (b.payment !== null && b.payment !== "0.00")) {
                return -1;
              }
              if ((b.payment === null || b.payment === "0.00") && (a.payment !== null && a.payment !== "0.00")) {
                return 1;
              }
              return 0; // Maintain order otherwise
            });
  
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
  
    fetchServices();
  }, []);

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

  // Handle Accept button click
  const handleAccept = (serviceItem) => {
    // Navigate to the AcceptService page with service details
    navigate("/acceptservice", { state: { service: serviceItem } });
  };

  return (
    <div className="add-service-container">
      <h2>Display Service</h2>

      {service.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Service Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {service.map((serviceItem, index) => (
              <tr key={index}>
                <td>{serviceItem.service_name}</td>
                <td>{serviceItem.service_type}</td>
                <td>{serviceItem.start_date}</td>
                <td>{serviceItem.end_date}</td>
                <td>{serviceItem.payment}</td>
                {serviceItem.payment === "0.00" && (
                  <td>
                    <button onClick={() => handleAccept(serviceItem)}>Accept</button>
                  </td>
                )}
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

export default Services;
