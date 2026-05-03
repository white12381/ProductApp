import React, { useEffect, useState } from "react";
import { 
  Alert, 
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProducts, removeProduct } from "@/store/slice/productSlice";
import ProductType from "@/type/productType";
import ProductCard from "@/component/productCard";
const ViewProducts = () => {
  const [search, setSearch] = useState<string>("");
  const dispatch = useAppDispatch(); 
    const filteredProducts = useAppSelector(getProducts(search)); 
  const deleteProduct = async (productId: number) => { 
    try {
      if (!productId) {
        throw Alert.alert("Invalid Product", "Product not found");
      }
      dispatch(removeProduct(productId));
      console.log("✅ Product deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    } finally {
    }
  };
  return (
    <View style={{ padding: 10 }}>
      <View className="flex-row mt-6" style={{ gap: 8 }}>
        <TextInput
          className="input !w-full"
          value={search}
          placeholder="Search Items"
          onChangeText={(val) => setSearch(val)}
        />
      </View>
      <ScrollView
        className="mt-4 flex-col space-y-10"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {filteredProducts.map((result: ProductType) => (
          <ProductCard
            data={{
              className: "mt-6",
              handleDelete: () =>
                Alert.alert(
                  "Delete Product",
                  "Are you sure you want to delete this?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        deleteProduct(result.id!);
                      },
                    },
                  ],
                ),
              id:result?.id,
               createdAt: result.createdAt, updatedAt: result.updatedAt,
              image: result.image,
              productName: result?.productName,
              price: result?.price,
            }}
            key={result.id}
          />
        ))}
      </ScrollView>
      
    </View>
  );
};
export default ViewProducts;


