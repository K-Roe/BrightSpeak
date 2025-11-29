import { StyleSheet, TextInput, TextInputProps } from "react-native";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
};

export default function Input({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
}: InputProps) {
  return (
    <TextInput
      placeholder={placeholder || "Type here"}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: "80%",
    color: "#070d17",
  },
});

/**
 * Usage:
 * <Input
 *    placeholder="Email"
 *    value={email}
 *    onChangeText={setEmail}
 * />
 */
