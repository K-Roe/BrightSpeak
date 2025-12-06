import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import the theme helper
import { getChildTheme } from "../theme/childTheme";

const categories = [
  {
    id: "food",
    label: "Guess The Letter",
    image: require("../../assets/images/alphabet.png"),
    route: "/games/guessTheLetters",
  },
    {
    id: "numbers",
    label: "Guess The Number",
    image: require("../../assets/images/numbers.png"),
    route: "/games/guessTheNumbers",
  },
    {
    id: "people",
    label: "People",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3048/3048127.png" },
    route: "/games/guessThePerson",
  },
  {
    id: "play",
    label: "Ten in the bed",
    image: require("../../assets/images/teninbed.png"),
    route: "/games/ten-bed",
  },
];

export default function MiniGames() {
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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>
        Hello, {childName}!
      </Text>
      <Text style={[styles.title, { color: theme.title }]}>Choose One</Text>

      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
            onPress={() => {
              if (cat.route) {
                router.push(cat.route);
              }
            }}
          >
            <Image source={cat.image} style={styles.icon} />
            <Text style={[styles.label, { color: theme.label }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  tile: {
    width: "40%",
    height: 140,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    elevation: 3,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
