import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ❤️ THEME
import { getChildTheme } from "../theme/childTheme";

// Type for the new hybrid card system
type FoodItem = {
  name: string;
  image?: string;
  icon?: string;
};

export default function Food() {
  const [childName, setChildName] = useState("Child");
  const [sex, setSex] = useState("");
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
        setSex(profile.sex || "");
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
  const theme = getChildTheme(sex);

  //---------------------------------------------------
  // RENDER
  //---------------------------------------------------
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.title }]}>
        Food & Drink
      </Text>

      <Text style={[styles.subtitle, { color: theme.label }]}>
        Tap a card, {childName}
      </Text>

      <View style={styles.grid}>
        {foods.map((item: FoodItem, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tile, { backgroundColor: theme.tileBg }]}
            activeOpacity={0.8}
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

            {/* FALLBACK BOX */}
            {!item.image && !item.icon && (
              <View style={[styles.fallbackIcon, { backgroundColor: theme.tileBg }]}>
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

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

//---------------------------------------------------
// STYLES
//---------------------------------------------------
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
    width: "48%",
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "90%",
    height: 90,
    resizeMode: "contain",
    borderRadius: 10,
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
    marginTop: 20,
    marginBottom: 20,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
