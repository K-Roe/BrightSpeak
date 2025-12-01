import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (data: { image?: string; icon?: string }) => void;
};

const ICONS = [
  "food-apple",
  "food-croissant",
  "food-drumstick",
  "food-fork-drink",
  "food-turkey",
  "cookie",
  "cupcake",
  "bottle-soda",
  "coffee",
  "fruit-watermelon",
  "noodles",
  "hamburger",
  "pizza",
];

export default function FoodImagePicker({ visible, onClose, onSelect }: Props) {

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Copy to app storage
      const filename = uri.split("/").pop();
      const newPath = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: uri, to: newPath });

      onSelect({ image: newPath });
      onClose();
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop();
      const newPath = FileSystem.documentDirectory + filename;

      await FileSystem.copyAsync({ from: uri, to: newPath });

      onSelect({ image: newPath });
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Choose an Image</Text>

          <TouchableOpacity style={styles.option} onPress={takePhoto}>
            <Text style={styles.optionText}>📸 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={pickImage}>
            <Text style={styles.optionText}>🖼️ Pick from Gallery</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Or pick an icon:</Text>

          <ScrollView contentContainerStyle={styles.iconGrid}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={styles.iconTile}
                onPress={() => {
                  onSelect({ icon });
                  onClose();
                }}
              >
                <MaterialCommunityIcons name={icon} size={40} color="#4F46E5" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 15,
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 5,
  },
  option: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  optionText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconTile: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#EF4444",
  },
});
