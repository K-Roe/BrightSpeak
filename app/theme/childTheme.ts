
export const boyTheme = {
  bg: "#E6F0FF",
  title: "#1E3A8A",
  tileBg: "#DBEAFE",
  label: "#1E3A8A",
  buttonBg: "#3B82F6",
};

export const girlTheme = {
  bg: "#FFE6F2",
  title: "#9D174D",
  tileBg: "#FCE7F3",
  label: "#9D174D",
  buttonBg: "#EC4899",
};

export const neutralTheme = {
  bg: "#F5F5F5",
  title: "#1F2937",
  tileBg: "#ffffff",
  label: "#1F2937",
  buttonBg: "#4F46E5",
};

// choose theme helper
export function getChildTheme(sex: string | undefined) {
  if (sex === "Boy") return boyTheme;
  if (sex === "Girl") return girlTheme;
  return neutralTheme;
}
