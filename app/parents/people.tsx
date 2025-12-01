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

// Hybrid card type
type PeopleCard = {
  name: string;
  image?: string; // local image URI
  icon?: string;
};

export default function ParentPeople() {
  const [peoples, setPeoples] = useState<PeopleCard[]>([]);
  const [newPeople, setNewPeople] = useState<string>("");
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  // ----------------------------------------
  // LOAD EXISTING DATA
  // ----------------------------------------
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childPeople");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      // New format: array of objects
      if (Array.isArray(parsed.peoples) && typeof parsed.peoples[0] === "object") {
        setPeoples(parsed.peoples);
      } else {
        // OLD format: simple string array
        const converted = (parsed.peoples || []).map((name: string) => ({
          name,
        }));
        setPeoples(converted);
      }
    };
    loadData();
  }, []);

  // ----------------------------------------
  // SPEAK
  // ----------------------------------------
  const speakPerson = (text: string) => {
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  // ----------------------------------------
  // IMAGE PICKER
  // ----------------------------------------
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission required to pick an image!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setPickedImage(result.assets[0].uri);
    }
  };

  // ----------------------------------------
  // ADD PERSON
  // ----------------------------------------
  const addPerson = async () => {
    if (!newPeople.trim()) return;

    const card: PeopleCard = {
      name: newPeople.trim(),
      image: pickedImage || undefined,
    };

    const updated = [...peoples, card];
    setPeoples(updated);

    setNewPeople("");
    setPickedImage(null);

    await AsyncStorage.setItem(
      "childPeople",
      JSON.stringify({ peoples: updated })
    );
  };

  // ----------------------------------------
  // DELETE (FIXED)
  // ----------------------------------------
  const removePerson = async (toDelete: PeopleCard) => {
    const updated = peoples.filter((p) => p.name !== toDelete.name);

    setPeoples(updated);

    await AsyncStorage.setItem(
      "childPeople",
      JSON.stringify({ peoples: updated })
    );
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage People</Text>
      <Text style={styles.subtitle}>Add family, friends, teachers, etc.</Text>

      {/* INPUT */}
      <Input
        placeholder="Enter a person (e.g., Mummy, Daddy, Teacher)"
        value={newPeople}
        onChangeText={setNewPeople}
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
      <TouchableOpacity style={styles.addButton} onPress={addPerson}>
        <Text style={styles.addText}>Add Person</Text>
      </TouchableOpacity>

      {/* GRID */}
      <View style={styles.grid}>
        {peoples.map((person, index) => (
          <View key={index} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakPerson(person.name)}
            >
              {person.image ? (
                <Image source={{ uri: person.image }} style={styles.cardImage} />
              ) : (
                <View style={styles.fallbackImage}>
                  <Text style={styles.fallbackIcon}>👤</Text>
                </View>
              )}

              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {person.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removePerson(person)}
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

// ----------------------------------------
// STYLES
// ----------------------------------------
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
