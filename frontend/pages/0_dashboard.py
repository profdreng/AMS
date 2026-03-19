import streamlit as st

import streamlit as st
from utils.api_client import api_client
import pandas as pd

# Configuração de Estilo CSS para uma aparência "Premium"
# Aqui definimos fontes, cores e pesos para os cabeçalhos e cartões de métricas.
st.markdown("""
<style>
    h1 {
        font-family: 'Inter', sans-serif;
        color: #1a202c;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    div[data-testid="stMetricValue"] {
        font-size: 2.5rem;
        font-weight: 800;
        color: #0066A1;
    }
</style>
""", unsafe_allow_html=True)

st.title("📊 Dashboard Executivo")
st.markdown("Visão geral de Ferramentas, Intervenções e Projetos sincronizados em tempo real.")

# Chamadas à API para obter dados reais da base de dados PostgreSQL
# Se a API falhar, retornamos uma lista vazia para evitar erros no código abaixo.
tools = api_client.get("/tools/") or []
interventions = api_client.get("/interventions/") or []
projects = api_client.get("/projects/") or []

st.divider()

# Linha de KPIs (Key Performance Indicators)
# Utilizamos st.columns para distribuir os cartões horizontalmente.
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric(label="Ferramentas Registadas", value=len(tools))
with col2:
    # Filtramos as intervenções que ainda estão com o estado 'Aberta'
    open_interventions = [i for i in interventions if i.get("status") == "Aberta"]
    st.metric(label="Intervenções Abertas", value=len(open_interventions))
with col3:
    st.metric(label="Projetos Ativos", value=len(projects))
with col4:
    # Este é um placeholder para uma métrica futura de eficiência
    st.metric(label="Taxa de Disponibilidade", value="--", delta="A implementar")

st.divider()

st.subheader("Intervenções Recentes")

# Se existirem intervenções, mostramos uma tabela resumida
if interventions:
    df = pd.DataFrame(interventions)
    # Selecionamos apenas as colunas mais relevantes para o resumo do dashboard
    st.dataframe(
        df[["id", "tool_id", "status", "priority_type", "opened_at"]],
        use_container_width=True,
        hide_index=True,
    )
else:
    # Caso a base de dados esteja vazia, informamos o utilizador
    st.info("Nenhuma intervenção registada no sistema. Comece por criar uma na página de Intervenções.")
