FROM python:3.10-slim

# Install system dependencies for LightGBM and generic build tools
RUN apt-get update && apt-get install -y \
    libgomp1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy models directory to the root of the app so backend can access it
COPY ["model 1", "model 1/"]
COPY ["model 2", "model 2/"]
COPY ["model 3", "model 3/"]
COPY ["model 4", "model 4/"]
COPY ["model 5", "model 5/"]

COPY backend/requirements.txt requirements.txt

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
