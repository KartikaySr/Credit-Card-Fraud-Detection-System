import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar";
import CopilotWidget from "@/components/copilot/CopilotWidget";
import AuthGuard from "@/components/layout/AuthGuard";
import CommandPalette from "@/components/layout/CommandPalette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Fraud Engine",
  description: "Advanced AI-Powered Fraud Detection Platform",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen overflow-hidden relative`}>
        <Toaster theme="dark" position="bottom-right" />
        <AuthGuard>
          <Sidebar />
          <CommandPalette />
          <main className="flex-1 overflow-y-auto bg-[var(--background)]">
            <div className="max-w-5xl mx-auto px-12 py-16">
              {children}
            </div>
          </main>
          <CopilotWidget />
        </AuthGuard>
      </body>
    </html>
  );
}
