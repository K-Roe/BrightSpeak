import { useState } from "react";

export function useThemedAlert() {
  const [alertVisible, setVisible] = useState(false);
  const [alertTitle, setTitle] = useState("");
  const [alertMsg, setMsg] = useState("");

  const showAlert = (title: string, message: string) => {
    setTitle(title);
    setMsg(message);
    setVisible(true);
  };

  const hideAlert = () => setVisible(false);

  return {
    alertVisible,
    alertTitle,
    alertMsg,
    showAlert,
    hideAlert,
  };
}
