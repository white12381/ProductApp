import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ProductType, { ProductInput } from "@/type/productType";
import { Alert } from "react-native";
import { RootState } from "..";

type ProductState = {
  products: ProductType[];
  singleProduct: ProductType | null;
};

const initialState: ProductState = {
  products: [
   
  ],
  singleProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductInput>) => {
      if (state.products.length >= 5) {
        Alert.alert("Limit Reached", "Maximum of 5 products allowed");
        return;
      }
      state.products.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Product added successfully");
    },
    updateProductById: (state, action: PayloadAction<{ id: number; data: ProductInput }>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload.data,
          updatedAt: new Date().toISOString(),
        };
        Alert.alert("Success", "Product updated successfully");
        return;
      }
      Alert.alert("Error", "Product not found");
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      if (state.products.find((p) => p.id === action.payload)) {
        state.products = state.products.filter((p) => p.id !== action.payload);
      } else {
        Alert.alert("Error", "Product not found");
        return;
      }

      Alert.alert("Success", "Product removed successfully");
    },

    getProductById: (state, action: PayloadAction<number>) => {
      state.singleProduct =
        state.products.find((p) => p.id === action.payload) || null;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  getProductById,
  updateProductById,
} = productSlice.actions;
export default productSlice.reducer;




export const getProducts = (search: string) =>
  createSelector(
    (state: RootState) => state.product.products,
    (products) =>
      products.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      ) ?? []
  );
