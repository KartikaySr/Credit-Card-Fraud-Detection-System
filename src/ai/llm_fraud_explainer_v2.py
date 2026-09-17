"""
LLM-Powered Fraud Explanation Engine
Generates human-readable explanations for fraud predictions
"""

import json
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)


@dataclass
class TransactionData:
    """Transaction data structure"""
    transaction_id: str
    amount: float
    merchant_name: str
    merchant_category: str
    location: str
    timestamp: str
    card_type: str
    customer_id: str
    device_type: str
    features: List[float]


@dataclass
class FraudPredictionResult:
    """Fraud prediction result"""
    transaction_id: str
    fraud_score: float
    prediction: bool
    confidence: float
    feature_importance: Dict[str, float]
    timestamp: str
    model_version: str


class LLMExplainerService:
    """
    Generate LLM-powered explanations for fraud predictions.
    Fallback to rule-based explanations when LLM unavailable.
    """
    
    def __init__(self, api_provider: str = "openai", api_key: str = None):
        """
        Initialize LLM explainer.
        
        Args:
            api_provider: "openai", "anthropic", or "local"
            api_key: API key for the provider
        """
        self.api_provider = api_provider
        self.api_key = api_key
        self.explanation_cache = {}
        self.fallback_enabled = True
        
        logger.info(f"Initialized LLM Explainer: {api_provider}")
    
    def generate_explanation(self,
                            transaction: TransactionData,
                            prediction: FraudPredictionResult) -> Dict:
        """
        Generate explanation for fraud prediction.
        
        Args:
            transaction: Transaction data
            prediction: Fraud prediction result
            
        Returns:
            Explanation dictionary with multiple formats
        """
        
        # Check cache first
        cache_key = f"{transaction.transaction_id}_{prediction.fraud_score:.2f}"
        if cache_key in self.explanation_cache:
            return self.explanation_cache[cache_key]
        
        # Build prompt
        prompt = self._build_prompt(transaction, prediction)
        
        # Try LLM-based explanation
        explanation = None
        try:
            if self.api_provider == "openai":
                explanation = self._explain_with_openai(prompt, transaction, prediction)
            elif self.api_provider == "anthropic":
                explanation = self._explain_with_anthropic(prompt, transaction, prediction)
        except Exception as e:
            logger.warning(f"LLM explanation failed: {str(e)}. Using fallback.")
        
        # Fallback to rule-based explanation
        if explanation is None and self.fallback_enabled:
            explanation = self._generate_rule_based_explanation(transaction, prediction)
        
        # Cache result
        self.explanation_cache[cache_key] = explanation
        
        return explanation
    
    def _build_prompt(self, transaction: TransactionData, prediction: FraudPredictionResult) -> str:
        """Build prompt for LLM"""
        
        top_features = sorted(
            prediction.feature_importance.items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:5]
        
        prompt = f"""
        You are a fraud analyst expert. Analyze this credit card transaction alert and provide 
        a clear, concise explanation suitable for compliance teams.
        
        TRANSACTION DETAILS:
        - ID: {transaction.transaction_id}
        - Amount: ${transaction.amount:,.2f}
        - Merchant: {transaction.merchant_name} ({transaction.merchant_category})
        - Location: {transaction.location}
        - Time: {transaction.timestamp}
        - Card Type: {transaction.card_type}
        - Device: {transaction.device_type}
        
        FRAUD DETECTION RESULT:
        - Risk Score: {prediction.fraud_score:.1%}
        - Model Prediction: {'FRAUDULENT' if prediction.prediction else 'LEGITIMATE'}
        - Confidence: {prediction.confidence:.1%}
        - Model Version: {prediction.model_version}
        
        TOP RISK FACTORS:
        {self._format_top_features(top_features)}
        
        REQUIRED RESPONSE FORMAT:
        [Risk Level: HIGH/MEDIUM/LOW]
        [Primary Reasons]: List main fraud indicators
        [Pattern Match]: Any known fraud patterns detected
        [Recommended Action]: Block/Review/Approve
        
        Keep explanation under 150 words. Be specific and actionable.
        """
        
        return prompt
    
    def _format_top_features(self, features: List[Tuple[str, float]]) -> str:
        """Format top features for prompt"""
        lines = []
        for feature, importance in features:
            direction = "↑" if importance > 0 else "↓"
            lines.append(f"  {direction} {feature}: {abs(importance):.4f}")
        return "\n".join(lines)
    
    def _explain_with_openai(self, prompt: str, transaction: TransactionData, 
                            prediction: FraudPredictionResult) -> Dict:
        """Generate explanation using OpenAI API"""
        try:
            from openai import OpenAI
            
            client = OpenAI(api_key=self.api_key)
            
            response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a fraud analyst expert. Provide clear explanations of fraud predictions."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            llm_explanation = response.choices[0].message.content
            
            logger.info(f"Generated OpenAI explanation for {transaction.transaction_id}")
            
            return {
                'transaction_id': transaction.transaction_id,
                'fraud_score': prediction.fraud_score,
                'explanation_method': 'llm_openai',
                'llm_explanation': llm_explanation,
                'timestamp': datetime.now().isoformat(),
                'success': True
            }
            
        except Exception as e:
            logger.error(f"OpenAI explanation failed: {str(e)}")
            return None
    
    def _explain_with_anthropic(self, prompt: str, transaction: TransactionData,
                               prediction: FraudPredictionResult) -> Dict:
        """Generate explanation using Anthropic API"""
        try:
            from anthropic import Anthropic
            
            client = Anthropic(api_key=self.api_key)
            
            message = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=200,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            llm_explanation = message.content[0].text
            
            logger.info(f"Generated Anthropic explanation for {transaction.transaction_id}")
            
            return {
                'transaction_id': transaction.transaction_id,
                'fraud_score': prediction.fraud_score,
                'explanation_method': 'llm_anthropic',
                'llm_explanation': llm_explanation,
                'timestamp': datetime.now().isoformat(),
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Anthropic explanation failed: {str(e)}")
            return None
    
    def _generate_rule_based_explanation(self, transaction: TransactionData,
                                       prediction: FraudPredictionResult) -> Dict:
        """Generate rule-based explanation when LLM unavailable"""
        
        risk_level = self._calculate_risk_level(prediction.fraud_score)
        primary_reasons = self._extract_risk_factors(prediction.feature_importance)
        recommended_action = self._recommend_action(prediction.fraud_score)
        
        explanation = f"""
[Risk Level: {risk_level}]

[Primary Reasons]:
{self._format_reasons(primary_reasons)}

[Pattern Match]:
Transaction amount ${transaction.amount:,.2f} at {transaction.location} ({transaction.merchant_category}).
Time: {transaction.timestamp} (off-peak hours detected).
Device: {transaction.device_type} (new device behavior).

[Recommended Action]: {recommended_action}
"""
        
        logger.info(f"Generated rule-based explanation for {transaction.transaction_id}")
        
        return {
            'transaction_id': transaction.transaction_id,
            'fraud_score': prediction.fraud_score,
            'explanation_method': 'rule_based',
            'explanation': explanation.strip(),
            'risk_level': risk_level,
            'primary_reasons': primary_reasons,
            'recommended_action': recommended_action,
            'timestamp': datetime.now().isoformat(),
            'success': True
        }
    
    def _calculate_risk_level(self, fraud_score: float) -> str:
        """Calculate risk level from fraud score"""
        if fraud_score >= 0.8:
            return "HIGH"
        elif fraud_score >= 0.5:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _extract_risk_factors(self, feature_importance: Dict[str, float]) -> List[str]:
        """Extract top risk factors"""
        factors = []
        for feature, importance in sorted(feature_importance.items(), 
                                         key=lambda x: abs(x[1]), 
                                         reverse=True)[:3]:
            if importance != 0:
                factors.append(f"{feature} ({abs(importance):.2%})")
        return factors
    
    def _format_reasons(self, reasons: List[str]) -> str:
        """Format reasons as bullet points"""
        return "\n".join([f"  • {reason}" for reason in reasons])
    
    def _recommend_action(self, fraud_score: float) -> str:
        """Recommend action based on fraud score"""
        if fraud_score >= 0.8:
            return "BLOCK - High fraud risk detected. Investigate immediately."
        elif fraud_score >= 0.6:
            return "REVIEW - Medium fraud risk. Request verification from cardholder."
        elif fraud_score >= 0.4:
            return "MONITOR - Elevated risk. Flag for monitoring and analysis."
        else:
            return "APPROVE - Low fraud risk. Transaction likely legitimate."


class FewShotLearner:
    """
    Few-shot learning for fraud pattern recognition.
    Learn new fraud patterns from minimal examples.
    """
    
    def __init__(self, embedding_model: str = "sentence-transformers"):
        self.embedding_model = embedding_model
        self.fraud_patterns = {}
        self.pattern_embeddings = {}
        self.exemplars = {}
        
        logger.info(f"Initialized Few-Shot Learner with {embedding_model}")
    
    def add_fraud_pattern(self, pattern_name: str, examples: List[Dict], pattern_class: int):
        """
        Add new fraud pattern with few examples.
        
        Args:
            pattern_name: Name of fraud pattern
            examples: List of example transactions
            pattern_class: Classification (0=legitimate, 1=fraud)
        """
        
        self.fraud_patterns[pattern_name] = {
            'name': pattern_name,
            'class': pattern_class,
            'examples': examples,
            'created_at': datetime.now().isoformat()
        }
        
        # Store exemplar for similarity matching
        if examples:
            self.exemplars[pattern_name] = self._create_exemplar(examples)
        
        logger.info(f"Added fraud pattern: {pattern_name} ({len(examples)} examples)")
    
    def _create_exemplar(self, examples: List[Dict]) -> Dict:
        """Create representative exemplar from examples"""
        
        # Extract numerical features
        amounts = [ex.get('amount', 0) for ex in examples]
        
        exemplar = {
            'avg_amount': sum(amounts) / len(amounts) if amounts else 0,
            'pattern_type': examples[0].get('merchant_category', 'unknown') if examples else 'unknown',
            'location_pattern': examples[0].get('location', 'unknown') if examples else 'unknown',
            'time_pattern': examples[0].get('hour', 12) if examples else 12
        }
        
        return exemplar
    
    def predict_few_shot(self, transaction: Dict) -> Tuple[float, str, str]:
        """
        Predict using few-shot similarity matching.
        
        Args:
            transaction: Transaction to classify
            
        Returns:
            Tuple of (fraud_probability, matched_pattern, reasoning)
        """
        
        max_similarity = -1
        best_match = None
        
        for pattern_name, exemplar in self.exemplars.items():
            similarity = self._calculate_similarity(transaction, exemplar)
            
            if similarity > max_similarity:
                max_similarity = similarity
                best_match = pattern_name
        
        # Convert similarity to probability
        fraud_probability = max(0, min(1, (max_similarity + 1) / 2))
        
        reasoning = f"Matched {best_match} pattern" if best_match else "No pattern match"
        
        return fraud_probability, best_match or "unknown", reasoning
    
    def _calculate_similarity(self, transaction: Dict, exemplar: Dict) -> float:
        """Calculate transaction-exemplar similarity"""
        
        # Amount similarity
        amount_diff = abs(transaction.get('amount', 0) - exemplar['avg_amount'])
        amount_sim = 1 - min(1, amount_diff / (exemplar['avg_amount'] + 1))
        
        # Category similarity
        category_sim = 1.0 if transaction.get('merchant_category') == exemplar['pattern_type'] else 0.5
        
        # Location similarity
        location_sim = 1.0 if transaction.get('location') == exemplar['location_pattern'] else 0.3
        
        # Time similarity
        time_sim = 1.0 - abs(transaction.get('hour', 12) - exemplar['time_pattern']) / 12
        
        # Weighted average
        total_similarity = (0.4 * amount_sim + 0.3 * category_sim + 0.2 * location_sim + 0.1 * time_sim)
        
        return total_similarity


class AdaptiveFraudDetector:
    """
    Adaptive fraud detector that learns from analyst feedback.
    """
    
    def __init__(self):
        self.feedback_history = []
        self.feedback_patterns = {}
        self.model_version = "2.0"
        self.last_retrain = datetime.now().isoformat()
        
        logger.info("Initialized Adaptive Fraud Detector")
    
    def record_feedback(self,
                       transaction_id: str,
                       model_prediction: float,
                       analyst_decision: bool,
                       analyst_comment: str = None):
        """
        Record analyst feedback on fraud prediction.
        
        Args:
            transaction_id: Transaction ID
            model_prediction: Model's fraud score
            analyst_decision: Analyst's actual determination (True=fraud)
            analyst_comment: Optional comment from analyst
        """
        
        feedback = {
            'transaction_id': transaction_id,
            'model_prediction': model_prediction,
            'analyst_decision': analyst_decision,
            'feedback_type': self._classify_feedback(model_prediction, analyst_decision),
            'comment': analyst_comment,
            'timestamp': datetime.now().isoformat()
        }
        
        self.feedback_history.append(feedback)
        
        # Analyze comment for patterns
        if analyst_comment:
            self._extract_pattern_insights(analyst_comment, analyst_decision)
        
        logger.info(f"Recorded feedback: {feedback['feedback_type']}")
    
    def _classify_feedback(self, prediction: float, actual: bool) -> str:
        """Classify feedback type"""
        if prediction > 0.7 and actual:
            return "true_positive"
        elif prediction > 0.7 and not actual:
            return "false_positive"
        elif prediction <= 0.7 and actual:
            return "false_negative"
        else:
            return "true_negative"
    
    def _extract_pattern_insights(self, comment: str, is_fraud: bool):
        """Extract fraud pattern insights from analyst comment"""
        
        # Simple keyword matching for demonstration
        keywords = ['unusual', 'velocity', 'location', 'amount', 'mismatch', 'suspicious']
        
        found_keywords = [kw for kw in keywords if kw.lower() in comment.lower()]
        
        for keyword in found_keywords:
            if keyword not in self.feedback_patterns:
                self.feedback_patterns[keyword] = {'fraud_count': 0, 'total_count': 0}
            
            self.feedback_patterns[keyword]['total_count'] += 1
            if is_fraud:
                self.feedback_patterns[keyword]['fraud_count'] += 1
    
    def get_feedback_insights(self) -> Dict:
        """Get insights from collected feedback"""
        
        if not self.feedback_history:
            return {'status': 'no_feedback_yet'}
        
        feedback_types = {}
        for feedback in self.feedback_history:
            ftype = feedback['feedback_type']
            feedback_types[ftype] = feedback_types.get(ftype, 0) + 1
        
        # Calculate metrics
        total = len(self.feedback_history)
        true_positives = feedback_types.get('true_positive', 0)
        false_positives = feedback_types.get('false_positive', 0)
        false_negatives = feedback_types.get('false_negative', 0)
        
        insights = {
            'total_feedback': total,
            'feedback_distribution': feedback_types,
            'true_positive_rate': true_positives / max(1, true_positives + false_negatives),
            'false_positive_rate': false_positives / max(1, false_positives + total - false_positives),
            'fraud_patterns': self.feedback_patterns,
            'last_updated': datetime.now().isoformat()
        }
        
        return insights


if __name__ == "__main__":
    print("=" * 70)
    print("LLM EXPLAINER & ADAPTIVE LEARNING - PHASE 2 TEST")
    print("=" * 70)
    
    # Test LLM Explainer with fallback
    print("\n📝 Testing LLM Explainer (Fallback Mode)...")
    explainer = LLMExplainerService(api_provider="local")
    
    # Create test transaction
    transaction = TransactionData(
        transaction_id="TXN_001",
        amount=950.00,
        merchant_name="International Electronics",
        merchant_category="Electronics",
        location="Hong Kong",
        timestamp="2024-01-15 03:45:00",
        card_type="Visa",
        customer_id="CUST_123",
        device_type="Mobile",
        features=[1.2, -0.8, 0.5, -1.2, 0.3, 1.8, -0.5, 0.2, 1.1, -0.9]
    )
    
    # Create prediction result
    prediction = FraudPredictionResult(
        transaction_id="TXN_001",
        fraud_score=0.82,
        prediction=True,
        confidence=0.95,
        feature_importance={
            'amount_unusual': 0.35,
            'location_mismatch': 0.28,
            'time_anomaly': 0.22,
            'merchant_new': 0.15
        },
        timestamp=datetime.now().isoformat(),
        model_version="2.0"
    )
    
    explanation = explainer.generate_explanation(transaction, prediction)
    print(f"\n✓ Explanation generated:")
    print(f"  Method: {explanation.get('explanation_method')}")
    print(f"  Risk Level: {explanation.get('risk_level')}")
    print(f"  Recommended Action: {explanation.get('recommended_action')}")
    
    # Test Few-Shot Learning
    print("\n" + "=" * 70)
    print("🔍 Testing Few-Shot Pattern Learning...")
    few_shot = FewShotLearner()
    
    # Add example fraud patterns
    high_value_int_fraud = [
        {'amount': 5000, 'merchant_category': 'Jewelry', 'location': 'Dubai', 'hour': 3},
        {'amount': 6500, 'merchant_category': 'Jewelry', 'location': 'Dubai', 'hour': 2},
        {'amount': 4800, 'merchant_category': 'Jewelry', 'location': 'Dubai', 'hour': 4},
    ]
    
    few_shot.add_fraud_pattern("high_value_jewelry_intl", high_value_int_fraud, pattern_class=1)
    
    # Test prediction
    test_txn = {'amount': 5200, 'merchant_category': 'Jewelry', 'location': 'Dubai', 'hour': 3}
    prob, pattern, reasoning = few_shot.predict_few_shot(test_txn)
    print(f"✓ Few-shot prediction:")
    print(f"  Fraud Probability: {prob:.1%}")
    print(f"  Matched Pattern: {pattern}")
    print(f"  Reasoning: {reasoning}")
    
    # Test Adaptive Feedback
    print("\n" + "=" * 70)
    print("🎓 Testing Adaptive Learning System...")
    adaptive = AdaptiveFraudDetector()
    
    # Simulate analyst feedback
    adaptive.record_feedback("TXN_001", 0.82, True, "High amount + unusual location")
    adaptive.record_feedback("TXN_002", 0.45, False, "Legitimate local purchase")
    adaptive.record_feedback("TXN_003", 0.72, True, "Suspicious velocity + amount")
    
    insights = adaptive.get_feedback_insights()
    print(f"\n✓ Feedback insights:")
    print(f"  Total Feedback: {insights['total_feedback']}")
    print(f"  True Positive Rate: {insights['true_positive_rate']:.1%}")
    print(f"  False Positive Rate: {insights['false_positive_rate']:.1%}")
    
    print("\n✅ Phase 2 Implementation Complete!")
    print("=" * 70)
