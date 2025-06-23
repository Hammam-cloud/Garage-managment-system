import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./LoginSinup.css"

const Login = ({ setNavbar }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/login", { email, password });

      if (response.data.role === 'customer') {
      
        const userRole = "custumer"; 
        setNavbar(userRole);

        navigate("/custumer"); // Navigate only after successful response
      } else if (response.data.role === 'admin') {
        
        setNavbar("admin");
        navigate("/admin"); // Navigate only after successful response
      }
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data.error : "An error occurred");
      setError(err.response ? err.response.data.error : "An error occurred");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
