import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/input";

export default function ParentPhrases() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childPhrases");
      if (saved) {
        const childPhrases = JSON.parse(saved);
        setPhrases(childPhrases.phrases || []);
      }
    };
    loadData();
  }, []);

  const speakThePhrase = (word: string) => {
    Speech.speak(word.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const addPhrase = async () => {
    if (!newPhrase.trim()) return;

    const updated = [...phrases, newPhrase.trim()];
    setPhrases(updated);
    setNewPhrase("");

    await AsyncStorage.setItem("childPhrases", JSON.stringify({ phrases: updated }));
  };

  const removePhrase = async (phraseToDelete: string) => {
    const updated = phrases.filter((p) => p !== phraseToDelete);
    setPhrases(updated);

    await AsyncStorage.setItem("childPhrases", JSON.stringify({ phrases: updated }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Phrases</Text>
      <Text style={styles.subtitle}>Tap a phrase to hear it aloud</Text>

      {/* --- Input + Add Button AT THE TOP --- */}
      <Input
        placeholder="Add a new phrase"
        value={newPhrase}
        onChangeText={setNewPhrase}
      />

      <TouchableOpacity style={styles.addButton} onPress={addPhrase}>
        <Text style={styles.addText}>Add Phrase</Text>
      </TouchableOpacity>

      {/* --- Grid of phrases --- */}
      <View style={styles.grid}>
        {phrases.map((phrase) => (
          <View key={phrase} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakThePhrase(phrase)}
            >
              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {phrase}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removePhrase(phrase)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("../parent-settings")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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

  /* INPUT + ADD BUTTON */
  addButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  addText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* GRID */
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
    elevation: 3,
    padding: 10,
    alignItems: "center",
  },
  tilePress: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  phrase: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* BACK BUTTON */
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
