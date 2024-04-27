import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/Config";
import { useSelector } from "react-redux";

const Checkout = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchUserEmail = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setEmail(user.email);
        }
      });
    };

    fetchUserEmail();
  }, []);

  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const handleSubmit = (event) => {
    event.preventDefault();

    const buyerInfo = {
      fullName: fullName,
      email: email,
      phone: phone,
      address: address,
      totalPrice: totalPrice,
    };

    db.collection("BuyerInfo")
      .add(buyerInfo)
      .then(() => {
        console.log("Buyer information added successfully!");
        setFullName("");
        setPhone("");
        setAddress("");
      })
      .catch((error) => {
        console.error("Error adding buyer information: ", error);
      });
  };

  return (
    <div className="container">
      <h1 className="title">Checkout</h1>
      <form className="form-group" onSubmit={handleSubmit}>
        <label htmlFor="FullName">FullName:</label>
        <input
          type="text"
          className="form-control"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <br />
        <label htmlFor="Email">Email:</label>
        <input type="email" className="form-control" value={email} disabled />
        <br />

        <label htmlFor="Phone">Phone:</label>
        <input
          type="number"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />

        <label htmlFor="Address">Address:</label>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />

        <label htmlFor="Total">Total:</label>
        <input
          type="number"
          className="form-control"
          value={totalPrice}
          disabled
        />
        <br />
        <button type="submit" className="btn btn-success btn-md addbutton">
          Send Order{" "}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
