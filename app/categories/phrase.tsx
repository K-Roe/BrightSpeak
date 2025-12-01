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

// Hybrid phrase type
type PhraseCard = {
  text: string;
  image?: string;
};

export default function Phrases() {
  const [childName, setChildName] = useState("Child");
  const [phrases, setPhrases] = useState<PhraseCard[]>([]);

  useEffect(() => {
    const loadEverything = async () => {
      // Load child name
      const savedName = await AsyncStorage.getItem("childProfile");
      if (savedName) {
        const profile = JSON.parse(savedName);
        setChildName(profile.name);
      }

      // Load saved phrases
      const saved = await AsyncStorage.getItem("childPhrases");
      if (saved) {
        const parsed = JSON.parse(saved);

        // New format → array of objects
        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "object") {
          setPhrases(parsed.phrases);
          return;
        }

        // Old format → array of strings → convert
        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "string") {
          const converted = parsed.phrases.map((p: string) => ({ text: p }));
          setPhrases(converted);
          return;
        }
      }

      // Default values
      setPhrases([
        { text: "Good Morning" },
        { text: "Good Night" },
        { text: "Please" },
        { text: "Thank You" },
        { text: "Help" },
        { text: "Sorry" },
        { text: "I Love You" },
        { text: "Kiss" },
        { text: "Hug" },
        { text: "Play" },
        { text: "I'm Hungry" },
        { text: "I'm Thirsty" },
        { text: "Toilet" },
      ]);
    };

    loadEverything();
  }, []);

  const speakPhrase = (text: string) => {
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Phrases</Text>
      <Text style={styles.subtitle}>Tap a phrase, {childName}</Text>

      <View style={styles.grid}>
        {phrases.map((card, index) => (
          <TouchableOpacity
            key={index} // ALWAYS UNIQUE NOW
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => speakPhrase(card.text)}
          >
            {card.image ? (
              <Image source={{ uri: card.image }} style={styles.cardImage} />
            ) : (
              <View style={styles.fallback}>
                <Text style={styles.fallbackIcon}>💬</Text>
              </View>
            )}

            <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
              {card.text}
            </Text>
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
    marginBottom: 30,
  },

  tile: {
    width: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 90,
    borderRadius: 12,
    resizeMode: "contain",
    marginBottom: 8,
  },

  fallback: {
    width: "100%",
    height: 90,
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
    fontSize: 22,
    fontWeight: "800",
    color: "#4F46E5",
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
