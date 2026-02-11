import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { useAppStore } from "./store/appStore";
import { applyTheme } from "./lib/theme";

export default function App() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // System theme auto-detect on first load
  useEffect(() => {
    const stored = localStorage.getItem("tamashii-theme");
    if (stored === "dark" || stored === "light" || stored === "anime") {
      useAppStore.getState().setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      useAppStore.getState().setTheme("light");
    }
  }, []);

  return <RouterProvider router={router} />;
}
