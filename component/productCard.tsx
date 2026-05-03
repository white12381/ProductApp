import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

type ProductData = {
  productName?: string;
  className?: string;
  id: number;
  price: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  handleDelete: (id: number) => void; 
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ProductCard({ data }: { data: ProductData }) {
  const router = useRouter();
  const { productName, className, id, handleDelete, createdAt, updatedAt } = data || {};

  return (
    <View
      className={`rounded-2xl overflow-hidden bg-white w-full ${className}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      
      <ImageBackground
        source={{ uri: data?.image }}
        resizeMode="cover" 
          style={{ width: "100%", height: 200 }} 
      >
        <View className="absolute inset-0 bg-black/20" />

        {/* Action Buttons */}
        <View className="absolute top-3 right-3 flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.push(`/(drawer)/uploadProducts?id=${id}`)}
            className="bg-white/90 rounded-full p-2"
            style={{ elevation: 2 }}
          >
            <MaterialIcons name="edit" size={18} color="#176596" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(id!)}
            className="bg-white/90 rounded-full p-2"
            style={{ elevation: 2 }}
          >
            <MaterialIcons name="delete" size={18} color="#e53935" />
          </TouchableOpacity>
        </View>

      </ImageBackground>

      {/* Info Section */}
      <View className="p-4 mt-6 space-y-4">
          
<View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
  <Text
    className="text-base font-semibold text-gray-800"
    
  >
    {productName}
  </Text>
 
    <Text className="text-primary font-bold text-sm ">
      ₦{data?.price?.toLocaleString()}
    </Text> 
</View>

        {/* Dates Row */}
        <View className="mt-4"
        style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}
        >
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="calendar-today" size={13} color="#9ca3af" />
            <Text className="text-xs text-gray-400 font-bold">
              Created:{" "}
              <Text className="text-gray-600 font-medium">
                {formatDate(createdAt)}
              </Text>
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <MaterialIcons name="update" size={13} color="#9ca3af" />
            <Text className="text-xs text-gray-400 font-bold">
              Updated:{" "}
              <Text className="text-gray-600 font-medium">
                {formatDate(updatedAt)}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}