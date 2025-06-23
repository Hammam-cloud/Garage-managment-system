import { Link } from "react-router-dom";
import "./Navbar.css"; // CSS for styling
import { useState } from "react";
import { useEffect, useLocation } from "react";
const Navbar = ({ navbar, setNavbar }) => {

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-links">
         { (navbar==="login") ?
            <>
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link">Signup</Link>
          </li>

          </>
          :
          (navbar==="custumer") ?(
          <>
                <li>
                    <Link to="/Cars" className="nav-link">Cars</Link>
                 </li>
                 <li>
                    <Link to="/Carservice" className="nav-link">car Service</Link>
                 </li>
                
                 <li>
                    <Link to="/cartatus" className="nav-link">Car status </Link>
                 </li>
                 <li>
                    <Link to="/product" className="nav-link">Product</Link>
                 </li>
                 <li>
                    <Link to="/cart" className="nav-link">our order</Link>
                 </li>
                 <li>
                    <Link to="/logout" className="nav-link">Logout</Link>
                 </li>
            </>
  )
            :
            (navbar==="admin") ?
            <>
                 <li>
                    <Link to="/services" className="nav-link">Services</Link>
                    
                 </li>
                
                 <li>
                  <Link to="addproduct" className="nav-link">Add Product</Link>
                 </li>
                 <li>
                  <Link to="confirmorder" className="nav-link">Orders</Link>
                 </li>

                 <li>
                    <Link to="/logout" className="nav-link">Logout</Link>
                 </li>
                  
          
            </>
            :
            <>  </>
         }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
