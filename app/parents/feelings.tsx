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
  View
} from "react-native";
import Input from "../../components/input";

type FeelingCard = {
  name: string;
  image?: string; // local uri
  icon?: string;
};

export default function ParentFeelings() {
  const [feelings, setFeelings] = useState<FeelingCard[]>([]);
  const [newFeeling, setNewFeeling] = useState<string>("");
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  // -----------------------------
  // LOAD EXISTING FEELINGS
  // -----------------------------
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childFeelings");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      // If already new hybrid format
      if (Array.isArray(parsed.feelings) && typeof parsed.feelings[0] === "object") {
        setFeelings(parsed.feelings);
      } else {
        // Convert legacy strings → card objects
        const converted = (parsed.feelings || []).map((name: string) => ({
          name,
        }));
        setFeelings(converted);
      }
    };

    loadData();
  }, []);

  // -----------------------------
  // SPEAK CARD
  // -----------------------------
  const speakFeeling = (text: string) => {
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  // -----------------------------
  // PICK IMAGE
  // -----------------------------
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setPickedImage(result.assets[0].uri);
    }
  };

  // -----------------------------
  // ADD FEELING
  // -----------------------------
  const addFeeling = async () => {
    if (!newFeeling.trim()) {
      alert("Please enter a feeling.");
      return;
    }

    const lower = newFeeling.trim().toLowerCase();
    if (lower.includes(" ")) {
      alert("One-word only. E.g. Happy, Sad, Angry.");
      return;
    }

    const card: FeelingCard = {
      name: `I feel ${newFeeling.trim()}`,
      image: pickedImage || undefined,
    };

    const updated = [...feelings, card];
    setFeelings(updated);

    setNewFeeling("");
    setPickedImage(null);

    await AsyncStorage.setItem("childFeelings", JSON.stringify({ feelings: updated }));
  };

  // -----------------------------
  // DELETE FEELING
  // -----------------------------
  const removeFeeling = async (toDelete: FeelingCard) => {
    const updated = feelings.filter((f) => f !== toDelete);

    setFeelings(updated);
    await AsyncStorage.setItem("childFeelings", JSON.stringify({ feelings: updated }));
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Feelings</Text>
      <Text style={styles.subtitle}>Create “I feel ...” cards</Text>

      {/* Add New Feeling */}
      <Input
        placeholder="Feeling (one word)"
        value={newFeeling}
        onChangeText={setNewFeeling}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {pickedImage ? "Change Image" : "Pick an Image (Optional)"}
        </Text>
      </TouchableOpacity>

      {pickedImage && (
        <Image source={{ uri: pickedImage }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addFeeling}>
        <Text style={styles.addText}>Add Feeling</Text>
      </TouchableOpacity>

      {/* Existing Cards */}
      <View style={styles.grid}>
        {feelings.map((f, index) => (
          <View key={index} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakFeeling(f.name)}
            >
              {f.image ? (
                <Image source={{ uri: f.image }} style={styles.cardImage} />
              ) : (
                <View style={styles.fallbackImage}>
                  <Text style={styles.fallbackIcon}>😊</Text>
                </View>
              )}

              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {f.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFeeling(f)}
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

  phrase: {
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
