'use client';
import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function GenerateReportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Find the main dashboard container to screenshot
      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) throw new Error('Dashboard content not found');

      const canvas = await html2canvas(dashboardElement, {
        scale: 2, // Higher quality
        backgroundColor: '#000000', // Match our dark theme
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate A4 dimensions (210x297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add a header
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pdfWidth, 20, 'F');
      pdf.text('Nexus Fraud Intelligence Report', 10, 14);
      
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth - 60, 14);

      // Add the screenshot
      pdf.addImage(imgData, 'JPEG', 0, 25, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save(`Nexus_Threat_Report_${new Date().getTime()}.pdf`);
      
      setIsGenerating(false);
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
      
    } catch (err) {
      console.error('Failed to generate PDF', err);
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating || isDone}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isDone 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40'
      }`}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Generating...</span>
        </>
      ) : isDone ? (
        <>
          <Check size={16} />
          <span>Report Saved</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>Export Forensic PDF</span>
        </>
      )}
    </button>
  );
}
