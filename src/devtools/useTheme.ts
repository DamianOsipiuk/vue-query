import { inject } from "vue";

const theme = {
  background: "#0b1521",
  backgroundAlt: "#132337",
  foreground: "white",
  gray: "#3f4e60",
  grayAlt: "#222e3e",
  inputBackgroundColor: "#fff",
  inputTextColor: "#000",
  success: "#00ab52",
  danger: "#ff0085",
  active: "#006bff",
  warning: "#ffb200",
};

export type Theme = typeof theme;

export const VUE_QUERY_DEVTOOLS_THEME = "VUE_QUERY_DEVTOOLS_THEME";

export function useTheme(): Theme {
  return inject<Theme>(VUE_QUERY_DEVTOOLS_THEME, theme);
}
