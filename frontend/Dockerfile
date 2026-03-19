FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# We copy the frontend directory into /app/frontend
COPY . /app/frontend/

# Set Streamlit server configuration to allow connections
ENV STREAMLIT_SERVER_PORT=8501
ENV STREAMLIT_SERVER_ADDRESS=0.0.0.0

CMD ["streamlit", "run", "frontend/app.py"]
