#!/bin/bash
# One-command launcher for the fraud detection dashboard (Mac)
cd "$(dirname "$0")"

echo "=== Fraud Detection Dashboard ==="

if [ ! -d "venv" ]; then
  echo "Creating virtual environment (first time only)..."
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip -q
  pip install -r streamlit_requirements.txt
else
  source venv/bin/activate
fi

echo ""
echo "Starting dashboard..."
echo "Opening browser at http://localhost:8501"
echo ""
echo "To STOP: press Ctrl+C in this window"
echo ""

# Open browser on Mac after Streamlit starts
(sleep 3 && open "http://localhost:8501") &

streamlit run dashboard/streamlit_app.py --server.port 8501
