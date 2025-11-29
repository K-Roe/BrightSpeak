import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/input";

export default function ParentFood() {
  const [food, setFood] = useState<string[]>([]);
  const [newFood, setNewFood] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childFood");
      if (saved) {
        const childFood = JSON.parse(saved);
        setFood(childFood.food || []);
      }
    };
    loadData();
  }, []);

  const speakTheFood = (word: string) => {
    Speech.speak(word.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const addFood = async () => {
    if (!newFood.trim()) return;

    const updated = [...food, newFood.trim()];
    setFood(updated);
    setNewFood("");

    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  const removeFood = async (foodToDelete: string) => {
    const updated = food.filter((p) => p !== foodToDelete);
    setFood(updated);

    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Food and Drink</Text>
      <Text style={styles.subtitle}>Tap a phrase to hear it aloud</Text>

      {/* --- Input + Add Button AT THE TOP --- */}
      <Input
        placeholder="Add a new food or drink"
        value={newFood}
        onChangeText={setNewFood}
      />

      <TouchableOpacity style={styles.addButton} onPress={addFood}>
        <Text style={styles.addText}>Add Food or Drink</Text>
      </TouchableOpacity>

      {/* --- Grid of phrases --- */}
      <View style={styles.grid}>
        {food.map((drinks) => (
          <View key={drinks} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakTheFood(drinks)}
            >
              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {drinks}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFood(drinks)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("../parent-settings")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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

  /* INPUT + ADD BUTTON */
  addButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  addText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* GRID */
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tile: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    padding: 10,
    alignItems: "center",
  },
  tilePress: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  phrase: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* BACK BUTTON */
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
