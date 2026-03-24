FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# We copy the entire backend into the /app/backend directory so module imports work correctly
COPY . /app/backend/

# Uvicorn looks for backend/main.py -> app object
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
