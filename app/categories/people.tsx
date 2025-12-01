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

type PeopleCard = {
  name: string;
  image?: string; // local image URI
  icon?: string;
};

export default function People() {
  const [childName, setChildName] = useState("Child");
  const [peoples, setPeoples] = useState<PeopleCard[]>([]);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };

    const loadPeople = async () => {
      const saved = await AsyncStorage.getItem("childPeople");

      if (saved) {
        const parsed = JSON.parse(saved);

        // New format (array of objects)
        if (Array.isArray(parsed.peoples) && typeof parsed.peoples[0] === "object") {
          setPeoples(parsed.peoples);
        } else {
          // Old format: convert ["Mummy","Daddy"] → { name }
          const converted = (parsed.peoples || []).map((name: string) => ({
            name,
          }));
          setPeoples(converted);
        }
      } else {
        // Default list (converted to new format)
        const defaults = [
          "Mummy",
          "Daddy",
          "Brother",
          "Sister",
          "Nanna",
          "Granddad",
          "Friend",
          "Teacher",
        ].map((name) => ({ name }));

        setPeoples(defaults);
      }
    };

    loadPeople();
    loadName();
  }, []);

  const speakThePhrase = (text: string) => {
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>People</Text>
      <Text style={styles.subtitle}>Tap a person, {childName}</Text>

      <View style={styles.grid}>
        {peoples.map((person, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => speakThePhrase(person.name)}
          >
            {/* IMAGE or FALLBACK ICON */}
            {person.image ? (
              <Image source={{ uri: person.image }} style={styles.cardImage} />
            ) : (
              <View style={styles.fallbackImage}>
                <Text style={styles.fallbackIcon}>👤</Text>
              </View>
            )}

            <Text style={styles.people} numberOfLines={2} adjustsFontSizeToFit>
              {person.name}
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

// ----------------------------------------
// STYLES
// ----------------------------------------
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
    borderRadius: 14,
    resizeMode: "cover",
    marginBottom: 6,
  },

  fallbackImage: {
    width: "100%",
    height: 90,
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  fallbackIcon: {
    fontSize: 40,
  },

  people: {
    fontSize: 20,
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
