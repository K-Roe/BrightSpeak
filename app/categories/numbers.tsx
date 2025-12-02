import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ⭐ THEME SUPPORT
import { getChildTheme } from "../theme/childTheme";

export default function Numbers() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setSex(profile.sex || "");
      }
    };
    loadName();
  }, []);

  const theme = getChildTheme(sex);

  const speakNumber = (num: number) => {
    Speech.speak(num.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>
        Numbers
      </Text>

      <Text style={[styles.subtitle, { color: theme.label }]}>
        Tap a number, {childName}
      </Text>

      <View style={styles.grid}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => speakNumber(num)}
          >
            <Text style={[styles.number, { color: theme.label }]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
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
    borderRadius: 18,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  number: {
    fontSize: 32,
    fontWeight: "800",
  },
  backButton: {
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
