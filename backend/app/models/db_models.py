from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from datetime import datetime
from app.core.database import Base

class TransactionRecord(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    merchant_id = Column(String, nullable=True)
    merchant_category = Column(String, nullable=True)
    transaction_type = Column(String, nullable=False)
    
    # Geographic
    transaction_country = Column(String, nullable=True)
    transaction_city = Column(String, nullable=True)
    
    # User / Card
    card_type = Column(String, nullable=True)
    user_id = Column(String, nullable=True)
    
    # Fraud Detection Results
    is_fraud = Column(Boolean, nullable=False, default=False)
    fraud_probability = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    confidence_level = Column(String, nullable=False)
    explanation = Column(JSON, nullable=True)
    
    # Metadata
    model_version = Column(String, nullable=False)
    processing_time_ms = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class BatchAnalysisLog(Base):
    __tablename__ = "batch_logs"

    id = Column(Integer, primary_key=True, index=True)
    total_transactions = Column(Integer, nullable=False)
    fraud_count = Column(Integer, nullable=False)
    avg_risk_score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
