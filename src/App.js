import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Signup from '../src/components/SignUp/SignUp.jsx';
import CartProducts from '../src/components/CartProducts/CartProducts.jsx';
import AddProducts from '../src/components/AddProducts/AddProducts.jsx';
import Products from './components/Products/Products.jsx';
import LogIn from '../src/components/LogIn/Login.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import './App.css'

const App = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    console.log(isLoggedIn)
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/cartproducts" element={<CartProducts />} />
                <Route path="/addproducts" element={<AddProducts />} />
                <Route path="/" element={<Products />} />
                {isLoggedIn ? (
                    <Route path="/checkout" element={<Checkout />} />
                ) : <Route path="/login" element={<LogIn />} />
            }
            </Routes>
        </div>
    );
};

export default App;

