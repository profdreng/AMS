import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("Database Configuration Test")
print("=" * 60)

# Check environment variable
db_url = os.getenv("DATABASE_URL")
print(f"\nDATABASE_URL env var: {db_url if db_url else 'NOT SET'}")

# Import database module
from database import SQLALCHEMY_DATABASE_URL, engine

print(f"\nSQLALCHEMY_DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")
print(f"Engine: {engine}")

# Try to connect
try:
    print("\nAttempting connection...")
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ Connection successful!")
        print(f"✓ Query result: {result.fetchone()}")
except Exception as e:
    print(f"✗ Connection failed: {e}")
    print(f"\nNote: The database URL being used is: {SQLALCHEMY_DATABASE_URL}")
