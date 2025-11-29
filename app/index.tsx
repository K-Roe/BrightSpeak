import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

    const handleParentAccess = async () => {
    const pin = await AsyncStorage.getItem("parentPin");

    if (!pin) {
      // No PIN set yet – first time setup
      router.push("/pin-setup");
    } else {
      // PIN exists – ask them to enter
      router.push("/pin-login");
    }
  };

  return (
    <View style={styles.container}>

      {/* LONG PRESS FOR PARENT SETTINGS */}
      <TouchableOpacity onLongPress={handleParentAccess}>
        <Text style={styles.hiddenParent}></Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity onLongPress={handleParentAccess}>
          <Text style={styles.appName}>BrightSpeak</Text>
        </TouchableOpacity>

        <Text style={styles.tagline}>Helping every voice shine</Text>
      </View>

      <Image
        source={{
          uri: "https://reactnative.dev/docs/assets/p_cat2.png",
        }}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push("/child-categories")}
      >
        <Text style={styles.mainButtonText}>Start Talking</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Invisible long-press zone
  hiddenParent: {
    height: 1,
    width: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#4F46E5",
    textAlign: "center",
    textShadowColor: "rgba(79,70,229,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 16,
    color: "#6D6D9D",
    marginTop: 8,
  },

  image: {
    width: 190,
    height: 190,
    marginBottom: 50,
  },

  mainButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 10,
    elevation: 3,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
