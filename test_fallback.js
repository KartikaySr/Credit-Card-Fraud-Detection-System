const today = new Date();
const formatTime = (d) => d.toISOString();
const formatDate = (d) => d.toISOString().split('T')[0];

try {
  const data = {
    transactions_processed: 15847, fraud_detected: 267, fraud_rate: 1.68,
    avg_processing_time_ms: 45.2, model_accuracy: 99.87,
    daily_stats: Array.from({ length: 7 }).map((_, i) => { const d = new Date(today); d.setDate(d.getDate() - (6-i)); return { date: formatDate(d), transactions: 2000 + Math.floor(Math.random()*500), fraud: 20 + Math.floor(Math.random()*30) }; }),
    model_performance: { xgboost_v2: { accuracy: 99.89, precision: 98.5, recall: 96.8, f1_score: 97.6, auc_roc: 0.991, inference_ms: 12.4 }, lightgbm_v4: { accuracy: 99.85, precision: 98.2, recall: 96.9, f1_score: 97.5, auc_roc: 0.989, inference_ms: 8.7 }, catboost_v1: { accuracy: 99.82, precision: 97.9, recall: 97.1, f1_score: 97.5, auc_roc: 0.985, inference_ms: 15.2 } },
    feature_importance: [{ feature: 'V14', importance: 0.24, description: 'PCA Component 14' }, { feature: 'V4', importance: 0.18, description: 'PCA Component 4' }, { feature: 'V12', importance: 0.15, description: 'PCA Component 12' }, { feature: 'Amount', importance: 0.11, description: 'Transaction Amount' }, { feature: 'V17', importance: 0.08, description: 'PCA Component 17' }],
    recent_alerts: [
      { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 15000, risk_score: 95.2, timestamp: formatTime(new Date(today.getTime() - 15 * 60000)) },
      { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 8500, risk_score: 88.7, timestamp: formatTime(new Date(today.getTime() - 45 * 60000)) },
      { id: `TXN-${Math.floor(Math.random()*10000)}`, amount: 12000, risk_score: 92.1, timestamp: formatTime(new Date(today.getTime() - 120 * 60000)) },
    ]
  };
  console.log("Success", data.transactions_processed);
} catch (e) {
  console.error("Error:", e);
}
