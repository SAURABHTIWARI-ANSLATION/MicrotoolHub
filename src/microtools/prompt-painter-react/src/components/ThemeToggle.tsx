import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    // Always default to dark mode unless explicitly set to light
    const initialDark = savedTheme !== "light";
    
    setIsDark(initialDark);
    
    // Apply theme immediately
    if (initialDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    
    // Add smooth transition class after initial load
    setTimeout(() => {
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-4 rounded-2xl glass-panel hover:scale-105 smooth-transition shadow-lg hover:glow-effect"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-primary drop-shadow-lg" />
        ) : (
          <Sun className="w-6 h-6 text-primary drop-shadow-lg" />
        )}
      </motion.div>
    </motion.button>
  );
};
