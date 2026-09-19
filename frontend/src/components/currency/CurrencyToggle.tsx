"use client";

import React from "react";
import { IndianRupee, DollarSign } from "lucide-react";
import { useCurrency } from "./CurrencyProvider";

export function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      className="flex items-center gap-1 p-1.5 px-2 hover:text-[var(--gold)] hover:bg-[var(--card-hover)] rounded-full transition-colors text-[var(--text-muted)] border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-semibold"
      title="Toggle Currency (USD/INR)"
    >
      {currency === "USD" ? (
        <>
          <DollarSign size={14} className="text-[var(--gold)]" />
          <span>USD</span>
        </>
      ) : (
        <>
          <IndianRupee size={14} className="text-[var(--gold)]" />
          <span>INR</span>
        </>
      )}
    </button>
  );
}
