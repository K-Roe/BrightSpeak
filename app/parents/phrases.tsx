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

type PhraseCard = {
  text: string;
  image?: string;
};

export default function ParentPhrases() {
  const [phrases, setPhrases] = useState<PhraseCard[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sex, setSex] = useState("");
  const [childName, setChildName] = useState("Child");

  const theme = getChildTheme(sex);

  // Load data + theme profile
  useEffect(() => {
    const loadAll = async () => {
      const savedProfile = await AsyncStorage.getItem("childProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setSex(profile.sex || "");
        setChildName(profile.name || "Child");
      }

      const saved = await AsyncStorage.getItem("childPhrases");
      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "string") {
          const converted = parsed.phrases.map((p: string) => ({ text: p }));
          setPhrases(converted);
        } else {
          setPhrases(parsed.phrases || []);
        }
      }
    };

    loadAll();
  }, []);

  const speakThePhrase = (text: string) =>
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });

  // Pick image
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

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  // Add phrase
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

  // Remove phrase
  const removePhrase = async (cardToDelete: PhraseCard) => {
    const updated = phrases.filter((p) => p.text !== cardToDelete.text);
    setPhrases(updated);

    await AsyncStorage.setItem("childPhrases", JSON.stringify({ phrases: updated }));
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}                 // ★ FIXED HERE
      contentContainerStyle={styles.container}              // no bg here anymore
    >
      {/* HEADER BANNER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>💬</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Phrases for {childName}
        </Text>
      </View>

      {/* INPUT CARD */}
      <View style={[styles.card, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.label }]}>
          Add New Phrase
        </Text>

        <Input
          placeholder="Enter phrase"
          value={newPhrase}
          onChangeText={setNewPhrase}
        />

        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: theme.buttonBg }]}
          onPress={pickImage}
        >
          <Text style={styles.imageButtonText}>
            {selectedImage ? "Change Image" : "Add Image (Optional)"}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttonBg }]}
          onPress={addPhrase}
        >
          <Text style={styles.addText}>Add Phrase</Text>
        </TouchableOpacity>
      </View>

      {/* PHRASE GRID */}
      <View style={styles.grid}>
        {phrases.map((card) => (
          <View key={card.text} style={[styles.tile, { backgroundColor: theme.tileBg }]}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakThePhrase(card.text)}
            >
              {card.image ? (
                <Image source={{ uri: card.image }} style={styles.cardImage} />
              ) : (
                <View style={[styles.fallbackImage, { backgroundColor: theme.bg }]}>
                  <Text style={[styles.fallbackIcon, { color: theme.label }]}>💬</Text>
                </View>
              )}

              <Text
                style={[styles.phrase, { color: theme.label }]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
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

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 50,
    alignItems: "center",
    minHeight: "100%",               
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

  phrase: {
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
