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

type PeopleCard = {
  name: string;
  image?: string;
  icon?: string;
};

export default function People() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");
  const [peoples, setPeoples] = useState<PeopleCard[]>([]);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setSex(profile.sex || "");
      }
    };

    const loadPeople = async () => {
      const saved = await AsyncStorage.getItem("childPeople");

      if (!saved) {
        loadDefaults();
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed.peoples) || parsed.peoples.length === 0) {
        loadDefaults();
        return;
      }

      if (typeof parsed.peoples[0] === "object") {
        setPeoples(parsed.peoples);
        return;
      }

      const converted = parsed.peoples.map((name: string) => ({ name }));
      setPeoples(converted);
    };

    loadPeople();
    loadName();
  }, []);

  // Default fallback list
  function loadDefaults() {
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

  const speakThePhrase = (text: string) => {
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  // 🌈 Apply theme based on sex
  const theme = getChildTheme(sex);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>People</Text>

      <Text style={[styles.subtitle, { color: theme.label }]}>
        Tap a person, {childName}
      </Text>

      <View style={styles.grid}>
        {peoples.map((person, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => speakThePhrase(person.name)}
          >
            {/* IMAGE or FALLBACK ICON */}
            {person.image ? (
              <Image source={{ uri: person.image }} style={styles.cardImage} />
            ) : (
              <View
                style={[
                  styles.fallbackImage,
                  { backgroundColor: theme.tileBg },
                ]}
              >
                <Text style={[styles.fallbackIcon, { color: theme.label }]}>
                  👤
                </Text>
              </View>
            )}

            <Text
              style={[styles.people, { color: theme.label }]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {person.name}
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

// ----------------------------------------
// STYLES
// ----------------------------------------
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
    marginBottom: 30,
  },

  tile: {
    width: "45%",
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
    textAlign: "center",
  },

  backButton: {
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
