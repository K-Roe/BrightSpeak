import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Parent Settings</Text>

      <View style={styles.card}>
        <Input
          placeholder="Child's Name"
          value={name}
          onChangeText={setName}
        />

        <Input
          placeholder="Age"
          value={age}
          onChangeText={setAge}
        />

        <Input
          placeholder="Sex (Boy/Girl/Other)"
          value={sex}
          onChangeText={setSex}
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        This information will help personalise your child's experience.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: 60,
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
});
