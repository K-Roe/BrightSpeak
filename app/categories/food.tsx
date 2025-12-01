import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Type for the new hybrid card system
type FoodItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Food() {
  const [childName, setChildName] = useState("Child");
  const [foods, setFoods] = useState<FoodItem[]>([]);

  // ---------------------------------------------------
  // LOAD CHILD NAME + FOOD ITEMS
  // ---------------------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      // child name
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        setChildName(JSON.parse(saved).name);
      }

      // food items
      const savedFood = await AsyncStorage.getItem("childFood");
      if (savedFood) {
        const data = JSON.parse(savedFood);

        // New format → full objects
        if (Array.isArray(data.food) && typeof data.food[0] === "object") {
          setFoods(data.food);
        } else {
          // Old format → strings → convert to objects
          const fallback = (data.food || []).map((f: string) => ({ name: f }));
          setFoods(fallback);
        }

      } else {
        // DEFAULT FOOD options
        const defaultFoods = [
          { name: "Water", icon: "cup-water" },
          { name: "Juice", icon: "cup" },
          { name: "Milk", icon: "cow" },
          { name: "Apple", icon: "apple" },
          { name: "Banana", icon: "food-apple" },
          { name: "Sandwich", icon: "food" },
          { name: "Ice Cream", icon: "ice-cream" },
          { name: "Breakfast", icon: "coffee" },
          { name: "Lunch", icon: "silverware-fork-knife" },
          { name: "Dinner", icon: "food-steak" },
        ];
        setFoods(defaultFoods);
      }
    };

    loadAll();
  }, []);

  // ---------------------------------------------------
  // SPEAK
  // ---------------------------------------------------
  const speakTheFood = (word: string) => {
    Speech.speak(word, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food & Drink</Text>
      <Text style={styles.subtitle}>Tap a card, {childName}</Text>

      <View style={styles.grid}>
        {foods.map((item: FoodItem, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => speakTheFood(item.name)}
          >
            {/* IMAGE FIRST */}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}

            {/* ICON IF NO IMAGE */}
            {!item.image && item.icon && (
              <MaterialCommunityIcons
                name={item.icon}
                size={60}
                color="#4F46E5"
                style={{ marginBottom: 10 }}
              />
            )}

            {/* FALLBACK BOX IF NEITHER */}
            {!item.image && !item.icon && (
              <View style={styles.fallbackIcon}>
                <MaterialCommunityIcons
                  name="food"
                  size={50}
                  color="#94A3B8"
                />
              </View>
            )}

            <Text style={styles.foodName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------------------------------------------
// STYLES
// ---------------------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#4F46E5",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },

  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tile: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "90%",
    height: 90,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 10,
  },

  fallbackIcon: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  foodName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
