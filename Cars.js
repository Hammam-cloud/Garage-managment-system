import { useEffect, useState } from "react";
import axios from "axios";
import './Cars.css';


const Cars = () => {
  const years = Array.from({ length: 25 }, (_, i) => 2000 + i);
  const [carNumber, setCarNumber] = useState("");
  const [model, setmodel] = useState("");
  const[year,setyear]=useState("");
  const[type,settype]=useState("");
  const[email,setemail]=useState("");

  const[message,setmessage]=useState("")

 const types=["porche","bmw","audi","renault","kia","mercedes","volkswagen","honda","toyota"];
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:8081/addcar", {
        carNumber,
        model,
        email
      });
      if (response.data.success) {
        setmessage("car added successfully");
        setemail("");
        setCarNumber("");
        setmodel("");
       
      } else {
        setmessage("user not found");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setmessage("user not found");
      setemail("");
      setCarNumber("");
      setmodel("");
    }
     
  };

  return (
    <div>
      <div className="add-service-container">
        <h2>Add Car</h2>
        <h3 style={{color:"red"}}>{message}</h3>
        <form onSubmit={handleSubmit} className="service-form">
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
          <div className="form-group">
            <label htmlFor="name">Plate number*:</label>
            <input
              type="text"
              id="name"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="type">Type of car:</label>
            <select id="type" name="type" value={type}
              onChange={(e) => settype(e.target.value)}>
                <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
         
          <div>
            <label htmlFor="model">Model of Car*:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setmodel(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="year">Select Year:</label>
            <select id="year" name="year" value={year}
              onChange={(e) => setyear(e.target.value)}>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
       
         
          <button type="submit" className="button-small">
            Submit
          </button>

        </form>
      </div>
     
    </div>
  );
}

export default Cars;
