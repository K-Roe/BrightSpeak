import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Numbers() {
  const [childName, setChildName] = useState("Child");

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };
    loadName();
  }, []);

    const speakNumber = (num: number) => {
    // Say the number as a word or just the digit
    Speech.speak(num.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Numbers</Text>
      <Text style={styles.subtitle}>Tap a number, {childName}</Text>

      <View style={styles.grid}>
        {numbers.map(num => (
          <TouchableOpacity
            key={num}
            style={styles.tile}
            activeOpacity={0.8}
            onPress={() => {
                speakNumber(num);
            }}
          >
            <Text style={styles.number}>{num}</Text>
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
    width: "28%",      
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  number: {
    fontSize: 32,      
    fontWeight: "800",
    color: "#4F46E5",
  },
  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
