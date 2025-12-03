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

// ⭐ THEME SUPPORT
import { getChildTheme } from "../theme/childTheme";

// Hybrid phrase type
type PhraseCard = {
  text: string;
  image?: string;
};

export default function Phrases() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");
  const [phrases, setPhrases] = useState<PhraseCard[]>([]);

  useEffect(() => {
    const loadEverything = async () => {
      // Load child profile
      const savedName = await AsyncStorage.getItem("childProfile");
      if (savedName) {
        const profile = JSON.parse(savedName);
        setChildName(profile.name);
        setSex(profile.sex || "");
      }

      // Load saved phrases
      const saved = await AsyncStorage.getItem("childPhrases");
      if (saved) {
        const parsed = JSON.parse(saved);

        // New object format
        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "object") {
          setPhrases(parsed.phrases);
          return;
        }

        // Old string-only format → convert
        if (Array.isArray(parsed.phrases) && typeof parsed.phrases[0] === "string") {
          const converted = parsed.phrases.map((p: string) => ({ text: p }));
          setPhrases(converted);
          return;
        }
      }

      // Default fallback phrases
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

  // 🌈 THEME
  const theme = getChildTheme(sex);

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* ⭐ BANNER HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>💬</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Phrases
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a phrase, {childName}
        </Text>
      </View>

      {/* GRID OF PHRASES */}
      <View style={styles.grid}>
        {phrases.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => speakPhrase(card.text)}
          >
            {card.image ? (
              <Image source={{ uri: card.image }} style={styles.cardImage} />
            ) : (
              <View
                style={[styles.fallback, { backgroundColor: theme.tileBg }]}
              >
                <Text style={[styles.fallbackIcon, { color: theme.label }]}>
                  💬
                </Text>
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
        ))}
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.backText}>🡰 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ----------------------------------------
// STYLES
// ----------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
    minHeight: "100%",
  },

  // ⭐ BANNER
  banner: {
    width: "90%",
    paddingVertical: 25,
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
    fontSize: 30,
    fontWeight: "900",
  },
  bannerSubtitle: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: "600",
  },

  // ⭐ GRID
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tile: {
    width: "45%",
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 10,
  },

  fallback: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  fallbackIcon: {
    fontSize: 42,
  },

  phrase: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
