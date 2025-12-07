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
import { getChildTheme } from "../theme/childTheme";


type FeelingItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Feelings() {
  const [childName, setChildName] = useState("Child");
  const [themeColor, setThemeColor] = useState("neutral");
  const [feelings, setFeelings] = useState<FeelingItem[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      const savedName = await AsyncStorage.getItem("childProfile");
      if (savedName) {
        const profile = JSON.parse(savedName);
        setChildName(profile.name);
        setThemeColor(profile.themeColor || "neutral");
      }

      const savedFeelingData = await AsyncStorage.getItem("childFeelings");

      if (!savedFeelingData) {
        loadDefaults();
        return;
      }

      const parsed = JSON.parse(savedFeelingData);

      if (!Array.isArray(parsed.feelings) || parsed.feelings.length === 0) {
        loadDefaults();
        return;
      }

      if (typeof parsed.feelings[0] === "object") {
        setFeelings(parsed.feelings);
        return;
      }

      // legacy list → convert
      const converted = parsed.feelings.map((f: string) => ({ name: f }));
      setFeelings(converted);
    };

    loadAll();
  }, []);

const theme = getChildTheme(themeColor);

  // ----------------------------------
  // DEFAULT FEELINGS
  // ----------------------------------
  function loadDefaults() {
    setFeelings([
      { name: "I Feel Happy", icon: "emoticon-happy" },
      { name: "I Feel Sad", icon: "emoticon-sad" },
      { name: "I Feel Angry", icon: "emoticon-angry" },
      { name: "I Feel Scared", icon: "emoticon-frown" },
      { name: "I Feel Tired", icon: "sleep" },
      { name: "I Feel Sick", icon: "emoticon-cry" },
      { name: "I Feel Excited", icon: "emoticon-excited" },
      { name: "I Feel Brave", icon: "shield-star" },
      { name: "I Feel Lonely", icon: "emoticon-neutral" },
      { name: "I Feel Silly", icon: "emoticon-wink" },
      { name: "I Feel Hungry", icon: "food" },
      { name: "I Feel Thirsty", icon: "cup-water" },
    ]);
  }

  const speakTheFeeling = (text: string) => {
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* ⭐ BANNER HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>😊</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Feelings
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a feeling, {childName}
        </Text>
      </View>

      {/* ⭐ FEELING GRID */}
      <View style={styles.grid}>
        {feelings.map((f: FeelingItem, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => speakTheFeeling(f.name)}
          >
            {/* Image */}
            {f.image && (
              <Image source={{ uri: f.image }} style={styles.image} />
            )}

            {/* Icon */}
            {!f.image && f.icon && (
              <MaterialCommunityIcons
                name={f.icon}
                size={60}
                color={theme.label}
                style={{ marginBottom: 10 }}
              />
            )}

            {/* Fallback */}
            {!f.image && !f.icon && (
              <View
                style={[styles.fallbackIcon, { backgroundColor: theme.tileBg }]}
              >
                <MaterialCommunityIcons
                  name="emoticon-outline"
                  size={50}
                  color={theme.label}
                />
              </View>
            )}

            <Text
              style={[styles.feel, { color: theme.label }]}
              numberOfLines={2}
            >
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⭐ BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.replace("/child-categories")}
      >
        <Text style={styles.backText}>🡰 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
    width: "48%",
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "90%",
    height: 90,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 10,
  },

  fallbackIcon: {
    width: 90,
    height: 90,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  feel: {
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
