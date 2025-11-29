import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../components/input";

export default function PinLogin() {
  const [pin, setPin] = useState("");

  const checkPin = async () => {
    const savedPin = await AsyncStorage.getItem("parentPin");

    if (!savedPin) {
      alert("No PIN set yet. You need to create one first.");
      router.push("/pin-setup");
      return;
    }

    if (pin === savedPin) {
      setPin("");
      router.push("/parent-settings");
    } else {
      alert("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Access</Text>
      <Text style={styles.subtitle}>Enter your PIN</Text>

      <Input
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={checkPin}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25,
    color: "#6B7280",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
