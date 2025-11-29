import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Feelings() {
  const [childName, setChildName] = useState("Child");
  const [feelings, setFeelings] = useState<string[]>([]);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };
      const loadFeelings = async () => {
      const saved = await AsyncStorage.getItem("childFeelings");
      if (saved) {
        const childFeelings = JSON.parse(saved);
        setFeelings(childFeelings.feelings || []);
      } else {
          const defaultFeelings = [
            "I Feel Sad",
            "I Feel Happy",
            "I Feel Angry",
            "I Feel Scared",
            "I Feel Tired",
            "I Feel Sick",
            "I Feel Excited",
            "I Feel Hungry",
            "I Feel Thirsty",
            "I Feel Lonely",
            "I Feel Brave",
            "I Feel Silly",
          ];
          setFeelings(defaultFeelings);
      }
    };
    loadFeelings();
    loadName();
  }, []);

  const speakTheFeeling = (word: string) => {
    Speech.speak(word.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feelings</Text>
      <Text style={styles.subtitle}>Tap a feeling, {childName}</Text>

      <View style={styles.grid}>
        {feelings.map((feel) => (
          <TouchableOpacity
            key={feel}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
              speakTheFeeling(feel);
            }}
          >
            <Text style={styles.feel} numberOfLines={2} adjustsFontSizeToFit>
              {feel}
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
  feel: {
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
