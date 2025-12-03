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
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* ⭐ BANNER HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>👨‍👩‍👧</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          People
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a person, {childName}
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {peoples.map((person, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.85}
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
    minHeight: "100%", // ⭐ ensures background fills screen
  },

  // 🌟 BANNER HEADER
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

  // GRID
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
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
    borderRadius: 14,
    resizeMode: "cover",
    marginBottom: 10,
  },

  fallbackImage: {
    width: "100%",
    height: 100,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  fallbackIcon: {
    fontSize: 42,
  },

  people: {
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
    fontWeight: "700",
  },
});
