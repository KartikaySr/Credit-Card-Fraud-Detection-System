import pytest
from fastapi.testclient import TestClient
from app.main import app
import os

@pytest.fixture(scope="module")
def test_client():
    # Set the API key environment variable for testing
    os.environ["FRAUD_API_KEY"] = "test-api-key"
    
    with TestClient(app) as client:
        yield client
