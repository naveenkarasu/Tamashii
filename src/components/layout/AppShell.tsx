import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { MeshGradient } from "../background/MeshGradient";
import { SparkleParticles } from "../anime/SparkleParticles";
import { useAppStore } from "../../store/appStore";

export function AppShell() {
  const theme = useAppStore((s) => s.theme);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <MeshGradient />
      {theme === "anime" && <SparkleParticles visible />}
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
