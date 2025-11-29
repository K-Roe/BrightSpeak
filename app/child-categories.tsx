import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const categories = [
  {
    id: "food",
    label: "Food",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
  },
  {
    id: "drink",
    label: "Drink",
    image: "https://cdn-icons-png.flaticon.com/512/3048/3048127.png"
  },
  {
    id: "numbers",
    label: "Numbers",
    image: "https://cdn-icons-png.flaticon.com/512/123/123359.png",
    route: "/categories/numbers"
  },
  {
  id: "alphabet",
  label: "Alphabet",
  image: "https://cdn-icons-png.flaticon.com/512/123/123367.png",
      route: "/categories/letters"
 },
  {
    id: "play",
    label: "Play",
    image: "https://cdn-icons-png.flaticon.com/512/3103/3103478.png"
  },
  {
    id: "videos",
    label: "Videos",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
  },
  {
    id: "emotions",
    label: "Feelings",
    image: "https://cdn-icons-png.flaticon.com/512/742/742752.png"
  },
  {
    id: "help",
    label: "Help",
    image: "https://cdn-icons-png.flaticon.com/512/463/463612.png"
  },
];

export default function ChildCategories() {
    const [childName, setChildName] = useState("Child");
useEffect(() => {
  const loadName = async () => {
    const saved = await AsyncStorage.getItem("childProfile");
    if (saved) {
      const profile = JSON.parse(saved);
      setChildName(profile.name);
    }
  };
  loadName();
}, []);
    return (
    <View style={styles.container}>
        <Text style={styles.title}>Hello, {childName}!</Text>
      <Text style={styles.title}>Choose One</Text>

      <View style={styles.grid}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
    if (cat.route) {
      router.push(cat.route);
    }
  }}
          >
            <Image source={{ uri: cat.image }} style={styles.icon} />
            <Text style={styles.label}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
             <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1F2937",
  },

  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  tile: {
    width: "40%",
    height: 140,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    elevation: 3,
  },

  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

   button: {
    backgroundColor: "#4F46E5",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
