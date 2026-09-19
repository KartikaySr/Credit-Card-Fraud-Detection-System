import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import CopilotWidget from "@/components/copilot/CopilotWidget";
import AuthGuard from "@/components/layout/AuthGuard";
import CommandPalette from "@/components/layout/CommandPalette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Fraud Engine",
  description: "Advanced AI-Powered Fraud Detection Platform",
};

import { TutorialProvider } from "@/components/tutorial/TutorialProvider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <Toaster theme="dark" position="bottom-right" />
      <AuthGuard>
        <TutorialProvider>
          <Sidebar />
          <CommandPalette />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--background)]">
            <TopNav />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-8 py-10">
                {children}
              </div>
            </main>
          </div>
          <CopilotWidget />
        </TutorialProvider>
      </AuthGuard>
    </div>
  );
}
