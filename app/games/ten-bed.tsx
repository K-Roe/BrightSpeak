import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ALL_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

// Different colours per number
const NUMBER_COLORS: Record<number, string> = {
  1: "#EF4444",
  2: "#F59E0B",
  3: "#10B981",
  4: "#3B82F6",
  5: "#8B5CF6",
  6: "#EC4899",
  7: "#22C55E",
  8: "#0EA5E9",
  9: "#F97316",
  10: "#EAB308",
};

type DraggableNumberProps = {
  num: number;
  onDropInBed: (num: number) => void;
};

function DraggableNumber({ num, onDropInBed }: DraggableNumberProps) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gesture) => {
        pan.flattenOffset();

        // Simple bed hit area
        if (gesture.moveY < 260) {
          onDropInBed(num);
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.draggableWrapper, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <Text
        style={[
          styles.numberText,
          { color: NUMBER_COLORS[num] || "#4F46E5" },
        ]}
      >
        {num}
      </Text>
    </Animated.View>
  );
}

export default function TenInTheBed() {
  const [childName, setChildName] = useState("Child");
  const [numbersInBed, setNumbersInBed] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadName = async () => {
      const saved = await AsyncStorage.getItem("childProfile");
      if (saved) {
        const profile = JSON.parse(saved);
        setChildName(profile.name);
      }
    };

    loadName();
    playMusic();

    // 🔥 Clean up audio when leaving screen
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };

  }, []);

  async function playMusic() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/audio/driftaway.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
      }
    );

    // 🔊 Lower volume so Speech is heard clearly (20% volume)
    await sound.setVolumeAsync(0.2);

    setSound(sound);
  }

  const handleDropInBed = (num: number) => {
    setNumbersInBed((prev) => {
      if (prev.includes(num)) return prev;

      const updated = [...prev, num].sort((a, b) => a - b);

      Speech.speak(`Number ${num} in the bed`, {
        rate: 1.0,
        pitch: 1.0,
      });

      if (updated.length === ALL_NUMBERS.length) {
        setCompleted(true);
        Speech.speak("All ten in the bed!", {
          rate: 1.0,
          pitch: 1.0,
        });
      }

      return updated;
    });
  };

  const resetGame = () => {
    setNumbersInBed([]);
    setCompleted(false);
  };

  const remainingNumbers = ALL_NUMBERS.filter((n) => !numbersInBed.includes(n));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ten in the Bed</Text>
      <Text style={styles.subtitle}>
        Drag the numbers into the bed, {childName}.
      </Text>

      {/* Bed Area */}
      <View style={styles.bedArea}>
        <Image
          source={require("../../assets/images/teninbed.png")}
          style={styles.bedImage}
        />
        <Text style={styles.bedTitle}>The Bed</Text>
        <View style={styles.bedNumbersRow}>
          {numbersInBed.map((num) => (
            <View key={num} style={styles.bedNumberSlot}>
              <Text
                style={[
                  styles.bedNumberText,
                  { color: NUMBER_COLORS[num] || "#4F46E5" },
                ]}
              >
                {num}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Numbers to drag */}
      <Text style={styles.instructions}>Drag a number up into the bed</Text>
      <View style={styles.dragGrid}>
        {remainingNumbers.map((num) => (
          <DraggableNumber key={num} num={num} onDropInBed={handleDropInBed} />
        ))}
      </View>

      {completed && (
        <View style={styles.completeBox}>
          <Text style={styles.completeText}>All 10 in the bed! 🎉</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
          router.push("/child-categories");
        }}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#4F46E5",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  bedArea: {
    width: "90%",
    backgroundColor: "#BFDBFE",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#60A5FA",
  },
  bedImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
  bedTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1D4ED8",
    marginBottom: 8,
  },
  bedNumbersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bedNumberSlot: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    paddingHorizontal: 6,
  },
  bedNumberText: {
    fontSize: 22,
    fontWeight: "900",
  },

  instructions: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 10,
  },

  dragGrid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  draggableWrapper: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  numberText: {
    fontSize: 40,
    fontWeight: "900",
  },

  completeBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#BBF7D0",
    borderRadius: 16,
    alignItems: "center",
  },
  completeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  resetText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
