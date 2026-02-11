import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useAppStore } from "../../store/appStore";

export function PanicButton() {
  const navigate = useNavigate();
  const theme = useAppStore((s) => s.theme);
  const isAnime = theme === "anime";

  const gradient = isAnime
    ? "linear-gradient(135deg, #831843, #9d174d)"
    : "linear-gradient(135deg, #7f1d1d, #991b1b)";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate("/panic")}
      className="panic-pulse w-full rounded-md flex items-center justify-center gap-3 font-display text-sm uppercase text-white cursor-pointer border-0 outline-none"
      style={{
        background: gradient,
        height: "72px",
      }}
    >
      <AlertTriangle size={20} />
      I Need Help Right Now
    </motion.button>
  );
}
