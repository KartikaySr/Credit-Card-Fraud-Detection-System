import asyncio
import json
import random
from datetime import datetime

class CopilotService:
    @staticmethod
    async def generate_response_stream(message: str):
        """Ultra-advanced simulated LLM that streams tokens dynamically"""
        msg_lower = message.lower()
        
        # Determine intent and generate a rich, highly technical response
        if any(w in msg_lower for w in ["anomaly", "anomalies", "drift", "degrade"]):
            resp = (
                "I have scanned the latest real-time ingestion pipeline across all distributed nodes. "
                "I detected a distinct anomaly cluster in the EU-WEST-1 region starting at 04:00 UTC. "
                "The PCA feature V14 deviated by 3.2 standard deviations from the baseline, which strongly correlates "
                "with high-velocity micro-transaction fraud (often seen in card-testing attacks). "
                "The current model drift on LightGBM is -0.42%. I highly recommend triggering the Automated "
                "Retraining Pipeline on the latest 48-hour data window."
            )
        elif any(w in msg_lower for w in ["shap", "explain", "why", "reason"]):
            resp = (
                "Analyzing the last flagged transaction. The SHAP values reveal that 'Transaction Amount' ($15,400) "
                "and 'Time Elapsed Since Last Txn' (3 seconds) were the primary drivers. "
                "These features contributed +4.2 and +2.1 to the log-odds of fraud, respectively. "
                "This interaction effect strongly matches historical Account Takeover (ATO) patterns in our graph network. "
                "Confidence level is 98.7% based on the XGBoost ensemble."
            )
        elif any(w in msg_lower for w in ["status", "health", "system", "metrics", "how is"]):
            resp = (
                "All distributed ML pipelines are operating optimally. "
                f"As of {datetime.now().strftime('%H:%M:%S')} UTC, the XGBoost and CatBoost models are achieving "
                "99.87% accuracy with an ultra-low inference latency of 12.4ms. "
                "The Federated Learning nodes are successfully synced, and the Quantum Co-processor state is fully coherent. "
                "We are processing roughly 4,200 transactions per second with zero bottlenecks."
            )
        elif any(w in msg_lower for w in ["gnn", "graph", "network", "nodes"]):
            resp = (
                "The Graph Neural Network (GNN) has identified 3 active fraud rings in the last 24 hours. "
                "Ring Alpha involves 12 compromised merchant terminals routing micro-transactions to a central node. "
                "Ring Beta shows synthetic identity graphs sharing device fingerprints. "
                "I have automatically adjusted the edge weights in the threat matrix to flag any future transactions connected to these subgraphs."
            )
        elif any(w in msg_lower for w in ["hello", "hi", "hey", "who are you"]):
            resp = (
                "Hello! I am Nexus, your Enterprise AI Copilot. I continuously monitor your machine learning inference pipelines, "
                "analyze data drift, and provide interpretable SHAP explanations for any flagged transaction. "
                "How can I assist you with fraud analysis today?"
            )
        else:
            resp = (
                f"I've analyzed your query regarding '{message}'. "
                "Based on the current telemetry in the Nexus engine, there are no immediate critical alerts matching that specific parameter. "
                "However, I am continuously monitoring the feature space for any subtle deviations. "
                "Would you like me to run a deep SHAP analysis on the recent transaction batch, or check the system's overall drift metrics?"
            )

        # Simulate real-time LLM token streaming (like ChatGPT)
        words = resp.split(" ")
        for i, word in enumerate(words):
            chunk = {"chunk": word + " "}
            yield f"data: {json.dumps(chunk)}\n\n"
            
            # Simulate variable token generation latency for extreme realism
            delay = random.uniform(0.01, 0.05)
            if word.endswith(".") or word.endswith("?"): 
                delay += 0.2  # Pause slightly longer at ends of sentences
            await asyncio.sleep(delay)
        
        yield "data: [DONE]\n\n"
