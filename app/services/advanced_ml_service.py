import asyncio
import random
from datetime import datetime, timedelta
import math

class AdvancedMLService:
    """
    Simulation service for advanced ML architectures (Quantum, Federated, GNN) and Dashboard UI.
    """
    
    # Global simulation state
    _speed_multiplier = 1.0
    _anomaly_threshold = 0.85
    
    @classmethod
    def set_simulation_controls(cls, speed: float, threshold: float):
        cls._speed_multiplier = max(0.1, min(speed, 5.0))
        cls._anomaly_threshold = max(0.0, min(threshold, 1.0))
        return {"status": "success", "speed": cls._speed_multiplier, "threshold": cls._anomaly_threshold}

    @classmethod
    def get_simulation_controls(cls):
        return {"speed": cls._speed_multiplier, "threshold": cls._anomaly_threshold}
    
    @staticmethod
    async def get_quantum_status():
        qubits_active = random.randint(14, 24)
        entanglement_coherence = round(random.uniform(98.5, 99.9), 1)
        quantum_advantage = round(random.uniform(1.1, 2.5), 1)
        
        # Hardware Telemetry
        temp = round(random.uniform(12.5, 15.0), 2)
        fidelity = round(random.uniform(99.9, 99.99), 3)
        t1 = round(random.uniform(45.0, 55.0), 1)
        
        return {
            "status": "active",
            "processor": "Hybrid QNN Co-Processor",
            "metrics": {
                "qubits_active": f"{qubits_active} / 24",
                "entanglement_coherence": f"{entanglement_coherence}%",
                "quantum_advantage": f"+{quantum_advantage}% AUC"
            },
            "hardware": {
                "cryo_temp": temp,
                "gate_fidelity": fidelity,
                "t1_relaxation": t1
            },
            "entanglement_matrix": [[round(random.random(), 2) for _ in range(8)] for _ in range(8)],
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    async def get_federated_status():
        current_round = random.randint(42, 105)
        institutions = ["Bank of America", "Chase", "Wells Fargo", "Citibank", "Capital One"]
        participating = random.sample(institutions, 3)
        
        return {
            "status": "training",
            "current_round": current_round,
            "participating_institutions": participating,
            "privacy_mode": "Differential Privacy (Noise=0.1)",
            "global_accuracy": round(random.uniform(97.5, 99.1), 2),
            "stragglers": random.randint(0, 3),
            "updates_received": random.randint(12, 20),
            "drift_history": [round(random.uniform(0.1, 0.4), 2) for _ in range(10)],
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    async def get_gnn_status():
        nodes = random.randint(45000, 50000)
        edges = random.randint(120000, 150000)
        anomalous_subgraphs = random.randint(2, 15)
        
        central_nodes = [
            {"id": f"Acc-{random.randint(1000,9999)}", "score": round(random.uniform(0.6, 0.98), 2), "type": random.choice(["Merchant", "User", "Gateway"])}
            for _ in range(4)
        ]
        central_nodes.sort(key=lambda x: x["score"], reverse=True)
        
        edge_heatmap = [round(random.random(), 2) for _ in range(24)]
        
        return {
            "status": "monitoring",
            "network_size": {
                "nodes": nodes,
                "edges": edges
            },
            "anomalous_subgraphs_detected": anomalous_subgraphs,
            "central_nodes": central_nodes,
            "edge_heatmap": edge_heatmap,
            "timestamp": datetime.now().isoformat()
        }
        
    @staticmethod
    async def get_alerts_status():
        tps = int(random.uniform(850, 1200) * AdvancedMLService._speed_multiplier)
        
        recent_alerts = []
        for i in range(5):
            is_high_risk = random.random() > 0.7
            recent_alerts.append({
                "id": f"TXN-{random.randint(10000, 99999)}",
                "time": (datetime.now() - timedelta(seconds=i*5)).strftime("%H:%M:%S"),
                "amount": f"${random.uniform(10, 5000):.2f}",
                "risk": "High" if is_high_risk else random.choice(["Medium", "Low"]),
                "score": round(random.uniform(85, 99) if is_high_risk else random.uniform(10, 84), 1)
            })
            
        velocity_history = [int(random.uniform(800, 1500) * AdvancedMLService._speed_multiplier) for _ in range(20)]
        
        return {
            "tps": tps,
            "recent_alerts": recent_alerts,
            "velocity_history": velocity_history,
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    async def get_streaming_status():
        logs = []
        for _ in range(8):
            ms = random.randint(10, 150)
            is_fraud = random.random() > AdvancedMLService._anomaly_threshold
            amount = f"{random.uniform(10, 5000):.2f}"
            status = 'ANOMALY DETECTED' if is_fraud else 'CLEAN'
            logs.append(f"[{datetime.now().strftime('%H:%M:%S.%f')[:-3]}] INGEST: Txn${amount} processed in {ms}ms. Status: {status}")
            
        return {
            "logs": logs,
            "kafka_health": {
                "cpu": random.randint(30, 70),
                "jvm_mem": random.randint(60, 85),
                "consumer_lag": round(random.uniform(0.5, 2.5), 1)
            },
            "feature_histogram": [random.randint(5, 100) for _ in range(14)],
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    async def get_analytics_status():
        features = [
            {"name": "V14", "score": 0.95},
            {"name": "V4", "score": 0.82},
            {"name": "V11", "score": 0.76},
            {"name": "V12", "score": 0.61},
            {"name": "Amount", "score": 0.45},
        ]
        
        # Jitter the scores slightly to show live updates
        for f in features:
            f["score"] = min(1.0, max(0.1, f["score"] + random.uniform(-0.02, 0.02)))
            f["score"] = round(f["score"], 2)
            
        features.sort(key=lambda x: x["score"], reverse=True)
            
        return {
            "global_features": features,
            "shap_explanation": {
                "base_value": 0.05,
                "factors": [
                    {"name": "V14", "impact": "+0.42"},
                    {"name": "V4", "impact": "+0.21"},
                    {"name": "Amount", "impact": "-0.12"}
                ],
                "final_score": 0.991
            },
            "precision_recall": {
                "auc": round(random.uniform(0.95, 0.99), 3)
            },
            "timestamp": datetime.now().isoformat()
        }
