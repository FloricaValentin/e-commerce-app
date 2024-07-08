import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/Config';

const SignUp = () => {
  const navigate = useNavigate(); // Hook to access navigate function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        db.collection('UsersData').doc(credentials.user.uid).set({
          Email: email,
          Password: password
        }).then(() => {
          setEmail('');
          setPassword('');
          setError('');
          navigate('/login'); // Use navigate function to navigate
        }).catch(error => setError(error.message));
      }).catch(error => setError(error.message));
  };

  return (
    <div className='container'>
      <h2 className='title'>Sign Up</h2>
      <br />
      <form className='form-group' onSubmit={handleSubmit}>
        <label htmlFor='Email'>Email:</label>
        <input type="email" className='form-control' required 
          onChange={(e) => setEmail(e.target.value)} value={email} />
        <br />
        <label htmlFor='Password'>Password:</label> 
        <input type="password" className='form-control' required 
          onChange={(e) => setPassword(e.target.value)} value={password}/>
        <br />
        <button type="submit" className="btn btn-success btn-md addbutton">Register </button>
      </form>
      {error && <div className='error-message'>{error}</div>}
      <br />
      <span> Already have an account? Log In</span>
      <Link to="/login">Here</Link>
    </div>
  );
};

export default SignUp;
