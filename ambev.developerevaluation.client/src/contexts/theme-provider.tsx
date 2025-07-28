import { APP_THEME } from "~/constants/consts";
import { hexColors, type IHexColors } from "~/wwwroot/styles/theme";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const Theme = {
  Light: "light",
  Dark: "dark",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const ThemeContext = createContext<{
  theme: Theme;
  hexColors: IHexColors;
  isDark: boolean;
  toggleTheme: (theme?: Theme) => void;
}>({
  hexColors: hexColors["dark"]!,
  isDark: true,
  theme: Theme.Dark,
  toggleTheme: (_?: Theme) => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeColor, setTheme] = useState<Theme>(Theme.Dark);

  useEffect(() => {
    const stored = localStorage.getItem(APP_THEME);
    if (stored === Theme.Light || stored === Theme.Dark) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark");
  }, [themeColor]);

  const _hexColors = hexColors[themeColor]!;
  const isDark = themeColor === Theme.Dark;

  const toggleTheme = (value?: Theme) => {
    const next =
      value ?? (themeColor === Theme.Dark ? Theme.Light : Theme.Dark);
    localStorage.setItem(APP_THEME, next);
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme: themeColor,
        hexColors: _hexColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
