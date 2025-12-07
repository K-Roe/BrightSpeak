import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { getChildTheme } from "../theme/childTheme";

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
  const [sex, setSex] = useState("");
  const [childName, setChildName] = useState("Child");

  const theme = getChildTheme(sex);

  // -----------------------------
  // LOAD DATA + PROFILE
  // -----------------------------
  useEffect(() => {
    const loadData = async () => {
      const savedProfile = await AsyncStorage.getItem("childProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setSex(profile.sex || "");
        setChildName(profile.name || "Child");
      }

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
  // PICK IMAGE
  // -----------------------------
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission required to pick an image!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setPickedImage(result.assets[0].uri);
    }
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
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* HEADER BANNER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>🍎</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Food & Drink for {childName}
        </Text>
      </View>

      {/* INPUT CARD */}
      <View style={[styles.card, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.label }]}>
          Add Food or Drink
        </Text>

        <Input
          placeholder="Enter food or drink"
          value={newFood}
          onChangeText={setNewFood}
        />

        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: theme.buttonBg }]}
          onPress={pickImage}
        >
          <Text style={styles.imageButtonText}>
            {pickedImage ? "Change Image" : "Add Image (Optional)"}
          </Text>
        </TouchableOpacity>

        {pickedImage && (
          <Image source={{ uri: pickedImage }} style={styles.previewImage} />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttonBg }]}
          onPress={addFood}
        >
          <Text style={styles.addText}>Add Food</Text>
        </TouchableOpacity>
      </View>

      {/* FOOD GRID */}
      <View style={styles.grid}>
        {food.map((item, idx) => (
          <View
            key={idx}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
          >
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakFood(item.name)}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              ) : (
                <View
                  style={[
                    styles.fallbackImage,
                    { backgroundColor: theme.bg },
                  ]}
                >
                  <Text style={[styles.fallbackIcon, { color: theme.label }]}>
                    🍽️
                  </Text>
                </View>
              )}

              <Text
                style={[styles.cardText, { color: theme.label }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
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

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.replace("../parent-settings")}
      >
        <Text style={styles.backText}>🡰 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ----------------------------- */
/* STYLES */
/* ----------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 50,
    alignItems: "center",
    minHeight: "100%", // ★ ensures theme fills screen
  },

  banner: {
    width: "100%",
    padding: 25,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 25,
    elevation: 3,
  },
  bannerIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
  },

  card: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },

  imageButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
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
    width: 120,
    height: 120,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },

  addButton: {
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 5,
    alignItems: "center",
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

  tile: {
    width: "48%",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
  },

  tilePress: {
    width: "100%",
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },

  fallbackImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fallbackIcon: {
    fontSize: 42,
  },

  cardText: {
    fontSize: 20,
    fontWeight: "700",
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
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
