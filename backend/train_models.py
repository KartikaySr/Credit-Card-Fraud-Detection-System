import pandas as pd
import numpy as np
from pathlib import Path
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostClassifier
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    
    phi1 = np.radians(lat1)
    phi2 = np.radians(lat2)
    delta_phi = np.radians(lat2 - lat1)
    delta_lambda = np.radians(lon2 - lon1)
    
    a = np.sin(delta_phi/2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda/2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    
    return R * c

def engineer_features(df, is_training=True, encoders=None, scaler=None):
    df_feat = pd.DataFrame()
    
    # 1. Temporal features
    if 'trans_date_trans_time' in df.columns:
        dt = pd.to_datetime(df['trans_date_trans_time'])
        df_feat['hour'] = dt.dt.hour
        df_feat['day_of_week'] = dt.dt.dayofweek
    else:
        df_feat['hour'] = 0
        df_feat['day_of_week'] = 0
        
    # 2. Distance feature
    if all(c in df.columns for c in ['lat', 'long', 'merch_lat', 'merch_long']):
        df_feat['distance_km'] = haversine_distance(df['lat'], df['long'], df['merch_lat'], df['merch_long'])
    else:
        df_feat['distance_km'] = 0.0
        
    # 3. Age feature
    if 'dob' in df.columns and 'trans_date_trans_time' in df.columns:
        dt = pd.to_datetime(df['trans_date_trans_time'])
        dob = pd.to_datetime(df['dob'])
        df_feat['age'] = (dt - dob).dt.days / 365.25
    else:
        df_feat['age'] = 30.0 # default
        
    # 4. Amounts
    if 'amt' in df.columns:
        df_feat['amt'] = df['amt']
    elif 'Amount' in df.columns:
        df_feat['amt'] = df['Amount']
    elif 'amount' in df.columns:
        df_feat['amt'] = df['amount']
    else:
        df_feat['amt'] = 0.0
        
    # 5. City Population
    if 'city_pop' in df.columns:
        df_feat['city_pop'] = df['city_pop']
    else:
        df_feat['city_pop'] = 100000
        
    # 6. Categorical features
    cat_cols = ['category', 'gender']
    if encoders is None:
        encoders = {}
        
    for col in cat_cols:
        if col in df.columns:
            # fill missing
            val = df[col].fillna('UNKNOWN').astype(str)
            if is_training:
                le = LabelEncoder()
                df_feat[f'{col}_encoded'] = le.fit_transform(val)
                encoders[col] = le
            else:
                le = encoders.get(col)
                if le:
                    # handle unseen labels
                    classes = list(le.classes_)
                    val = val.map(lambda s: s if s in classes else classes[0])
                    df_feat[f'{col}_encoded'] = le.transform(val)
                else:
                    df_feat[f'{col}_encoded'] = 0
        else:
            df_feat[f'{col}_encoded'] = 0

    # Scale numeric features
    num_cols = ['amt', 'distance_km', 'age', 'city_pop']
    if is_training:
        scaler = StandardScaler()
        df_feat[num_cols] = scaler.fit_transform(df_feat[num_cols])
    else:
        if scaler:
            df_feat[num_cols] = scaler.transform(df_feat[num_cols])
            
    # Include existing V1-V28 if they exist, otherwise fill with 0
    # This maintains backward compatibility with the old schema
    for i in range(1, 29):
        v_col = f'V{i}'
        if v_col in df.columns:
            df_feat[v_col] = df[v_col]
        else:
            df_feat[v_col] = 0.0

    return df_feat, encoders, scaler

def train_models():
    train_path = Path("data/fraudTrain.csv")
    test_path = Path("data/fraudTest.csv")
    
    if not train_path.exists():
        logger.error(f"Training dataset not found at {train_path}")
        return

    logger.info("Loading training dataset...")
    # Load training data
    df_train = pd.read_csv(train_path)
    if len(df_train) > 100000:
        logger.info(f"Sampling training dataset from {len(df_train)} to 100,000 rows for faster training...")
        df_fraud = df_train[df_train['is_fraud'] == 1]
        df_non_fraud = df_train[df_train['is_fraud'] == 0].sample(n=100000 - len(df_fraud), random_state=42)
        df_train = pd.concat([df_fraud, df_non_fraud]).sample(frac=1, random_state=42).reset_index(drop=True)

    logger.info("Loading testing dataset...")
    df_test = pd.read_csv(test_path)
    if len(df_test) > 20000:
        df_test = df_test.sample(n=20000, random_state=42).reset_index(drop=True)

    logger.info("Engineering features for training...")
    X_train, encoders, scaler = engineer_features(df_train, is_training=True)
    y_train = df_train['is_fraud']
    
    logger.info("Engineering features for testing...")
    X_test, _, _ = engineer_features(df_test, is_training=False, encoders=encoders, scaler=scaler)
    y_test = df_test['is_fraud']
    
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)

    # Train XGBoost
    logger.info("Training XGBoost...")
    xgb_model = xgb.XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, eval_metric='auc')
    xgb_model.fit(X_train, y_train)

    # Train LightGBM
    logger.info("Training LightGBM...")
    lgb_model = lgb.LGBMClassifier(n_estimators=100, learning_rate=0.1, num_leaves=31, random_state=42)
    lgb_model.fit(X_train, y_train)

    # Train CatBoost
    logger.info("Training CatBoost...")
    cat_model = CatBoostClassifier(iterations=100, learning_rate=0.1, depth=6, random_state=42, verbose=False)
    cat_model.fit(X_train, y_train)

    # Save artifacts
    logger.info("Saving models and preprocessors...")
    joblib.dump(xgb_model, models_dir / 'xgboost_model.joblib')
    joblib.dump(lgb_model, models_dir / 'lightgbm_model.joblib')
    joblib.dump(cat_model, models_dir / 'catboost_model.joblib')
    joblib.dump(scaler, models_dir / 'scaler.joblib')
    joblib.dump(encoders, models_dir / 'encoders.joblib')

    # Save feature names to ensure order consistency
    joblib.dump(list(X_train.columns), models_dir / 'feature_names.joblib')

    logger.info("Training completed successfully!")

if __name__ == "__main__":
    train_models()
