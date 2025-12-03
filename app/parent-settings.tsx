import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Input from "../components/input";
import { getChildTheme } from "./theme/childTheme";

// ⭐ NEW ALERT
import ThemedAlert from "../components/ThemedAlert";
import { useThemedAlert } from "./hooks/useThemedAlert";

// icons
const feelingsIcon = "😊";
const foodIcon = "🍔";
const peopleIcon = "👨‍👩‍👧";
const phrasesIcon = "💬";

export default function ParentSettings() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const theme = getChildTheme(sex);

  // ⭐ ALERT HOOK
  const { alertVisible, alertTitle, alertMsg, showAlert, hideAlert } =
    useThemedAlert();

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("childProfile");

      if (saved) {
        const profile = JSON.parse(saved);
        setName(profile.name || "");
        setAge(profile.age || "");
        setSex(profile.sex || "");
        setBirthday(profile.birthday ? new Date(profile.birthday) : null);
      }
    };

    loadData();
  }, []);

  // animate theme changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [sex]);

  const saveProfile = async () => {
    let birthdayDay = null;
    let birthdayMonth = null;
    let birthdayYear = null;

    if (birthday) {
      birthdayDay = birthday.getDate();
      birthdayMonth = birthday.getMonth() + 1; // 0-based → 1-based
      birthdayYear = birthday.getFullYear();
    }

    const profile = {
      name,
      age,
      sex,
      birthday: birthday ? birthday.toISOString() : null,
      birthdayDay,
      birthdayMonth,
      birthdayYear,
    };

    await AsyncStorage.setItem("childProfile", JSON.stringify(profile));

    // ⭐ REPLACE ALERT()
    showAlert("Saved!", "Your child’s profile has been successfully updated.");
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.bg },
        ]}
      >
        {/* THEME BANNER */}
        <View style={[styles.banner, { backgroundColor: theme.tileBg }]}>
          <Text style={[styles.bannerIcon, { color: theme.title }]}>
            {sex === "Boy"
              ? "👦"
              : sex === "Girl"
              ? "👧"
              : "🧒"}
          </Text>

          <Text style={[styles.bannerTitle, { color: theme.title }]}>
            {name ? `${name}'s Profile` : "Your Child’s Profile"}
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View style={[styles.card, { backgroundColor: theme.tileBg }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.label, alignSelf: "center" },
            ]}
          >
            Child Details
          </Text>

          {/* NAME */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.label }]}>Name</Text>
            <Input value={name} onChangeText={setName} placeholder="Child's Name" />
          </View>

          {/* AGE */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.label }]}>Age</Text>
            <Input
              value={age}
              onChangeText={setAge}
              placeholder="Age"
              keyboardType="numeric"
            />
          </View>

{/* BIRTHDAY */}
<View style={styles.fieldContainer}>
  <Text style={[styles.label, { color: theme.label }]}>Birthday</Text>

  <View style={styles.birthdayRow}>
    {/* DAY */}
    <View style={[styles.birthdayPickerWrapper, { borderColor: theme.label }]}>
      <Picker
        selectedValue={birthday ? birthday.getDate() : ""}
        onValueChange={(d) => {
          if (!birthday) {
            setBirthday(new Date(2000, 0, d)); // fallback
            return;
          }
          const newDate = new Date(birthday);
          newDate.setDate(d);
          setBirthday(newDate);
        }}
        style={[styles.picker, { color: theme.label }]}
        dropdownIconColor={theme.title}
      >
        <Picker.Item label="Day" value="" color="#6B7280" />
        {Array.from({ length: 31 }, (_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>
    </View>

    {/* MONTH */}
    <View style={[styles.birthdayPickerWrapper, { borderColor: theme.label }]}>
      <Picker
        selectedValue={birthday ? birthday.getMonth() + 1 : ""}
        onValueChange={(m) => {
          if (!birthday) {
            setBirthday(new Date(2000, m - 1, 1));
            return;
          }
          const newDate = new Date(birthday);
          newDate.setMonth(m - 1);
          setBirthday(newDate);
        }}
        style={[styles.picker, { color: theme.label }]}
        dropdownIconColor={theme.title}
      >
        <Picker.Item label="Month" value="" color="#6B7280" />
        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
          .map((m, i) => (
            <Picker.Item key={i} label={m} value={i + 1} />
          ))}
      </Picker>
    </View>

    {/* YEAR */}
    <View style={[styles.birthdayPickerWrapper, { borderColor: theme.label }]}>
      <Picker
        selectedValue={birthday ? birthday.getFullYear() : ""}
        onValueChange={(y) => {
          if (!birthday) {
            setBirthday(new Date(y, 0, 1));
            return;
          }
          const newDate = new Date(birthday);
          newDate.setFullYear(y);
          setBirthday(newDate);
        }}
        style={[styles.picker, { color: theme.label }]}
        dropdownIconColor={theme.title}
      >
        <Picker.Item label="Year" value="" color="#6B7280" />

        {Array.from({ length: 25 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return <Picker.Item key={year} label={`${year}`} value={year} />;
        })}
      </Picker>
    </View>
  </View>
</View>

          {/* SEX */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.label }]}>Sex</Text>

            <View style={[styles.pickerWrapper, { borderColor: theme.label }]}>
              <Picker
                selectedValue={sex}
                onValueChange={(value) => setSex(value)}
                style={[styles.picker, { color: theme.label }]}
                dropdownIconColor={theme.title}
              >
                <Picker.Item label="Select..." value="" color="#6B7280" />
                <Picker.Item label="Boy" value="Boy" color="#000" />
                <Picker.Item label="Girl" value="Girl" color="#000" />
              </Picker>
            </View>
          </View>

          <Text style={[styles.note, { color: theme.label }]}>
            This helps personalise the app experience.
          </Text>
        </View>

        {/* OPTIONS CARD */}
        <View style={[styles.card, { backgroundColor: theme.tileBg }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.label, alignSelf: "center" },
            ]}
          >
            Manage App Content
          </Text>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.buttonBg }]}
            onPress={() => router.push("/parents/phrases")}
          >
            <Text style={styles.icon}>{phrasesIcon}</Text>
            <Text style={styles.iconButtonText}>Phrases</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.buttonBg }]}
            onPress={() => router.push("/parents/food")}
          >
            <Text style={styles.icon}>{foodIcon}</Text>
            <Text style={styles.iconButtonText}>Food & Drink</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.buttonBg }]}
            onPress={() => router.push("/parents/feelings")}
          >
            <Text style={styles.icon}>{feelingsIcon}</Text>
            <Text style={styles.iconButtonText}>Feelings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.buttonBg }]}
            onPress={() => router.push("/parents/people")}
          >
            <Text style={styles.icon}>{peopleIcon}</Text>
            <Text style={styles.iconButtonText}>People</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FLOATING SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.floatingSave, { backgroundColor: theme.buttonBg }]}
        onPress={saveProfile}
      >
        <Text style={styles.floatingSaveText}>💾 Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.floatingBack, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.floatingSaveText}>🔙 Back</Text>
      </TouchableOpacity>
      

      {/* ⭐ NEW THEMED ALERT */}
      <ThemedAlert
        visible={alertVisible}
        onClose={hideAlert}
        title={alertTitle}
        message={alertMsg}
        sex={sex}
      />
    </Animated.View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120,
    alignItems: "center",
  },

  banner: {
    width: "100%",
    padding: 25,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 25,
    elevation: 3,
  },

  bannerIcon: {
    fontSize: 60,
    marginBottom: 10,
  },

  bannerTitle: {
    fontSize: 28,
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },

  card: {
    width: "100%",
    borderRadius: 20,
    padding: 22,
    marginBottom: 35,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  fieldContainer: {
    width: "100%",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  pickerWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
  },

  picker: {
    height: 55,
  },

  dateBox: {
    width: "100%",
    borderWidth: 1.4,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginTop: 5,
  },

  dateText: {
    fontSize: 16,
  },

  note: {
    fontSize: 14,
    marginTop: 15,
    lineHeight: 20,
  },

  iconButton: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    elevation: 2,
  },

  icon: {
    fontSize: 26,
    marginRight: 10,
  },

  iconButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  floatingSave: {
    position: "absolute",
    bottom: 30,
    right: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 50,
    elevation: 6,
  },

  floatingBack: {
    position: "absolute",
    bottom: 30,
    left: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 50,
    elevation: 6,
  },

  floatingSaveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  birthdayRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},

birthdayPickerWrapper: {
  width: "32%",
  backgroundColor: "#fff",
  borderWidth: 1.4,
  borderRadius: 14,
  overflow: "hidden",
},
});
