"""
Advanced Fraud Detection System v1.0 - FastAPI Backend
Built by Kartikay Srivastava (December 2025 – January 2026)
Production-ready API with modern architecture and best practices.
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, status, WebSocket, WebSocketDisconnect, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
import os
from datetime import datetime, timedelta
import json
import io
import csv

from app.core.config import get_application_settings
from app.core.database import get_database_connection
from app.core.cache import get_redis_client
from app.models.transaction_models import (
    TransactionRequest, 
    TransactionResponse, 
    BatchTransactionRequest,
    ModelPerformanceMetrics
)
from app.services.fraud_detection_service import EnhancedFraudDetectionService
from app.services.model_management_service import ModelManagementService
from app.services.advanced_ml_service import AdvancedMLService
from app.services.copilot_service import CopilotService
from app.core.security import create_access_token, verify_token
from app.utils.monitoring import RequestMonitoringMiddleware
from app.utils.rate_limiting import RateLimitingMiddleware

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fraud_detection.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Application lifecycle management
@asynccontextmanager
async def application_lifecycle(app: FastAPI):
    """Manage application startup and shutdown procedures"""
    logger.info("🚀 Starting Advanced Fraud Detection System...")
    
    # Initialize services
    app.state.fraud_service = EnhancedFraudDetectionService()
    app.state.model_service = ModelManagementService()
    
    # Load ML models
    await app.state.fraud_service.initialize_models()
    logger.info("✅ ML Models loaded successfully")
    
    # Initialize database connection pool
    app.state.database = get_database_connection()
    
    # Create tables
    try:
        from app.models.db_models import Base
        from app.core.database import engine
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {str(e)}")

    logger.info("✅ Database connection established")
    
    # Initialize Redis cache
    app.state.cache = get_redis_client()
    logger.info("✅ Redis cache connected")
    
    yield
    
    # Cleanup on shutdown
    logger.info("🛑 Shutting down fraud detection system...")
    await app.state.database.disconnect()
    await app.state.cache.close()

# Create FastAPI application
def create_fraud_detection_application() -> FastAPI:
    """Factory function to create and configure FastAPI application"""
    
    settings = get_application_settings()
    
    app = FastAPI(
        title="Advanced Fraud Detection API",
        description="Production-ready credit card fraud detection system with ML ensemble",
        version="1.0.0",
        docs_url="/api/docs" if settings.environment != "production" else None,
        redoc_url="/api/redoc" if settings.environment != "production" else None,
        lifespan=application_lifecycle
    )
    
    # Security middleware
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)
    
    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )
    
    # Custom middleware
    app.add_middleware(RequestMonitoringMiddleware)
    app.add_middleware(RateLimitingMiddleware, requests_per_minute=100)
    
    return app

# Initialize application
app = create_fraud_detection_application()

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key_header: str = Security(api_key_header)):
    expected_api_key = os.environ.get("FRAUD_API_KEY", "dev-test-key-12345")
    if api_key_header == expected_api_key:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )

@app.get("/", tags=["Health Check"])
async def system_health_check():
    """System health and status endpoint"""
    return {
        "service": "Advanced Fraud Detection System",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "features": [
            "Real-time fraud detection",
            "Ensemble ML models",
            "Batch processing",
            "Model monitoring",
            "Explainable AI"
        ]
    }

@app.get("/api/v1/health", tags=["Health Check"])
async def detailed_health_check():
    """Comprehensive health check with system metrics"""
    try:
        # Check database connectivity
        db_status = await app.state.database.execute("SELECT 1")
        db_healthy = bool(db_status)
        
        # Check cache connectivity  
        cache_status = await app.state.cache.ping()
        cache_healthy = cache_status
        
        # Check model availability
        model_status = app.state.fraud_service.get_model_health()
        
        return {
            "status": "healthy" if all([db_healthy, cache_healthy, model_status["loaded"]]) else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "database": "healthy" if db_healthy else "unhealthy",
                "cache": "healthy" if cache_healthy else "unhealthy",
                "ml_models": "healthy" if model_status["loaded"] else "unhealthy"
            },
            "metrics": {
                "models_loaded": model_status["count"],
                "uptime_seconds": (datetime.utcnow() - app.state.startup_time).total_seconds()
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")

@app.post("/api/v1/detect-fraud", response_model=TransactionResponse, tags=["Fraud Detection"])
async def detect_transaction_fraud(
    transaction: TransactionRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(get_api_key)
):
    """
    Real-time fraud detection for individual transactions
    
    - Processes transaction in real-time (< 100ms)
    - Uses ensemble ML models for high accuracy
    - Provides explainable results
    - Logs transaction for monitoring
    """
    try:
        logger.info(f"Processing fraud detection request for transaction: {transaction.transaction_id}")
        
        # Validate transaction data
        if not transaction.is_valid_transaction():
            raise HTTPException(
                status_code=400, 
                detail="Invalid transaction data provided"
            )
        
        # Perform fraud detection
        detection_result = await app.state.fraud_service.analyze_transaction(
            transaction_data=transaction.dict(),
            user_context={}
        )
        
        # Log transaction for monitoring (background task)
        background_tasks.add_task(
            log_transaction_analysis,
            transaction.dict(),
            detection_result
        )
        
        return TransactionResponse(
            transaction_id=transaction.transaction_id,
            is_fraud=detection_result["is_fraud"],
            fraud_probability=detection_result["probability"],
            risk_score=detection_result["risk_score"],
            confidence_level=detection_result["confidence"],
            explanation=detection_result["explanation"],
            model_version=detection_result["model_version"],
            processing_time_ms=detection_result["processing_time"],
            timestamp=datetime.utcnow()
        )
        
    except ValueError as ve:
        logger.warning(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Fraud detection error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during fraud detection")

@app.post("/api/v1/detect-fraud/batch", tags=["Fraud Detection"])
async def detect_batch_fraud(
    batch_request: BatchTransactionRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(get_api_key)
):
    """
    Batch fraud detection for multiple transactions
    
    - Processes up to 1000 transactions in parallel
    - Optimized for high throughput scenarios
    - Returns aggregated results and statistics
    """
    try:
        if len(batch_request.transactions) > 1000:
            raise HTTPException(
                status_code=413, 
                detail="Batch size exceeds maximum limit of 1000 transactions"
            )
        
        logger.info(f"Processing batch of {len(batch_request.transactions)} transactions")
        
        # Process transactions in parallel
        batch_results = await app.state.fraud_service.analyze_transaction_batch(
            transactions=[t.dict() for t in batch_request.transactions],
            user_context={}
        )
        
        # Generate batch statistics
        fraud_count = sum(1 for r in batch_results if r["is_fraud"])
        avg_risk_score = sum(r["risk_score"] for r in batch_results) / len(batch_results)
        
        # Log batch processing (background task)
        background_tasks.add_task(
            log_batch_analysis,
            len(batch_request.transactions),
            fraud_count,
            avg_risk_score
        )
        
        return {
            "batch_id": batch_request.batch_id,
            "total_transactions": len(batch_request.transactions),
            "fraud_detected": fraud_count,
            "fraud_percentage": (fraud_count / len(batch_request.transactions)) * 100,
            "average_risk_score": round(avg_risk_score, 3),
            "processing_time_ms": sum(r["processing_time"] for r in batch_results),
            "results": batch_results,
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        logger.error(f"Batch processing error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing transaction batch")

@app.get("/api/v1/analytics/dashboard-data", tags=["Analytics"])
async def get_dashboard_analytics(
    days_back: int = 7
):
    """Get analytics data for the dashboard"""
    try:
        analytics_data = await app.state.fraud_service.get_analytics_summary(
            days_back=days_back
        )
        
        return analytics_data
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving analytics data")

from pydantic import BaseModel

class SettingsRequest(BaseModel):
    speed: float
    threshold: float

class ChatRequest(BaseModel):
    message: str

class InjectRequest(BaseModel):
    amount: float

# --- Advanced ML Integration Endpoints ---
@app.get("/api/v1/quantum/status", tags=["Advanced ML"])
async def get_quantum_status():
    """Get metrics from the Hybrid QNN Co-Processor"""
    return await AdvancedMLService.get_quantum_status()

@app.get("/api/v1/federated/status", tags=["Advanced ML"])
async def get_federated_status():
    """Get metrics from the Federated Learning network"""
    return await AdvancedMLService.get_federated_status()

@app.get("/api/v1/gnn/status", tags=["Advanced ML"])
async def get_gnn_status():
    """Get metrics from the Graph Neural Network"""
    return await AdvancedMLService.get_gnn_status()
    
@app.get("/api/v1/alerts/status", tags=["Advanced ML"])
async def get_alerts_status():
    return await AdvancedMLService.get_alerts_status()

@app.get("/api/v1/streaming/status", tags=["Advanced ML"])
async def get_streaming_status():
    return await AdvancedMLService.get_streaming_status()

@app.get("/api/v1/analytics/status", tags=["Advanced ML"])
async def get_analytics_status():
    return await AdvancedMLService.get_analytics_status()

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Broadcast live streaming status every second
            data = await AdvancedMLService.get_streaming_status()
            await websocket.send_json(data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logger.info("Client disconnected from streaming websocket")
        
@app.get("/api/v1/export/csv", tags=["Analytics"])
async def export_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["TransactionID", "Amount", "RiskScore", "Timestamp"])
    # Simulated historical data for Phase 1
    writer.writerow(["TXN-9021", 15000, 95.2, datetime.utcnow().isoformat()])
    writer.writerow(["TXN-3291", 450, 12.1, datetime.utcnow().isoformat()])
    writer.writerow(["TXN-4191", 200, 8.5, datetime.utcnow().isoformat()])
    
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=fraud_report.csv"
    return response

@app.put("/api/v1/settings", tags=["System Config"])
async def update_settings(req: SettingsRequest):
    return AdvancedMLService.set_simulation_controls(req.speed, req.threshold)

@app.get("/api/v1/settings", tags=["System Config"])
async def get_settings():
    return AdvancedMLService.get_simulation_controls()

@app.post("/api/v1/inject-transaction", tags=["System Config"])
async def inject_transaction(req: InjectRequest):
    # Log the injection
    logger.info(f"Manual test vector injected: ${req.amount}")
    return {"status": "success", "message": f"Injected ${req.amount}"}

@app.post("/api/v1/copilot/chat", tags=["AI Copilot"])
async def copilot_chat(req: ChatRequest):
    return StreamingResponse(
        CopilotService.generate_response_stream(req.message),
        media_type="text/event-stream"
    )

@app.get("/api/v1/intelligence/darkweb", tags=["Threat Intelligence"])
async def darkweb_stream():
    """Streams simulated Dark Web OSINT findings (compromised emails/passwords)"""
    import random
    async def event_stream():
        domains = ["gmail.com", "yahoo.com", "protonmail.ch", "corp.bank.com", "gov.ru"]
        sources = ["Pastebin", "Tor Exit Node", "Ransomware Leak Site", "Genesis Market"]
        while True:
            await asyncio.sleep(random.uniform(0.5, 2.5))
            compromised = f"{''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=6))}@{random.choice(domains)}"
            payload = {
                "timestamp": datetime.utcnow().isoformat(),
                "source": random.choice(sources),
                "compromised_identity": compromised,
                "threat_level": random.choice(["HIGH", "CRITICAL", "MEDIUM"]),
                "breach_hash": ''.join(random.choices('0123456789abcdef', k=12))
            }
            yield f"data: {json.dumps(payload)}\n\n"
            
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/api/v1/intelligence/biometrics", tags=["Threat Intelligence"])
async def analyze_biometrics():
    """Simulates behavioral biometric scoring for a session"""
    import random
    return {
        "bot_probability": random.uniform(0.01, 0.99),
        "keystroke_anomaly_score": random.uniform(0, 100),
        "mouse_velocity_variance": random.uniform(0, 50),
        "verdict": "HUMAN" if random.random() > 0.3 else "BOT"
    }

# ----------------------------------------

# Background task functions
async def log_transaction_analysis(transaction_data: dict, result: dict):
    """Log transaction analysis for audit and monitoring"""
    try:
        query = """
            INSERT INTO transactions 
            (transaction_id, amount, merchant_id, merchant_category, transaction_type, 
             transaction_country, transaction_city, card_type, user_id, 
             is_fraud, fraud_probability, risk_score, confidence_level, 
             explanation, model_version, processing_time_ms) 
            VALUES (:transaction_id, :amount, :merchant_id, :merchant_category, :transaction_type, 
             :transaction_country, :transaction_city, :card_type, :user_id, 
             :is_fraud, :fraud_probability, :risk_score, :confidence_level, 
             :explanation, :model_version, :processing_time_ms)
        """
        values = {
            "transaction_id": transaction_data.get("transaction_id"),
            "amount": transaction_data.get("amount", 0.0),
            "merchant_id": transaction_data.get("merchant_id"),
            "merchant_category": transaction_data.get("merchant_category"),
            "transaction_type": transaction_data.get("transaction_type", "purchase"),
            "transaction_country": transaction_data.get("transaction_country"),
            "transaction_city": transaction_data.get("transaction_city"),
            "card_type": transaction_data.get("card_type"),
            "user_id": transaction_data.get("user_id"),
            "is_fraud": result.get("is_fraud", False),
            "fraud_probability": result.get("probability", 0.0),
            "risk_score": result.get("risk_score", 0.0),
            "confidence_level": result.get("confidence", "low"),
            "explanation": json.dumps(result.get("explanation", {})),
            "model_version": result.get("model_version", "1.0.0"),
            "processing_time_ms": result.get("processing_time", 0.0)
        }
        await app.state.database.execute(query=query, values=values)
    except Exception as e:
        logger.error(f"Error logging transaction: {str(e)}")

async def log_batch_analysis(count: int, fraud_count: int, avg_score: float):
    """Log batch analysis results"""
    try:
        query = """
            INSERT INTO batch_logs 
            (total_transactions, fraud_count, avg_risk_score) 
            VALUES (:total_transactions, :fraud_count, :avg_risk_score)
        """
        values = {
            "total_transactions": count,
            "fraud_count": fraud_count,
            "avg_risk_score": avg_score
        }
        await app.state.database.execute(query=query, values=values)
    except Exception as e:
        logger.error(f"Error logging batch analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    settings = get_application_settings()
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development",
        log_level="info"
    )