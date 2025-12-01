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

type PhraseCard = {
  text: string;
  image?: string; // local URI
};

export default function ParentPhrases() {
  const [phrases, setPhrases] = useState<PhraseCard[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childPhrases");
      if (saved) {
        const parsed = JSON.parse(saved);

        // If old format (string array), convert → {text}
        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "string") {
          const converted = parsed.phrases.map((p: string) => ({ text: p }));
          setPhrases(converted);
        } else {
          setPhrases(parsed.phrases || []);
        }
      }
    };
    loadData();
  }, []);

  const speakThePhrase = (text: string) => {
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  // -----------------------------
  // PICK IMAGE
  // -----------------------------
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to pick images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // -----------------------------
  // ADD A PHRASE
  // -----------------------------
  const addPhrase = async () => {
    if (!newPhrase.trim()) return;

    const newCard: PhraseCard = {
      text: newPhrase.trim(),
      image: selectedImage ?? undefined,
    };

    const updated = [...phrases, newCard];

    setPhrases(updated);
    setNewPhrase("");
    setSelectedImage(null);

    await AsyncStorage.setItem("childPhrases", JSON.stringify({ phrases: updated }));
  };

  // -----------------------------
  // REMOVE A PHRASE
  // -----------------------------
  const removePhrase = async (cardToDelete: PhraseCard) => {
    const updated = phrases.filter((p) => p.text !== cardToDelete.text);
    setPhrases(updated);

    await AsyncStorage.setItem("childPhrases", JSON.stringify({ phrases: updated }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Phrases</Text>
      <Text style={styles.subtitle}>Tap a phrase to hear it aloud</Text>

      {/* Input */}
      <Input
        placeholder="Add a new phrase"
        value={newPhrase}
        onChangeText={setNewPhrase}
      />

      {/* Pick image */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {selectedImage ? "Change Image" : "Add Image (Optional)"}
        </Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={addPhrase}>
        <Text style={styles.addText}>Add Phrase</Text>
      </TouchableOpacity>

      {/* List Grid */}
      <View style={styles.grid}>
        {phrases.map((card) => (
          <View key={card.text} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakThePhrase(card.text)}
            >
              {/* Image if exists */}
              {card.image ? (
                <Image source={{ uri: card.image }} style={styles.cardImage} />
              ) : (
                <View style={styles.fallbackImage}>
                  <Text style={styles.fallbackIcon}>💬</Text>
                </View>
              )}

              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {card.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removePhrase(card)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("../parent-settings")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------------------------------
// STYLES
// ------------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
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
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
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
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
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
    padding: 10,
    elevation: 3,
    alignItems: "center",
  },

  tilePress: {
    width: "100%",
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: 90,
    borderRadius: 14,
    marginBottom: 8,
  },
  fallbackImage: {
    width: "100%",
    height: 90,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fallbackIcon: {
    fontSize: 38,
  },

  phrase: {
    fontSize: 20,
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
