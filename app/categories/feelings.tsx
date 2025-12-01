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

// Hybrid card type
type FeelingItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Feelings() {
  const [childName, setChildName] = useState("Child");
  const [feelings, setFeelings] = useState<FeelingItem[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      // Load child name
      const savedName = await AsyncStorage.getItem("childProfile");
      if (savedName) {
        setChildName(JSON.parse(savedName).name);
      }

      // Load feelings
      const savedFeelingData = await AsyncStorage.getItem("childFeelings");
      if (savedFeelingData) {
        const parsed = JSON.parse(savedFeelingData);

        // If already the new hybrid format
        if (Array.isArray(parsed.feelings) && typeof parsed.feelings[0] === "object") {
          setFeelings(parsed.feelings);
        } else {
          // Convert old string-only values
          const converted = (parsed.feelings || []).map((f: string) => ({ name: f }));
          setFeelings(converted);
        }
      } else {
        // Default hybrid list with icons
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
    };

    loadAll();
  }, []);

  // Speak feeling on tap
  const speakTheFeeling = (word: string) => {
    Speech.speak(word, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feelings</Text>
      <Text style={styles.subtitle}>Tap a feeling, {childName}</Text>

      <View style={styles.grid}>
        {feelings.map((f: FeelingItem, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => speakTheFeeling(f.name)}
          >
            {/* Use image if present */}
            {f.image && (
              <Image source={{ uri: f.image }} style={styles.image} />
            )}

            {/* Otherwise use icon */}
            {!f.image && f.icon && (
              <MaterialCommunityIcons
                name={f.icon}
                size={60}
                color="#4F46E5"
                style={{ marginBottom: 10 }}
              />
            )}

            {/* Fallback grey box */}
            {!f.image && !f.icon && (
              <View style={styles.fallbackIcon}>
                <MaterialCommunityIcons
                  name="emoticon-outline"
                  size={50}
                  color="#94A3B8"
                />
              </View>
            )}

            <Text style={styles.feel} numberOfLines={2} adjustsFontSizeToFit>
              {f.name}
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
    marginBottom: 5,
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
  },

  tile: {
    width: "48%",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  feel: {
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
    marginTop: 20,
    marginBottom: 20,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
