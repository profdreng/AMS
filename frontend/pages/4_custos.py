import streamlit as st
import pandas as pd

st.title("💶 Controlo de Custos")
st.markdown("Análise de custos técnicos, tempos de execução e integração financeira com Sage X3.")

# Métricas de Resumo (KPIs Financeiros)
# Estes valores são indicadores de alto nível para a gestão e direção.
c1, c2, c3, c4 = st.columns(4)
c1.metric("Total Geral", "€127,850", "+12.5%")
c2.metric("Intervenções Ativas", "€15,600", "+8.3%")
c3.metric("Por Projeto", "€89,200", "-3.2%")
c4.metric("Média/Hora", "€95", "+2.1%")

st.divider()

st.subheader("Custos por Ferramenta")
# Atualmente estes dados são simulados para demonstração da interface.
# No futuro, serão calculados somando as horas e materiais das intervenções na base de dados.
costs_df = pd.DataFrame([
    {"Ferramenta": "TOOL-A-123", "Int.": 3, "Horas": 72, "Total": 9290},
    {"Ferramenta": "TOOL-B-456", "Int.": 2, "Horas": 48, "Total": 6450},
    {"Ferramenta": "TOOL-C-789", "Int.": 5, "Horas": 120, "Total": 14600},
])

# Exibição dos custos em tabela com formatação de moeda
st.dataframe(
    costs_df,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Total": st.column_config.NumberColumn("Total Estimado (€)", format="€%d")
    }
)

st.divider()
st.subheader("Integração Sage X3")
# Informação contextual sobre o fluxo de dados ERP
st.info("""
💡 **Processo de Fluxo de Dados:**
1. Os custos de materiais e mão-de-obra são registados durante a Intervenção.
2. Após o fecho da intervenção no APMS, os dados são exportados para o Sage X3.
3. O Sage X3 valida o stock e atualiza a contabilidade analítica do projeto.
""")
