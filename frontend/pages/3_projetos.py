import streamlit as st
import pandas as pd
from utils.api_client import api_client

st.title("🏗️ Projetos de Ferramentaria")
st.markdown("Monitorização de projetos sincronizados com o OpenProject central.")

# Obter lista de projetos da base de dados local
projects = api_client.get("/projects/") or []
projects_df = pd.DataFrame(projects)

# Cabeçalho com informações e botão de sincronização
col_info, col_sync = st.columns([3, 1])
with col_info:
    st.info("ℹ️ Clique no botão à direita para atualizar a lista com os dados mais recentes do OpenProject.")
with col_sync:
    # Botão para despoletar a sincronização (Sync via Backend)
    if st.button("🔄 Sincronizar Projetos", type="primary", use_container_width=True):
        # A chamada ao endpoint POST /sync/projects/ faz o backend consultar o OpenProject 
        # e inserir os novos projetos na nossa base de dados SQL local.
        res = api_client.post("/sync/projects/", {})
        if res:
            st.success(f"Sucesso! Foram sincronizados {res.get('synced_projects')} novos projetos.")
            # Recarregar para mostrar os projetos acabados de importar
            st.rerun()

st.divider()

# Exibição dos Projetos
if not projects_df.empty:
    # Escolhemos as colunas mais importantes para o gestor técnico
    st.dataframe(
        projects_df[["code", "description", "status", "start_date", "planned_end_date"]],
        use_container_width=True,
        hide_index=True,
        column_config={
            "code": st.column_config.TextColumn("Código do Projeto"),
            "status": st.column_config.TextColumn("Estado Atual"),
        }
    )
else:
    # Mensagem caso a base de dados local ainda não tenha projetos importados
    st.warning("Nenhum projeto encontrado localmente. Utilize o botão 'Sincronizar Projetos' acima.")
