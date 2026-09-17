import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar";

import CopilotWidget from "@/components/copilot/CopilotWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fraud Detection",
  description: "Advanced Fraud Detection Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen overflow-hidden relative`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--background)]">
          <div className="max-w-5xl mx-auto px-12 py-16">
            {children}
          </div>
        </main>
        <CopilotWidget />
      </body>
    </html>
  );
}
