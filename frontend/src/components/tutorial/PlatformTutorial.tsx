"use client";

import React from "react";
import { Joyride, CallBackProps, STATUS, Step } from "react-joyride";
import { useTheme } from "next-themes";

interface PlatformTutorialProps {
  run: boolean;
  onFinish: () => void;
}

export function PlatformTutorial({ run, onFinish }: PlatformTutorialProps) {
  const { theme } = useTheme();
  
  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="flex flex-col gap-2 text-left">
          <h3 className="text-xl font-bold nexus-glow-text mb-1">Welcome to Nexus Fraud Engine</h3>
          <p className="text-[var(--text-muted)] text-sm">
            This is an enterprise-grade platform for AI-driven fraud detection.
            Let's take a quick tour of your new command center.
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".tutorial-status",
      content: (
        <div className="flex flex-col gap-2 text-left">
          <h3 className="font-bold text-[var(--foreground)]">Live System Status</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Monitor real-time latency and active model deployment here. 
            The system currently processes events in under 50ms using XGBoost V2.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: ".tutorial-search",
      content: (
        <div className="flex flex-col gap-2 text-left">
          <h3 className="font-bold text-[var(--foreground)]">Omni-Search</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Instantly query any transaction ID, user segment, or historical alert 
            across the federated databases.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: ".tutorial-copilot",
      content: (
        <div className="flex flex-col gap-2 text-left">
          <h3 className="font-bold text-[var(--foreground)]">AI Copilot</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Ask complex natural language questions. Powered by LLaMA-3 via Groq for 
            instant insights into fraud topologies.
          </p>
        </div>
      ),
      placement: "left",
    },
    {
      target: ".tutorial-ledger",
      content: (
        <div className="flex flex-col gap-2 text-left">
          <h3 className="font-bold text-[var(--foreground)]">Historical Ledger</h3>
          <p className="text-[var(--text-muted)] text-sm">
            A real-time, glassmorphic view of flagged transactions. High-risk items 
            will pulse to demand immediate review.
          </p>
        </div>
      ),
      placement: "top",
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: theme === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.05)",
          backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(10, 15, 12, 0.85)",
          overlayColor: theme === "light" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.6)",
          primaryColor: "var(--gold)",
          textColor: "var(--foreground)",
          width: 400,
          zIndex: 1000,
        },
        tooltip: {
          backdropFilter: "blur(24px)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "0 16px 48px 0 rgba(0, 0, 0, 0.6)",
          padding: "24px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "var(--gold)",
          color: "#050807",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.2s",
        },
        buttonBack: {
          color: "var(--text-muted)",
          marginRight: "12px",
        },
        buttonSkip: {
          color: "var(--text-muted)",
          fontSize: "14px",
        },
      }}
    />
  );
}
