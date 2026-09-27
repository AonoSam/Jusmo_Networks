import { Palette } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  variant?: "light" | "dark";
}

function ThemeToggle({ variant = "dark" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const baseStyle =
    variant === "light"
      ? "border-slate-200 text-slate-600 hover:bg-slate-50"
      : "border-navy-800 text-navy-300 hover:bg-navy-900";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${baseStyle}`}
      aria-label={`Switch to ${theme === "gold" ? "monochrome" : "gold"} theme`}
      title={`Switch to ${theme === "gold" ? "monochrome" : "gold"} theme`}
    >
      <Palette size={15} />
      {theme === "gold" ? "Gold" : "Mono"}
    </button>
  );
}

export default ThemeToggle;