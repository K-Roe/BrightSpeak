import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ❤️ THEME
import { getChildTheme } from "../theme/childTheme";

// Type for the hybrid card system
type FoodItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Food() {
  const [childName, setChildName] = useState("Child");
  const [themeColor, setThemeColor] = useState("neutral");
  const [foods, setFoods] = useState<FoodItem[]>([]);

  //---------------------------------------------------
  // LOAD CHILD NAME + FOOD ITEMS
  //---------------------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
        setThemeColor(profile.themeColor || "neutral");
      }

      const savedFood = await AsyncStorage.getItem("childFood");

      if (!savedFood) {
        loadDefaults();
        return;
      }

      const data = JSON.parse(savedFood);

      if (!Array.isArray(data.food) || data.food.length === 0) {
        loadDefaults();
        return;
      }

      setFoods(data.food);
    };

    loadAll();
  }, []);

  //--------------------------------
  // Helper: Default fallback list
  //--------------------------------
  function loadDefaults() {
    const defaults = [
      { name: "Water", icon: "cup-water" },
      { name: "Juice", icon: "cup" },
      { name: "Milk", icon: "cow" },
      { name: "Apple", icon: "apple" },
      { name: "Sandwich", icon: "food" },
      { name: "Ice Cream", icon: "ice-cream" },
      { name: "Breakfast", icon: "coffee" },
      { name: "Lunch", icon: "silverware-fork-knife" },
      { name: "Dinner", icon: "food-steak" },
    ];

    setFoods(defaults);
  }

  //---------------------------------------------------
  // SPEAK
  //---------------------------------------------------
  const speakTheFood = (word: string) => {
    Speech.speak(word, {
      rate: 1.0,
      pitch: 1.0,
    });
  };

  //---------------------------------------------------
  // THEME BASED ON SEX
  //---------------------------------------------------
const theme = getChildTheme(themeColor);

  //---------------------------------------------------
  // RENDER
  //---------------------------------------------------
  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* BANNER HEADER */}
      <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
        <Text style={[styles.bannerIcon, { color: theme.title }]}>🍽️</Text>
        <Text style={[styles.bannerTitle, { color: theme.title }]}>
          Food & Drink
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.label }]}>
          Tap a card, {childName}
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {foods.map((item: FoodItem, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.85}
            onPress={() => speakTheFood(item.name)}
          >
            {/* IMAGE FIRST */}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}

            {/* ICON IF NO IMAGE */}
            {!item.image && item.icon && (
              <MaterialCommunityIcons
                name={item.icon}
                size={60}
                color={theme.label}
                style={{ marginBottom: 10 }}
              />
            )}

            {/* FALLBACK ICON */}
            {!item.image && !item.icon && (
              <View
                style={[
                  styles.fallbackIcon,
                  { backgroundColor: theme.tileBg },
                ]}
              >
                <MaterialCommunityIcons
                  name="food"
                  size={50}
                  color={theme.label}
                />
              </View>
            )}

            <Text style={[styles.foodName, { color: theme.label }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.replace("/child-categories")}
      >
        <Text style={styles.backText}>🡰 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

//---------------------------------------------------
// STYLES
//---------------------------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
    minHeight: "100%",
  },

  // Banner
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

  // Grid
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tile: {
    width: "48%",
    borderRadius: 20,
    marginBottom: 20,
    padding: 14,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "90%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 10,
  },

  fallbackIcon: {
    width: 90,
    height: 90,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  foodName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 25,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
