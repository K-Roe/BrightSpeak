import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/input";

export default function ParentFeelings() {
  const [feelings, setFeelings] = useState<string[]>([]);
  const [newFeeling, setNewFeeling] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childFeelings");
      if (saved) {
        const childFeelings = JSON.parse(saved);
        setFeelings(childFeelings.feelings || []);
      }
    };
    loadData();
  }, []);

  const speakFeeling = (phrase: string) => {
    Speech.speak(phrase, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const addFeeling = async () => {
    if (!newFeeling.trim()) return;

    // validate one single word
    const word = newFeeling.trim();
    if (word.includes(" ")) {
      alert("Please enter only one word.");
      return;
    }

    const phrase = `I feel ${word}`;
    const updated = [...feelings, phrase];

    setFeelings(updated);
    setNewFeeling("");

    await AsyncStorage.setItem(
      "childFeelings",
      JSON.stringify({ feelings: updated })
    );
  };

  const removeFeeling = async (phraseToDelete: string) => {
    const updated = feelings.filter((f) => f !== phraseToDelete);
    setFeelings(updated);

    await AsyncStorage.setItem(
      "childFeelings",
      JSON.stringify({ feelings: updated })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Feelings</Text>
      <Text style={styles.subtitle}>Create “I feel ...” phrases</Text>

      {/* Input + Add Button */}
      <Input
        placeholder="Enter a feeling (one word)"
        value={newFeeling}
        onChangeText={setNewFeeling}
      />

      <TouchableOpacity style={styles.addButton} onPress={addFeeling}>
        <Text style={styles.addText}>Add Feeling</Text>
      </TouchableOpacity>

      {/* Grid */}
      <View style={styles.grid}>
        {feelings.map((phrase) => (
          <View key={phrase} style={styles.tile}>
            <TouchableOpacity
              style={styles.tilePress}
              activeOpacity={0.8}
              onPress={() => speakFeeling(phrase)}
            >
              <Text style={styles.phrase} numberOfLines={2} adjustsFontSizeToFit>
                {phrase}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFeeling(phrase)}
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
