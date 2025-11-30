import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function People() {
  const [childName, setChildName] = useState("Child");
  const [peoples, setPeoples] = useState<string[]>([]);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };
     const loadPeople = async () => {
      const savedPeoples = await AsyncStorage.getItem("childPeople");
      if (savedPeoples) {
        const childPeoples = JSON.parse(savedPeoples);
        setPeoples(childPeoples.peoples || []);
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
            ];

            setPeoples(phrasesDefault);
      }
    };
    loadPeople();
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
      <Text style={styles.title}>People</Text>
      <Text style={styles.subtitle}>Tap a person, {childName}</Text>

      <View style={styles.grid}>
        {peoples.map((people) => (
          <TouchableOpacity
            key={people}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
              speakThePhrase(people);
            }}
          >
            <Text style={styles.people} numberOfLines={2} adjustsFontSizeToFit>
              {people}
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
    marginBottom: 30,   // extra space for easier back button access
  },

  tile: {
    width: "45%",        // slightly smaller tiles
    height: 100,         // was 120
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    elevation: 3,
  },

  people: {
    fontSize: 22,        // was 28
    fontWeight: "800",
    color: "#4F46E5",
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
