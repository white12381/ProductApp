import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import  { ProductInput } from "@/type/productType";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProduct, getProductById, updateProductById } from "@/store/slice/productSlice";
const UploadProducts = () => {
  const [form, setForm] = useState<ProductInput>({
    price: 0,
    productName: "",
    image: "",
  });
    const filteredProducts = useAppSelector(state => state.product.singleProduct); 
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    setError("");
    if (!form.productName || !form.price || !form.image) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
  if(id){  dispatch(updateProductById({data: form, id: Number(id)})) 
 
  }   else{ dispatch(addProduct(form));}

      setForm({ image: "", price: 0, productName: "" });

      router.replace("/");
    } catch (err) {
      console.error("Error while saving product:", err);
      setError("Error while saving product");
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    Alert.alert("Select an option", "Choose from library or take a photo", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const file = await getFileFromUri(uri);
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const getFileFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const file = await getFileFromUri(uri);
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  console.log("form", form);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: id ? "Edit Products" : "Upload Products",
    });
  }, [navigation, id]);

  useEffect(() => {
if(id){
  dispatch(getProductById(Number(id)))
}
  },[dispatch, id])
useEffect(() => {
  if (filteredProducts) {
    setForm({
      ...form,
      productName: filteredProducts.productName,
      price: filteredProducts.price,
      image: filteredProducts.image,
    });
  }
}, [filteredProducts]);
  return (
    <ScrollView style={{ padding: 10 }}>
      {loading && <ActivityIndicator />}
      <View className="mt-6 flex-col gap-y-4 pb-10">
        <View>
          <Text className="label">Product Name</Text>
          <TextInput
            readOnly={loading}
            className={"input"}
            value={form.productName}
            placeholder="Enter Product Name"
            onChangeText={(val) => setForm({ ...form, productName: val })}
          />
        </View>

        <View>
          <Text className="label">Price</Text>
          <TextInput
            readOnly={loading}
            keyboardType="decimal-pad"
            value={String(form.price)}
            className={"input"}
            placeholder="Enter Product Price"
            onChangeText={(val) => setForm({ ...form, price: Number(val) })}
          />
        </View>

        <View>
          <Text className="label">Product Image</Text>
          <TouchableOpacity
            disabled={loading}
            onPress={handlePress}
            className="input !h-48 flex-row items-center justify-center relative"
          >
            {form.image ? (
              <Image
                source={{ uri: form.image }}
                style={{ width: "100%", height: "100%", resizeMode: "stretch" }}
              />
            ) : (
              <MaterialCommunityIcons name="image" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
        <Text className="error">{error}</Text>
        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          className="input !bg-primary"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default UploadProducts;
