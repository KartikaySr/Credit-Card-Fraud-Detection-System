"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const PlatformTutorial = dynamic(
  () => import("./PlatformTutorial").then((mod) => mod.PlatformTutorial),
  { ssr: false } // Joyride needs to run only on the client
);

interface TutorialContextType {
  startTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startTutorial = () => {
    setRun(true);
  };

  const handleFinish = () => {
    setRun(false);
  };

  return (
    <TutorialContext.Provider value={{ startTutorial }}>
      {children}
      {mounted && <PlatformTutorial run={run} onFinish={handleFinish} />}
    </TutorialContext.Provider>
  );
}
