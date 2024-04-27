import { createSlice } from "@reduxjs/toolkit";
import { db } from "../config/Config";

const initialState = {
  cartItems: [],
  totalPrice: 0,
  totalQty: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartItemsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCartItemsSuccess(state, action) {
      state.loading = false;
      state.cartItems = action.payload;
      state.totalQty = action.payload.reduce(
        (total, item) => total + item.qty,
        0
      );
      state.totalPrice = action.payload.reduce(
        (total, item) => total + item.ProductValue * item.qty,
        0
      );
    },
    fetchCartItemsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetCartState(state) {
      state.cartItems = [];
      state.totalPrice = 0;
      state.totalQty = 0;
      state.loading = false;
      state.error = null;
    },
    addToCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess(state, action) {
      state.loading = false;
      const { cartID } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.cartID === cartID
      );

      if (existingItemIndex !== -1) {
        state.cartItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, qty: item.qty + 1 };
          }
          return item;
        });
      } else {
        state.cartItems = [...state.cartItems, { ...action.payload, qty: 1 }];
      }

      state.totalQty = state.cartItems.reduce(
        (total, item) => total + item.qty,
        0
      );
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.ProductValue * item.qty,
        0
      );
    },
    incrementCartItem(state, action) {
      const { cartID } = action.payload;
      const item = state.cartItems.find((item) => item.cartID === cartID);
      if (item) {
        item.qty += 1;
        state.totalQty += 1;
        state.totalPrice += item.ProductValue;
      }
    },
    decrementCartItem(state, action) {
      const { cartID } = action.payload;
      const item = state.cartItems.find((item) => item.cartID === cartID);
      if (item && item.qty > 1) {
        item.qty -= 1;
        state.totalQty -= 1;
        state.totalPrice -= item.ProductValue;
      }
    },
    removeCartItem(state, action) {
      const { cartID } = action.payload;
      const index = state.cartItems.findIndex((item) => item.cartID === cartID);
      if (index !== -1) {
        state.totalQty -= state.cartItems[index].qty;
        state.totalPrice -=
          state.cartItems[index].ProductValue * state.cartItems[index].qty;
        state.cartItems.splice(index, 1);

        db.collection("cart")
          .doc(cartID)
          .delete()
          .then(() => {
            console.log("Document successfully deleted from Firestore!");
          })
          .catch((error) => {
            console.error("Error removing document from Firestore: ", error);
          });
      }
    },
    addToCartFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItem(state, action) {
      const { cartID, qty } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.cartID === cartID
      );

      if (itemIndex !== -1) {
        state.cartItems[itemIndex].qty = qty;
        state.totalQty = state.cartItems.reduce(
          (total, item) => total + item.qty,
          0
        );
        state.totalPrice = state.cartItems.reduce(
          (total, item) => total + item.ProductValue * item.qty,
          0
        );
      }
    },
  },
});

export const fetchCartItems = () => {
  return async (dispatch) => {
    try {
      dispatch(cartSlice.actions.fetchCartItemsStart());
      const cartItemsCollection = await db.collection("cart").get();
      const cartItemsData = cartItemsCollection.docs.map((doc) => ({
        cartID: doc.id,
        ...doc.data(),
        qty: doc.data().qty || 1,
      }));
      dispatch(cartSlice.actions.fetchCartItemsSuccess(cartItemsData));
    } catch (error) {
      dispatch(cartSlice.actions.fetchCartItemsFailure(error.message));
    }
  };
};

export const addToCart = (product) => {
  return async (dispatch, getState) => {
    try {
      dispatch(cartSlice.actions.addToCartStart());

      const state = getState();
      const existingItem = state.cart.cartItems.find(
        (item) =>
          item.ProductName === product.ProductName &&
          item.ProductValue === product.ProductValue &&
          item.ProductImage === product.ProductImage
      );

      if (existingItem) {
        const updatedQty = existingItem.qty + 1;
        const updatedTotalPrice = product.ProductValue * updatedQty;
        await db
          .collection("cart")
          .doc(existingItem.cartID)
          .update({ qty: updatedQty, TotalProductPrice: updatedTotalPrice });
        dispatch(
          cartSlice.actions.updateCartItem({
            cartID: existingItem.cartID,
            qty: updatedQty,
          })
        );
      } else {
        const docRef = await db.collection("cart").add(product);
        dispatch(
          cartSlice.actions.addToCartSuccess({ ...product, cartID: docRef.id })
        );
      }
    } catch (error) {
      dispatch(cartSlice.actions.addToCartFailure(error.message));
    }
  };
};

export const resetCart = () => {
  return {
    type: "cart/resetCart",
  };
};

export const { incrementCartItem, decrementCartItem, removeCartItem } =
  cartSlice.actions;

export const cartActions = cartSlice.actions;

export default cartSlice;
