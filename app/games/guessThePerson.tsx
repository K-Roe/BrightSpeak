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
};

export default function People() {
  const [childName, setChildName] = useState("Child");
  const [themeColor, setThemeColor] = useState("neutral");
  const [peoples, setPeoples] = useState<PeopleCard[]>([]);
  const [questionPerson, setQuestionPerson] = useState<PeopleCard | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name || "Child");
        setThemeColor(profile.themeColor || "neutral");
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

    loadProfile();
    loadPeople();
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

  // Speak using TTS
  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const theme = getChildTheme(themeColor);

  // ⭐ UPDATED nextQuestion WITH "yourself" LOGIC
  const nextQuestion = (answer?: PeopleCard) => {
    if (answer && questionPerson) {
      if (answer.name === questionPerson.name) {
        speak(`Well done! You found ${answer.name}, ${childName}!`);
      } else {
        speak(
          `Oops! That was ${answer.name}. Try again. Can you find ${questionPerson.name}?`
        );
        return;
      }
    }

    const random = peoples[Math.floor(Math.random() * peoples.length)];
    setQuestionPerson(random);

    // ⭐ If the person is the child, special message
    if (random.name.toLowerCase() === childName.toLowerCase()) {
      speak(`Can you find yourself, ${childName}?`);
    } else {
      speak(`Can you find ${random.name}, ${childName}?`);
    }
  };

  useEffect(() => {
    if (peoples.length > 0) nextQuestion();
  }, [peoples]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* ⭐ QUESTION CARD */}
      {questionPerson && (
        <View style={[styles.questionCard, { backgroundColor: theme.tileBg }]}>
          <Text style={[styles.questionIcon, { color: theme.title }]}>👤</Text>

          <Text style={[styles.questionName, { color: theme.title }]}>
            {questionPerson.name}
          </Text>

          <Text style={[styles.questionSubtitle, { color: theme.label }]}>
            {questionPerson.name.toLowerCase() === childName.toLowerCase()
              ? `Can you find yourself, ${childName}?`
              : "Can you find them?"}
          </Text>
        </View>
      )}

      {/* ⭐ PEOPLE GRID */}
      <View style={styles.grid}>
        {peoples.map((person, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.85}
            onPress={() => nextQuestion(person)}
          >
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
              style={[styles.peopleText, { color: theme.label }]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⭐ BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/categories/miniGames")}
      >
        <Text style={styles.backText}>🡰 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------------------------------------
// STYLES
// ---------------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
    minHeight: "100%",
  },

  // ⭐ QUESTION BANNER
  questionCard: {
    width: "90%",
    paddingVertical: 25,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 25,
    elevation: 3,
  },
  questionIcon: {
    fontSize: 70,
    marginBottom: 10,
  },
  questionName: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  questionSubtitle: {
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

  peopleText: {
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
