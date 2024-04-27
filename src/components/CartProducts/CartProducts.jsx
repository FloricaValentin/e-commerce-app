import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} from "../../store/cart-slice";
import { Link } from "react-router-dom";
import "./CartProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../config/Config";

const CartProducts = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  let totalQty = 0;
  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalQty += item.qty;
    totalPrice += item.qty * item.ProductValue;
  });

  const handleIncrement = (cartID, qty) => {
    dispatch(incrementCartItem({ cartID }));
    updateFirestoreQuantity(cartID, qty + 1);
  };

  const handleDecrement = (cartID, qty) => {
    if (qty === 1) {
      handleRemove(cartID);
    } else {
      dispatch(decrementCartItem({ cartID }));
      updateFirestoreQuantity(cartID, qty - 1);
    }
  };

  const handleRemove = (cartID) => {
    dispatch(removeCartItem({ cartID }));
    db.collection("cart")
      .doc(cartID)
      .delete()
      .then(() => {
        console.log("Document successfully deleted from Firestore!");
      })
      .catch((error) => {
        console.error("Error removing document from Firestore: ", error);
      });
  };

  const updateFirestoreQuantity = (cartID, qty) => {
    db.collection("cart")
      .doc(cartID)
      .update({ qty })
      .then(() => {
        console.log("Quantity updated successfully in Firestore!");
      })
      .catch((error) => {
        console.error("Error updating quantity in Firestore: ", error);
      });
  };

  return (
    <div>
      <h1 className="title">Cart</h1>
      <div className="cart-items-container">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img
              src={item.ProductImage}
              alt={item.ProductName}
              className="cart-item-img"
            />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.ProductName}</p>
              <p className="cart-item-price">
                Price:{item.ProductValue * item.qty}
              </p>
              <div className="cart-item-quantity-controls">
                <button onClick={() => handleDecrement(item.cartID, item.qty)}>
                  -
                </button>
                <p>Quantity: {item.qty}</p>
                <button onClick={() => handleIncrement(item.cartID, item.qty)}>
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.cartID)}
              className="delete-btn"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-heading">Cart-Summary</div>
          <div className="cart-summary-price">
            <span>Total Price: {totalPrice}</span>
          </div>
          <div className="cart-summary-price">
            <span>Total Qty: {totalQty}</span>
          </div>
          <Link to="/checkout" className="checkout-link">
            <button
              className="btn btn-success btn-md"
              style={{ marginTop: 5 + "px" }}
            >
              Cash on delivery
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartProducts;
