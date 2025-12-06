export const themes = {
  blue: {
    bg: "#E6F0FF",
    title: "#1E3A8A",
    tileBg: "#DBEAFE",
    label: "#1E3A8A",
    buttonBg: "#3B82F6",
  },

  pink: {
    bg: "#FFE6F2",
    title: "#9D174D",
    tileBg: "#FCE7F3",
    label: "#9D174D",
    buttonBg: "#EC4899",
  },

  green: {
    bg: "#E8F5E9",
    title: "#1B5E20",
    tileBg: "#C8E6C9",
    label: "#1B5E20",
    buttonBg: "#4CAF50",
  },

  purple: {
    bg: "#F3E8FF",
    title: "#6A1B9A",
    tileBg: "#E9D5FF",
    label: "#6A1B9A",
    buttonBg: "#A855F7",
  },

  yellow: {
    bg: "#FFFDE7",
    title: "#A16207",
    tileBg: "#FFF9C4",
    label: "#A16207",
    buttonBg: "#EAB308",
  },

  neutral: {
    bg: "#F5F5F5",
    title: "#1F2937",
    tileBg: "#FFFFFF",
    label: "#1F2937",
    buttonBg: "#4F46E5",
  },
};

// ⭐ THEME SELECTOR
export function getChildTheme(themeColor: string | undefined) {
  if (!themeColor) return themes.neutral;

  const chosen = themes[themeColor as keyof typeof themes];

  return chosen ?? themes.neutral;
}