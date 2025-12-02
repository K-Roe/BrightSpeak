import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
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

import Input from "../../components/input";

// -----------------------------
// TYPES
// -----------------------------
type FoodCard = {
  name: string;
  image?: string;
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function ParentFood() {
  const [food, setFood] = useState<FoodCard[]>([]);
  const [newFood, setNewFood] = useState("");
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childFood");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed.food) && typeof parsed.food[0] === "object") {
        setFood(parsed.food);
      } else {
        const converted = (parsed.food || []).map((name: string) => ({ name }));
        setFood(converted);
      }
    };
    loadData();
  }, []);

  // -----------------------------
  // SPEAK
  // -----------------------------
  const speakFood = (text: string) => {
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  // -----------------------------
  // PICK IMAGE (Gallery only)
  // -----------------------------
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission required to pick an image!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const localUri = result.assets[0].uri;

    // Create folder
    const folder = FileSystem.documentDirectory + "foodImages/";
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    // Copy file permanently
    const fileName = `food_${Date.now()}.jpg`;
    const newPath = folder + fileName;

    await FileSystem.copyAsync({
      from: localUri,
      to: newPath,
    });

    setPickedImage(newPath);
  };

  // -----------------------------
  // ADD FOOD
  // -----------------------------
  const addFood = async () => {
    if (!newFood.trim()) return;

    const card: FoodCard = {
      name: newFood.trim(),
      image: pickedImage || undefined,
    };

    const updated = [...food, card];
    setFood(updated);

    setNewFood("");
    setPickedImage(null);

    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  // -----------------------------
  // REMOVE
  // -----------------------------
  const removeFood = async (item: FoodCard) => {
    const updated = food.filter((f) => f.name !== item.name);
    setFood(updated);

    await AsyncStorage.setItem("childFood", JSON.stringify({ food: updated }));
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Food & Drink</Text>
      <Text style={styles.subtitle}>Tap a card to hear it aloud</Text>

      {/* INPUT */}
      <Input
        placeholder="Enter food or drink"
        value={newFood}
        onChangeText={setNewFood}
      />

      {/* PICK IMAGE */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {pickedImage ? "Change Image" : "Pick Image (Optional)"}
        </Text>
      </TouchableOpacity>

      {pickedImage && (
        <Image source={{ uri: pickedImage }} style={styles.previewImage} />
      )}

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addButton} onPress={addFood}>
        <Text style={styles.addText}>Add Food</Text>
      </TouchableOpacity>

      {/* GRID */}
      <View style={styles.grid}>
        {food.map((item, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.cardPress}
              activeOpacity={0.8}
              onPress={() => speakFood(item.name)}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              ) : (
                <View style={styles.fallbackImage}>
                  <Text style={styles.fallbackIcon}>🍽️</Text>
                </View>
              )}

              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>

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

// -----------------------------
// STYLES
// -----------------------------
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

  imageButton: {
    backgroundColor: "#60A5FA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
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

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    padding: 10,
    alignItems: "center",
  },

  cardPress: {
    width: "100%",
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 8,
  },

  fallbackImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fallbackIcon: {
    fontSize: 40,
  },

  cardText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
  },

  deleteButton: {
    marginTop: 8,
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
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
