"""
Script para resetar a base de dados e recriar as tabelas
"""

from database import engine, Base
from models import *  # Import todos os modelos

print("\n" + "="*60)
print("RESETAR BASE DE DADOS")
print("="*60)

print("\n🗑️  Apagando todas as tabelas...")
Base.metadata.drop_all(bind=engine)
print("✓ Tabelas apagadas")

print("\n📋 Recriando tabelas...")
Base.metadata.create_all(bind=engine)
print("✓ Tabelas recriadas")

print("\n✓ Base de dados resetada com sucesso!")
print("\nAgora execute: python seed_db.py")
print("="*60 + "\n")
