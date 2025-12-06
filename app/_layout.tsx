import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Hide Android navigation bar
    NavigationBar.setVisibilityAsync("hidden");

    // Immersive sticky mode (best fullscreen experience)
    NavigationBar.setBehaviorAsync("overlay-swipe");

  }, []);

  return (
    <>
      {/* Make status bar hidden */}
      <StatusBar style="light" hidden />

      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
