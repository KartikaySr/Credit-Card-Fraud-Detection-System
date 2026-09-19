"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatCurrency: (amountInUSD: number, compact?: boolean) => string;
  usdToInrRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const usdToInrRate = 83.5; // Fixed exchange rate for demo purposes

  // Load saved currency preference
  useEffect(() => {
    const saved = localStorage.getItem("nexus_currency");
    if (saved === "INR" || saved === "USD") {
      setCurrency(saved);
    }
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === "USD" ? "INR" : "USD";
      localStorage.setItem("nexus_currency", next);
      return next;
    });
  };

  const formatCurrency = (amountInUSD: number, compact: boolean = false) => {
    let finalAmount = amountInUSD;
    if (currency === "INR") {
      finalAmount = amountInUSD * usdToInrRate;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: compact ? 1 : 2,
      notation: compact ? "compact" : "standard",
    }).format(finalAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatCurrency, usdToInrRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}
