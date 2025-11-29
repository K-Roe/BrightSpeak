import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function People() {
  const [childName, setChildName] = useState("Child");
  const [phrases, setPhrases] = useState<string[]>([]);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };
     const loadPhrases = async () => {
      const savedPhrases = await AsyncStorage.getItem("childPhrases");
      if (savedPhrases) {
        const childPhrases = JSON.parse(savedPhrases);
        setPhrases(childPhrases.phrases || []);
      } else {
          const phrasesDefault = [
              "Mummy",
              "Daddy",
              "Brother",
              "Sister",
              "Nanna",
              "Granddad",
              "Friend",
              "Teacher",
              "Good Morning",
              "Good Night",
              "Please",
              "Thank You",
              "Help",
              "Sorry",
              "I Love You",
              "Kiss",
              "Hug",
              "Play",
              "I'm Hungry",
              "I'm Thirsty",
              "Toilet",
            ];

            setPhrases(phrasesDefault);
      }
    };
    loadPhrases();
    loadName();
  }, []);

  const speakThePhrase = (word: string) => {
    Speech.speak(word.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Phrases</Text>
      <Text style={styles.subtitle}>Tap a phrase, {childName}</Text>

      <View style={styles.grid}>
        {phrases.map((phrase) => (
          <TouchableOpacity
            key={phrase}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
              speakThePhrase(phrase);
            }}
          >
            <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
              {phrase}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/child-categories")}>
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
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 3,
  },
  phrase: {
    fontSize: 28,
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
