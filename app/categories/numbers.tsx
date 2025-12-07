import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ⭐ THEME SUPPORT
import { getChildTheme } from "../theme/childTheme";

export default function Numbers() {
  const [childName, setChildName] = useState("Child");
  const [themeColor, setThemeColor] = useState("neutral");

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setThemeColor(profile.themeColor || "neutral");
      }
    };
    loadName();
  }, []);

const theme = getChildTheme(themeColor);

  const speakNumber = (num: number) => {
    Speech.speak(num.toString(), {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>🔢</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Numbers
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a number, {childName}
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.9}
            onPress={() => speakNumber(num)}
          >
            <Text style={[styles.number, { color: theme.label }]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.replace("/child-categories")}
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
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  number: {
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
