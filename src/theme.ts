import { MD3LightTheme as DefaultTheme } from "react-native-paper"

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7C3AED",
    secondary: "#9333EA",
    tertiary: "#A855F7",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    error: "#DC2626",
    success: "#10B981",
    warning: "#F59E0B",
    text: "#1F2937",
    onSurface: "#374151",
    disabled: "#9CA3AF",
    placeholder: "#6B7280",
    backdrop: "rgba(0, 0, 0, 0.5)",
    notification: "#EF4444",
  },
  roundness: 12,
}
