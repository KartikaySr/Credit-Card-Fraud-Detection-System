import asyncio
import json

class CopilotService:
    @staticmethod
    async def generate_response_stream(message: str):
        """Simulates a highly advanced LLM streaming tokens based on context"""
        msg_lower = message.lower()
        
        # Heuristic intent matching
        if any(word in msg_lower for word in ["anomaly", "anomalies", "fraud", "detect"]):
            response = "I have scanned the latest real-time ingestion pipeline. I detected a distinct anomaly cluster in the EU region over the last 48 hours. The PCA feature V14 deviated by 3.2 standard deviations from the baseline, which strongly correlates with high-velocity micro-transaction fraud. I recommend triggering the Automated Retraining Pipeline for the LightGBM ensemble."
        elif any(word in msg_lower for word in ["shap", "explain", "why"]):
            response = "Analyzing the last flagged transaction (TXN-9021). The SHAP values reveal that 'Transaction Amount' ($15,000) and 'Time Elapsed' contributed +4.2 and +2.1 to the log-odds of fraud, respectively. This interaction effect strongly matches historical Account Takeover (ATO) patterns in our graph network. Confidence level is 95%."
        elif any(word in msg_lower for word in ["status", "health", "system", "metrics"]):
            response = "All distributed ML pipelines are operating optimally. The XGBoost and CatBoost models are currently achieving 99.87% accuracy with an ultra-low inference latency of 12ms. The Federated Learning nodes are synced, and the Quantum Co-processor state is coherent."
        else:
            response = "I am the Nexus AI Copilot. I continuously monitor the machine learning inference pipelines, analyze data drift, and can provide interpretable SHAP explanations for any flagged transaction. Try asking me to 'show recent anomalies', 'explain a transaction', or 'check system health'."

        # Simulate real-time LLM token streaming
        words = response.split(" ")
        for word in words:
            # Yield in Server-Sent Events (SSE) format
            chunk = {"chunk": word + " "}
            yield f"data: {json.dumps(chunk)}\n\n"
            # Simulate token generation latency (variable for realism)
            await asyncio.sleep(0.04)
        
        # End of stream indicator
        yield "data: [DONE]\n\n"
