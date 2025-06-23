import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Customer from './components/Customer/Customer';
import Home from './components/Home';
import Product from './components/Customer/Custumerdashbord/ProductList';
import Navbar from './Navbar';
import Login from './Login/login';
import Signup from './Login/singup';
import { useState } from 'react';
import Logout from './Login/Logout';

import Carsservice from './components/Customer/Custumerdashbord/Carservice';
import Cars from './components/Customer/Custumerdashbord/Cars';
import Carstatus from './components/Customer/Custumerdashbord/Carstatus';
import Cart from './components/Customer/Custumerdashbord/Cart';
import AddProduct from './components/Admin/Addproduct';
import Services from './components/Admin/services';
import AcceptService from './components/Admin/AcceptService';
import Order from './components/Admin/Order';
import Admin from './components/Admin/Admin';
function App() {
  const [navbar, setNavbar] = useState("login");
  return (
    <Router>
        <Navbar navbar={navbar} setNavbar={setNavbar} />
      <Routes>
       <Route path="/login" element={<Login setNavbar={setNavbar}/>} />
       <Route path="/signup" element={<Signup setNavbar={setNavbar}/>} />
       <Route path="/" element={<Home />} />
        <Route path="/custumer" element={<Customer />} />
        <Route path='/Carservice' element={<Carsservice />} />
        <Route path='/cars' element={<Cars />} /> 
        <Route path='/product' element={<Product />} /> 
        <Route path='/logout' element={<Logout setNavbar={setNavbar}/>} />
        <Route path='/cartatus' element={<Carstatus />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/services' element={<Services/>}/>
        <Route path='/acceptservice' element={<AcceptService/>}/>
        <Route path='/confirmorder'element={<Order/>}/>
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
