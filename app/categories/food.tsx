import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function People() {
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

  const speakTheFood = (food: string) => {
    Speech.speak(food.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const foods = [
    "Water",
    "Juice",
    "Milk",
    "Apple",
    "Banana",
    "Sandwich",
    "Ice Cream",
    "Breakfast",
    "Lunch",
    "Dinner",
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food or Drink</Text>
      <Text style={styles.subtitle}>Tap a Food or Drink, {childName}</Text>

      <View style={styles.grid}>
        {foods.map((food) => (
          <TouchableOpacity
            key={food}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
              speakTheFood(food);
            }}
          >
            <Text style={styles.food} numberOfLines={2} adjustsFontSizeToFit>
              {food}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/child-categories")}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 3,
  },
  food: {
    fontSize: 28,
    fontWeight: "800",
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
