import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/input";

export default function ParentPeople() {
  const [peoples, setPeoples] = useState<string[]>([]);
  const [newPeople, setNewPeople] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childPeople");
      if (saved) {
        const childpeoples = JSON.parse(saved);
        setPeoples(childpeoples.peoples || []);
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

  const addPeople = async () => {
    if (!newPeople.trim()) return;

    const updated = [...peoples, newPeople.trim()];
    setPeoples(updated);
    setNewPeople("");

    await AsyncStorage.setItem("childPeople", JSON.stringify({ peoples: updated }));
  };

  const removePeople = async (phraseToDelete: string) => {
    const updated = peoples.filter((p) => p !== phraseToDelete);
    setPeoples(updated);

    await AsyncStorage.setItem("childPeople", JSON.stringify({ peoples: updated }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage People</Text>
      <Text style={styles.subtitle}>Tap a People to hear it aloud</Text>

      {/* --- Input + Add Button AT THE TOP --- */}
      <Input
        placeholder="Add a new person"
        value={newPeople}
        onChangeText={setNewPeople}
      />

      <TouchableOpacity style={styles.addButton} onPress={addPeople}>
        <Text style={styles.addText}>Add Phrase</Text>
      </TouchableOpacity>

      {/* --- Grid of phrases --- */}
      <View style={styles.grid}>
        {peoples.map((people) => (
          <View key={people} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakThePhrase(people)}
            >
              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {people}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removePeople(people)}
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
