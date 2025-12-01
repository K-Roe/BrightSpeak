import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FoodImagePicker from "../../components/FoodImagePicker";
import Input from "../../components/input";

// --------------------------------------
// TYPES
// --------------------------------------
type FoodItem = {
  name: string;
  image?: string; // file uri
  icon?: string;  // MaterialCommunityIcons name
};

// --------------------------------------
// MAIN SCREEN
// --------------------------------------
export default function ParentFood() {
  const [food, setFood] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState<string>("");

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pendingName, setPendingName] = useState<string>("");

  // ----------------------------------
  // LOAD SAVED FOOD
  // ----------------------------------
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childFood");
      if (saved) {
        const parsed = JSON.parse(saved);

        // If old format = array of strings → convert
        if (Array.isArray(parsed.food) && typeof parsed.food[0] === "string") {
          const converted = parsed.food.map((name: string) => ({ name }));
          setFood(converted);
        } else {
          setFood(parsed.food || []);
        }
      }
    };
    loadData();
  }, []);

  // ----------------------------------
  // SPEAK WORD
  // ----------------------------------
  const speakTheFood = (word: string) => {
    Speech.speak(word, { rate: 1.0, pitch: 1.0 });
  };

  // ----------------------------------
  // STEP 1: Add name → then choose image/icon
  // ----------------------------------
  const beginAddFood = () => {
    const name = newFood.trim();
    if (!name) return;

    setPendingName(name);
    setNewFood("");
    setPickerVisible(true);
  };

  // ----------------------------------
  // STEP 2: After selecting image/icon
  // ----------------------------------
  const finishAddFood = async (data: { image?: string; icon?: string }) => {
    const item: FoodItem = {
      name: pendingName,
      ...data,
    };

    const updated = [...food, item];
    setFood(updated);

    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  // ----------------------------------
  // REMOVE (FIXED)
  // ----------------------------------
  const removeFood = async (toDelete: FoodItem) => {
    const updated = food.filter((p) => p.name !== toDelete.name);
    setFood(updated);
    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  // --------------------------------------
  // RENDER
  // --------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Food & Drink</Text>
      <Text style={styles.subtitle}>Tap a card to hear it spoken</Text>

      <Input
        placeholder="Add a new food or drink"
        value={newFood}
        onChangeText={setNewFood}
      />

      <TouchableOpacity style={styles.addButton} onPress={beginAddFood}>
        <Text style={styles.addText}>Next: Choose Picture</Text>
      </TouchableOpacity>

      {/* IMAGE PICKER MODAL */}
      <FoodImagePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(data) => {
          setPickerVisible(false);
          finishAddFood(data);
        }}
      />

      {/* FLASHCARD GRID */}
      <View style={styles.grid}>
        {food.map((item, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.cardPress}
              activeOpacity={0.8}
              onPress={() => speakTheFood(item.name)}
            >
              {/* IMAGE / ICON */}
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                />
              ) : item.icon ? (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={70}
                  color="#4F46E5"
                />
              ) : (
                <MaterialCommunityIcons
                  name="image-off"
                  size={70}
                  color="#9CA3AF"
                />
              )}

              {/* NAME */}
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>

            {/* DELETE BUTTON */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFood(item)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* BACK */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("../parent-settings")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --------------------------------------
// STYLES
// --------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#4F46E5",
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },

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

  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* FLASHCARDS */
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 25,
    elevation: 4,
    padding: 12,
    alignItems: "center",
  },
  cardPress: {
    width: "100%",
    alignItems: "center",
  },
  cardImage: {
    width: "90%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 10,
  },
  cardText: {
    marginTop: 10,
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

  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
