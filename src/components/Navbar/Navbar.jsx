import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/Config.jsx";
import { Icon } from "react-icons-kit";
import { truck } from "react-icons-kit/icomoon/truck";
import { cart } from "react-icons-kit/entypo/cart";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { fetchCartItems } from "../../store/cart-slice";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const totalQty = useSelector((state) => state.cart.totalQty);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.classList.contains("burger-menu") 
      ) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="navbox">
      <div className="leftside">
        <span className="navlink">
          <Icon icon={truck} className="truck-icon" />
        </span>
      </div>
      <div className="rightside">
  <div className="burger-menu" onClick={toggleMenu}>
    <div className="burger-bar"></div>
    <div className="burger-bar"></div>
    <div className="burger-bar"></div>
  </div>
  <div ref={menuRef} className={`nav-links ${isMenuOpen ? "open" : ""}`}>
    <div className="burger-links">
      <Link to="/addproducts" className="navlink">
        AddProducts
      </Link>
      <Link to="/" className="navlink">
        Products
      </Link>
      {!isLoggedIn && (
        <>
          <Link to="signup" className="navlink">
            Sign Up
          </Link>
          <Link to="cartproducts" className="navlink">
            <Icon icon={cart} />
            <span className="cart-count">{totalQty}</span>
          </Link>
          <Link to="login" className="navlink">
            Login
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <span className="navlink email">{userEmail}</span>
          <Link to="cartproducts" className="navlink">
            <Icon icon={cart} />
            <span className="cart-count">{totalQty}</span>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  </div>
</div>

    </div>
  );
};

export default Navbar;
