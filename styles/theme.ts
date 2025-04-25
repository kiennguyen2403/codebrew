import { createTheme } from "@mantine/core";
import { DefaultTheme } from "styled-components";

// Mantine theme
export const mantineTheme = createTheme({
  primaryColor: "primary",
  colors: {
    primary: [
      "#E8F2E8", // 0 - Lightest
      "#D1E5D2", // 1
      "#BAD8BB", // 2
      "#A3CBA4", // 3
      "#8CBE8D", // 4
      "#4B7A4E", // 5 - Primary color from styled theme
      "#3E6340", // 6
      "#314C32", // 7
      "#243624", // 8
      "#171F17", // 9 - Darkest
    ],
    secondary: [
      "#FAFAF0", // 0
      "#F5F6E6", // 1
      "#F0F1DC", // 2
      "#EBECD2", // 3
      "#E6E7C8", // 4
      "#E5E6BE", // 5 - Secondary color from styled theme
      "#B8B998", // 6
      "#8A8B72", // 7
      "#5D5E4C", // 8
      "#2F2F26", // 9
    ],
    bg: [
      "#FFFADD", // 0 - Lightest
      "#F2F2E6", // 1
      "#E6E6D4", // 2
      "#D9D9C2", // 3
      "#CCCCB0", // 4
      "#B3B39C", // 5
      "#999988", // 6
      "#808074", // 7
      "#666660", // 8
      "#4D4D4C", // 9 - Darkest
    ],
  },
  fontFamily: "PixeloidSans, sans-serif",
  headings: {
    fontFamily: "PixeloidSans, sans-serif",
  },
  defaultRadius: "none",
});

// Styled Components theme
export const styledTheme: DefaultTheme = {
  colors: {
    primary: "#4B7A4E",
    secondary: "#E5E6BE",
    background: "#FFFADD",
    text: "#212529",
    success: "#40C057",
    error: "#FA5252",
    warning: "#FD7E14",
  },
  fonts: {
    body: "PixeloidSans",
    mono: "PixeloidSans",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  breakpoints: {
    xs: "320px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  },
};
