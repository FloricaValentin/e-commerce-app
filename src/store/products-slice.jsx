import { createSlice } from "@reduxjs/toolkit";
import { db } from "../config/Config";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      dispatch(productsSlice.actions.fetchProductsStart());
      const productsCollection = await db.collection("Products").get();
      const productsData = productsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(productsSlice.actions.fetchProductsSuccess(productsData));
    } catch (error) {
      dispatch(productsSlice.actions.fetchProductsFailure(error.message));
    }
  };
};

export const productsActions = productsSlice.actions;

export default productsSlice;
