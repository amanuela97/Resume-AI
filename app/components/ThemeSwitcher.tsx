import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useEffect } from "react";
import { useAppStore } from "../store";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Get theme from localStorage on initial load
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Remove the old theme class and add the new one
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    // Store theme in localStorage
    localStorage.setItem("theme", newTheme);
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <DarkModeSwitch
          checked={theme === "dark"}
          onChange={toggleTheme}
          size={36}
        />
      </div>
    </>
  );
};

export default ThemeSwitcher;
