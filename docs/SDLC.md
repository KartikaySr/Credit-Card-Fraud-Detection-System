# Software Development Lifecycle

**Project:** Credit Card Fraud Detection System v1.0  
**Developer:** Kartikay Srivastava  
**Timeline:** December 2025 – January 2026

## 1. Planning & Requirements (Dec 2025)

Defined scope: detect fraudulent credit card transactions using the public Kaggle dataset, expose a REST API, and ship a monitoring dashboard. Chose Python 3.9+, FastAPI, scikit-learn/XGBoost, and Docker.

## 2. Data Analysis & Modeling (Dec 2025)

- Explored class imbalance and feature distributions in Jupyter notebooks
- Trained and compared Random Forest, AdaBoost, and ensemble classifiers
- Evaluated precision/recall trade-offs for fraud vs. false positives
- Saved EDA plots and model comparison results

## 3. Core System Design (Dec 2025)

- Built `src/` fraud detection modules: device fingerprinting, payment validation, behavioral analysis
- Implemented `FraudDetectionBlock` orchestrating weighted risk scoring
- Added structured logging, error handling, and telemetry metrics

## 4. API Development (Dec 2025 – Jan 2026)

- FastAPI backend (`app/`) with health checks, single/batch fraud endpoints
- Pydantic models, Redis caching, rate limiting, JWT security
- Service layer connecting API to detection block

## 5. Dashboard & UI (Jan 2026)

- Real-time FastAPI dashboard with WebSocket transaction feed
- Streamlit analytics app for KPIs and model performance
- Dark-theme monitoring UI

## 6. Testing & QA (Jan 2026)

- Unit tests for fingerprinting, payment validation, detection block
- Integration tests for end-to-end fraud detection flow
- Locust performance/load tests

## 7. Deployment (Jan 2026)

- Multi-stage Dockerfile for production API
- docker-compose stack (API, Postgres, Redis, Kafka, MLflow)
- Model configuration via `model_config.yaml`

## 8. Release v1.0 (Jan 2026)

- Final documentation (README, architecture guide, contributing guide)
- MIT license, version tagging at 1.0.0
- Repository prepared for GitHub publication
