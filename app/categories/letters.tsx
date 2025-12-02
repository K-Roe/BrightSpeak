import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ⭐ THEME SUPPORT
import { getChildTheme } from "../theme/childTheme";

export default function Letters() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setSex(profile.sex || "");
      }
    };
    loadData();
  }, []);

  const theme = getChildTheme(sex);

  const speakLetter = (lett: string) => {
    Speech.speak(lett, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const letters = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z"
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg }
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>Letters</Text>

      <Text style={[styles.subtitle, { color: theme.label }]}>
        Tap a letter, {childName}
      </Text>

      <View style={styles.grid}>
        {letters.map((lett) => (
          <TouchableOpacity
            key={lett}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => speakLetter(lett)}
          >
            <Text style={[styles.letter, { color: theme.label }]}>
              {lett}
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
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  letter: {
    fontSize: 40,
    fontWeight: "800",
  },
  backButton: {
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
