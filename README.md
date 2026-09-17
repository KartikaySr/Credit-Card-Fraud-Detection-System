<div align="center">
  <img src="https://img.shields.io/badge/Status-Enterprise_Production-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Next.js%2014%20%7C%20FastAPI%20%7C%20Kafka-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ML-XGBoost%20%7C%20LightGBM%20%7C%20QNN-emerald?style=for-the-badge" />
</div>

<br />

# Nexus: Enterprise AI Fraud Intelligence Platform

Nexus is an ultra-modern, highly scalable enterprise Machine Learning platform designed to detect financial fraud, synthesize threat intelligence, and provide Explainable AI (XAI) insights with zero latency. 

Built with an unapologetic focus on **Agentic AI** and **3D Glassmorphic UI/UX**, Nexus goes beyond basic dashboards to provide a full "App Store" ecosystem of threat detection modules.

---

## 🚀 Key Architectural Features

### 1. Deep Interactivity & True Real-Time (Phase 1)
- **Zero-Latency WebSockets:** The frontend bypasses standard HTTP polling and maintains a direct TCP WebSocket connection (`/ws/stream`) to the FastAPI backend, streaming anomaly logs and threat alerts the millisecond they are detected.
- **Explainable AI (XAI) with SHAP:** Real transactions are processed through `EnhancedFraudDetectionService`, which extracts PCA vectors and uses SHAP to calculate exact log-odds contributions for every feature, displaying *why* a transaction was flagged.

### 2. Astra-Level Agentic AI Copilot (Phase 2)
- **Contextual Cognitive Brain:** Nexus features a global, floating AI Copilot that uses advanced heuristics and Server-Sent Events (SSE) to simulate an ultra-fast LLM.
- **Intent Engine:** It doesn't just chat. Ask it to "Explain the last transaction" and it reads the backend ML state to provide a human-readable translation of the exact mathematical SHAP values that triggered the fraud block.

### 3. The 100-Module Threat Ecosystem (Phase 3)
- **Ecosystem Hub:** A sprawling architectural hub built to support 100+ specialized ML models (e.g., Synthetic Identity Detectors, LLM Firewall).
- **Hero Module: Dark Web OSINT Scanner:** A matrix-style terminal that simulates scraping Tor exit nodes and Pastebin dumps to cross-reference compromised credentials in real-time.
- **Hero Module: Behavioral Biometrics:** A continuous-authentication tracker that actively monitors mouse velocity and keystroke dynamics to assign a live Bot-Probability score to the active session.

### 4. Advanced Graph Neural Networks (GNN)
- Visualizes complex fraud rings in a 3D particle graph, linking malicious actors via shared IPs, Device IDs, and Wallet addresses.

---

## 🛠 Tech Stack

### Frontend (Vercel)
- **Next.js 14 (App Router)** - Server Components and highly optimized routing.
- **Tailwind CSS + Glassmorphism** - Custom CSS overrides to create a stunning, translucent, 3D luxury aesthetic.
- **Native WebSockets & EventSource (SSE)** - For real-time telemetry streaming and AI token generation.
- **Lucide React** - Vector iconography.

### Backend (FastAPI / Render / AWS)
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
