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

// ⭐ Theme import
import { getChildTheme } from "../theme/childTheme";

// Hybrid card type
type FeelingItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Feelings() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");
  const [feelings, setFeelings] = useState<FeelingItem[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      // Load child profile
      const savedName = await AsyncStorage.getItem("childProfile");
      if (savedName) {
        const profile = JSON.parse(savedName);
        setChildName(profile.name);
        setSex(profile.sex || "");
      }

      // Load saved feelings
      const savedFeelingData = await AsyncStorage.getItem("childFeelings");

      if (!savedFeelingData) {
        loadDefaults();
        return;
      }

      const parsed = JSON.parse(savedFeelingData);

      // If no array or empty → defaults
      if (!Array.isArray(parsed.feelings) || parsed.feelings.length === 0) {
        loadDefaults();
        return;
      }

      // New format → objects
      if (typeof parsed.feelings[0] === "object") {
        setFeelings(parsed.feelings);
        return;
      }

      // Old format → convert strings
      const converted = parsed.feelings.map((f: string) => ({ name: f }));
      setFeelings(converted);
    };

    loadAll();
  }, []);

  // THEME
  const theme = getChildTheme(sex);

  // ----------------------------------
  // DEFAULT FEELINGS
  // ----------------------------------
  function loadDefaults() {
    const defaults: FeelingItem[] = [
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
    ];

    setFeelings(defaults);
  }

  // Speak feeling on tap
  const speakTheFeeling = (word: string) => {
    Speech.speak(word, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>Feelings</Text>
      <Text style={[styles.subtitle, { color: theme.label }]}>
        Tap a feeling, {childName}
      </Text>

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
              <View style={[styles.fallbackIcon, { backgroundColor: theme.tileBg }]}>
                <MaterialCommunityIcons
                  name="emoticon-outline"
                  size={50}
                  color={theme.label}
                />
              </View>
            )}

            <Text style={[styles.feel, { color: theme.label }]} numberOfLines={2}>
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
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
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 20,
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
    marginBottom: 20,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
