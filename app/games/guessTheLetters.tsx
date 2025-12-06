import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ⭐ THEME SUPPORT
import { getChildTheme } from "../theme/childTheme";

export default function Letters() {
  const [childName, setChildName] = useState("Child");
  const [themeColor, setThemeColor] = useState("neutral");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setThemeColor(profile.themeColor || "neutral");
      }
    };

   
    nextQuestion();
    loadData();
  }, []);
  
 const nextQuestion = (answer: string | null = null) => {

      if(answer) {
        if(answer === question) {
          speakLetter(`Well done! You guessed the letter ${answer} correctly!`);
        } else {
          speakLetter(`Oops! The correct letter was ${question}. Let's try again!`);
          return;
        }
      }
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const randomLetter =
        letters[Math.floor(Math.random() * letters.length)];
      setQuestion(randomLetter);
    speakLetter(`Can you guess the letter ${randomLetter}`);
    }

  const theme = getChildTheme(themeColor);

  const speakLetter = (lett: string) => {
    Speech.speak(lett, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg } // ⭐ FIXED: ensures theme color applies
      ]}
    >
      {/* HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>🔤</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>Guess The Letter</Text>

        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a letter to answer, {childName}
        </Text>
      </View>

      {/* Question */}
       <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>{question}</Text>

        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a letter to answer, {childName}
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {letters.map((lett) => (
          <TouchableOpacity
            key={lett}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.9}
            onPress={() => nextQuestion(lett)}
          >
            <Text style={[styles.letter, { color: theme.label }]}>{lett}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/categories/miniGames")}
      >
        <Text style={styles.backText}>Back</Text>
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

  /* HEADER */
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

  /* GRID */
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  tile: {
    width: "28%",
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  letter: {
    fontSize: 42,
    fontWeight: "900",
  },

  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 25,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
