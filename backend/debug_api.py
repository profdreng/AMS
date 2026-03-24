#!/usr/bin/env python3
"""
Script para debugar a base de dados - ver quantas ferramentas existem
e testar a API PUT localmente
"""

import requests
import sys

BACKEND_URL = "http://127.0.0.1:8001"

def listar_ferramentas():
    """Lista todas as ferramentas"""
    print("\n" + "="*60)
    print("LISTAR FERRAMENTAS")
    print("="*60)
    
    try:
        response = requests.get(f"{BACKEND_URL}/tools/")
        print(f"Status: {response.status_code}")
        
        if response.ok:
            ferramentas = response.json()
            print(f"✓ Encontradas {len(ferramentas)} ferramentas:\n")
            
            for f in ferramentas:
                print(f"  ID {f['id']}: {f['code']}")
                print(f"    Descrição: {f.get('description', 'N/A')}")
                print(f"    Série: {f.get('serial_number', 'N/A')}")
                print(f"    Tipo: {f.get('tool_type', {}).get('code', 'N/A')}")
                print(f"    Estado: {'Ativa' if f.get('active') else 'Inativa'}")
                print()
            
            return ferramentas
        else:
            print(f"✗ Erro: {response.text}")
            return []
            
    except Exception as e:
        print(f"✗ Erro de rede: {e}")
        return []


def testar_put(tool_id, ferramentas):
    """Testa o PUT para uma ferramenta"""
    print("\n" + "="*60)
    print(f"TESTAR PUT - Ferramenta ID {tool_id}")
    print("="*60)
    
    # Achar a ferramenta
    ferramenta = next((f for f in ferramentas if f['id'] == tool_id), None)
    
    if not ferramenta:
        print(f"✗ Ferramenta com ID {tool_id} não encontrada!")
        print(f"   IDs disponíveis: {[f['id'] for f in ferramentas]}")
        return False
    
    print(f"\nFerramenta atual:")
    print(f"  Código: {ferramenta['code']}")
    print(f"  Descrição: {ferramenta.get('description', 'N/A')}")
    
    # Preparar dados para PUT
    dados = {
        "tool_type_id": ferramenta['tool_type_id'],
        "code": ferramenta['code'],
        "description": f"[TESTE] {ferramenta.get('description', 'Sem descrição')}",
        "serial_number": ferramenta['serial_number'],
        "manufacture_date": ferramenta.get('manufacture_date'),
        "technical_document": ferramenta.get('technical_document'),
        "active": ferramenta['active']
    }
    
    print(f"\nEnviando PUT com dados:")
    print(f"  {dados}")
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/tools/{tool_id}",
            json=dados,
            timeout=5
        )
        
        print(f"\nResposta:")
        print(f"  Status: {response.status_code}")
        
        if response.ok:
            resultado = response.json()
            print(f"  ✓ Sucesso!")
            print(f"  Descrição agora: {resultado.get('description')}")
            return True
        else:
            print(f"  ✗ Erro HTTP {response.status_code}")
            print(f"  {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"✗ Não consegue conectar a {BACKEND_URL}")
        print("   Certifique-se que o backend está rodando:")
        print("   cd APMS && python -m uvicorn backend.main:app --reload")
        return False
    except Exception as e:
        print(f"✗ Erro: {e}")
        return False


def main():
    print("\n" + "="*60)
    print("DEBUGAR API TOOLS")
    print("="*60)
    print(f"Backend URL: {BACKEND_URL}\n")
    
    # Listar ferramentas
    ferramentas = listar_ferramentas()
    
    if not ferramentas:
        print("\n⚠  Nenhuma ferramenta encontrada!")
        print("Você precisa de popular a base de dados primeiro.")
        print("Execute: python backend/seed_db.py")
        return 1
    
    # Testar PUT na primeira ferramenta
    primeiro_id = ferramentas[0]['id']
    sucesso = testar_put(primeiro_id, ferramentas)
    
    print("\n" + "="*60)
    if sucesso:
        print("✓ TESTE COMPLETO!")
        print("O PUT funciona corretamente.")
        print("O problema está no frontend.")
    else:
        print("✗ TESTE FALHOU")
        print("Verifique os erros acima.")
    print("="*60 + "\n")
    
    return 0 if sucesso else 1


if __name__ == "__main__":
    sys.exit(main())
