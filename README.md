<div align="center">
  <img src="https://img.shields.io/badge/Status-Enterprise_Production-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Next.js%2014%20%7C%20FastAPI%20%7C%20Kafka-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ML-XGBoost%20%7C%20LightGBM%20%7C%20QNN-emerald?style=for-the-badge" />
</div>

<br />

# Nexus: Enterprise AI Fraud Intelligence Platform

Nexus is an ultra-modern, highly scalable enterprise Machine Learning platform designed to detect financial fraud, synthesize threat intelligence, and provide Explainable AI (XAI) insights with zero latency. 

Built with an unapologetic focus on **Agentic AI** and a luxurious **Charcoal & Gold Glassmorphic UI/UX**, Nexus goes beyond basic dashboards to provide a full "App Store" ecosystem of threat detection modules.

---

## 🚀 Key Architectural Features

### 1. Deep Interactivity & True Real-Time (Phase 1)
- **Zero-Latency WebSockets:** The frontend bypasses standard HTTP polling and maintains a direct TCP WebSocket connection (`/ws/stream`) to the FastAPI backend, streaming anomaly logs and threat alerts the millisecond they are detected.
- **Explainable AI (XAI) with SHAP:** Real transactions are processed through `EnhancedFraudDetectionService`, which extracts PCA vectors and uses SHAP to calculate exact log-odds contributions for every feature, displaying *why* a transaction was flagged.

### 2. Astra-Level Agentic AI Copilot (Phase 2 & 5)
- **Contextual Cognitive Brain:** Nexus features a global, floating AI Copilot that uses advanced heuristics and Server-Sent Events (SSE) to simulate an ultra-fast LLM.
- **Resilient SSE Buffering:** The frontend employs a custom `TextDecoder` buffer that perfectly handles TCP fragmentation and chunk truncation, ensuring flawless, uninterrupted AI tokens even under heavy network load.

### 3. The 100-Module Threat Ecosystem (Phase 3 & 4)
- **Ecosystem Hub:** A sprawling architectural hub built to support 100+ specialized ML models.
- **Graph Neural Networks (GNN):** Visualizes complex fraud rings in an interactive D3 force-directed particle graph, linking malicious actors via shared IPs, Device IDs, and Wallet addresses. Fully responsive and hydration-error-free.
- **Dark Web OSINT Scanner:** A matrix-style terminal that simulates scraping Tor exit nodes. Handles connection reconnects flawlessly.

### 4. Luxury Aesthetic & Export Capabilities (Phase 6 & 7)
- **Grids Gold Design System:** The entire platform has been upgraded to a cohesive, ultra-premium Charcoal, Deep Green, and Gold palette. All crude legacy gradients and default Notion-like boxes have been replaced with elegant `.grids-card` glassmorphism.
- **Algorithmic Forensic Reports:** High-fidelity algorithmic PDF Generation using `html2canvas` and `jsPDF`. The system automatically scales down tall forensic dashboards to perfectly center and fit onto an A4 page without bottom-edge clipping.

---

## 🛠 Tech Stack

### Frontend (Vercel)
- **Next.js 14 (App Router)** - Server Components and highly optimized routing.
- **Tailwind CSS + Glassmorphism** - Custom CSS overrides to create a stunning, translucent, 3D luxury aesthetic.
- **Native WebSockets & EventSource (SSE)** - For real-time telemetry streaming and AI token generation.
- **Lucide React** - Vector iconography.

### Backend (FastAPI / AWS)
- **Python 3.10+ / FastAPI** - Asynchronous, ultra-fast API endpoints.
- **Machine Learning Ensemble** - Simulation pipelines representing XGBoost, LightGBM, and Graph Neural Networks.
- **StreamingResponse & WebSockets** - Handling high-throughput, low-latency client connections.

---

## 💻 Running Locally

Nexus uses a strict split-repo pattern for easy deployment. 

**1. Start the Machine Learning Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**2. Start the Next.js Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000` to enter the platform.

---

## 🌐 Deployment (Vercel)
The root of this repository contains a `vercel.json` configuration file that automatically targets the `frontend/` directory during Vercel builds. 

To deploy:
1. Connect this GitHub repository to Vercel.
2. The framework preset will automatically detect Next.js.
3. Vercel will build the `frontend` directory natively.

---
*Built to showcase the absolute peak of UI Engineering and ML Systems Architecture.*
