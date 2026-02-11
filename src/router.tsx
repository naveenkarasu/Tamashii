import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { BlockerPage } from "./components/blocker/BlockerPage";
import { PanicPage } from "./components/panic/PanicPage";
import { StatsPage } from "./components/stats/StatsPage";
import { JournalPage } from "./components/journal/JournalPage";
import { AchievementsPage } from "./components/achievements/AchievementsPage";
import { SettingsPage } from "./components/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "blocker", element: <BlockerPage /> },
      { path: "panic", element: <PanicPage /> },
      { path: "stats", element: <StatsPage /> },
      { path: "journal", element: <JournalPage /> },
      { path: "achievements", element: <AchievementsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
