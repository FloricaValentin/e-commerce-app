// LogIn.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/Config";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import firebase from "firebase/compat/app";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await auth.signInWithEmailAndPassword(email, password);
      dispatch(authActions.login(email));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Log In</h2>
      <br />
      <form className="form-group" onSubmit={handleSubmit}>
        <label htmlFor="Email">Email:</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <label htmlFor="Password">Password:</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <button type="submit" className="btn btn-success btn-md addbutton">
          Sign In
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <br />
      <span> Don't have an account? </span>
      <Link to="/signup"> Register </Link>
    </div>
  );
};

export default LogIn;
