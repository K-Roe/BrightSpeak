import AsyncStorage from "@react-native-async-storage/async-storage";
import { Label } from "@react-navigation/elements";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../components/input";

export default function ParentSettings() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childProfile");

      if (saved) {
        const profile = JSON.parse(saved);
        setName(profile.name || "");
        setAge(profile.age || "");
        setSex(profile.sex || "");
      }
    };

    loadData();
  }, []);

  const saveProfile = async () => {
    const profile = { name, age, sex };
    await AsyncStorage.setItem("childProfile", JSON.stringify(profile));

    alert("Profile saved!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parent Settings</Text>

      {/* Profile card */}
      <View style={styles.card}>
        <Label style={styles.label}>Child Name</Label>
        <Input placeholder="Child's Name" value={name} onChangeText={setName} />

        <Label style={styles.label}>Child Age</Label>
        <Input placeholder="Age" value={age} onChangeText={setAge} />

        <Label style={styles.label}>Child Sex</Label>
        <Input placeholder="Sex (Boy/Girl/Other)" value={sex} onChangeText={setSex} />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          This information will help personalise your child's experience.
        </Text>
      </View>

      {/* Phrases card */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/parents/phrases")}
        >
          <Text style={styles.buttonText}>Phrases</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/parents/food")}
        >
          <Text style={styles.buttonText}>Food and Drink</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/parents/feelings")}
        >
          <Text style={styles.buttonText}>Feelings</Text>
        </TouchableOpacity>

          <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/parents/people")}
        >
          <Text style={styles.buttonText}>People</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 30, // spacing between cards
  },
  button: {
    backgroundColor: "#4F46E5",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  label: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
});
