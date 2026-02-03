import { useEffect, useState } from "react";

const getCssVariable = (variable: string) => {
  if (typeof window === "undefined") return "";
  // Trim spaces and semicolon if present (though getPropertyValue usually handles this)
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

export const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: "#cd3a38", // Fallback
    secondary: "#295e7e",
    contrast: "#272727",
    background: "#fff",
    mutedPrimary: "#E9AAA9",
    mutedSecondary: "#BABDC4",
    backgroundPrimary: "#faebea",
    success: "#2ef231",
    error: "#fb2c36",
  });

  useEffect(() => {
    const primary = getCssVariable("--color-primary");
    const secondary = getCssVariable("--color-secondary");
    const contrast = getCssVariable("--color-contrast");
    const background = getCssVariable("--color-background");
    const mutedPrimary = getCssVariable("--color-muted-primary");
    const mutedSecondary = getCssVariable("--color-muted-secondary");
    const backgroundPrimary = getCssVariable("--color-background-primary");
    const success = getCssVariable("--color-success");
    const error = getCssVariable("--color-error");

    // Only update if we actually found variables (meaning CSS loaded)
    if (primary) {
      setColors({
        primary: primary || "#cd3a38",
        secondary: secondary || "#295e7e",
        contrast: contrast || "#272727",
        background: background || "#fff",
        mutedPrimary: mutedPrimary || "#E9AAA9",
        mutedSecondary: mutedSecondary || "#BABDC4",
        backgroundPrimary: backgroundPrimary || "#faebea",
        success: success || "#2ef231",
        error: error || "#fb2c36",
      });
    }
  }, []);

  return colors;
};
