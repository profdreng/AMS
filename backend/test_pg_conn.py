import psycopg2

conn_str = "postgresql://postgres:postgrespassword@192.168.0.71:5433/apms"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    result = cur.fetchone()
    print("Connection OK, SELECT 1 returned:", result)
    cur.close()
    conn.close()
except Exception as e:
    print("Connection failed:", e)