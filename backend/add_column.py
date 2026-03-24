"""
Script para adicionar a coluna technical_document à tabela tool
sem perder os dados existentes
"""

from database import SessionLocal
from sqlalchemy import text

print("\n" + "="*60)
print("ADICIONAR COLUNA technical_document")
print("="*60)

db = SessionLocal()

try:
    # PostgreSQL: verificar se coluna existe antes de adicionar
    sql_check = text("""
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='tool' AND column_name='technical_document'
    );
    """)
    
    result = db.execute(sql_check).scalar()
    
    if not result:
        sql_add = text("""
        ALTER TABLE tool 
        ADD COLUMN technical_document VARCHAR(500) NULL;
        """)
        
        db.execute(sql_add)
        db.commit()
        print("\n✓ Coluna adicionada com sucesso!")
    else:
        print("\n✓ Coluna já existe!")
    
except Exception as e:
    print(f"\n❌ Erro: {e}")
    db.rollback()

finally:
    db.close()

print("="*60 + "\n")
