import streamlit as st
import pandas as pd
from utils.api_client import api_client

st.title("🛠️ Gestão de Ferramentas")
st.markdown("Controlo do ciclo de vida técnico e histórico de propriedade das ferramentas.")

# Barra de Ferramentas / Filtros
col_search, col_filter, col_add = st.columns([3, 1, 1])
with col_search:
    # Filtro de pesquisa por código da ferramenta
    search = st.text_input("🔍 Pesquisar por código...", placeholder="Ex: TOOL-A-123")

# Obter a lista de ferramentas da API
# O backend retorna uma lista de dicionários que convertemos em DataFrame para facilitar a visualização.
tools = api_client.get("/tools/") or []
tools_df = pd.DataFrame(tools)

with col_add:
    # Botão para abrir o formulário de registo
    if st.button("➕ Nova Ferramenta", type="primary", use_container_width=True):
        st.session_state.show_tool_form = True

# Formulário de Registo (Expansível)
if st.session_state.get("show_tool_form"):
    with st.expander("📝 Registar Nova Ferramenta", expanded=True):
        with st.form("new_tool"):
            c1, c2 = st.columns(2)
            code = c1.text_input("Código Único *")
            sn = c1.text_input("Nº de Série")
            # Para simplificar, estamos a usar IDs fixos para tipos de ferramenta (referenciados no schema.sql)
            tool_type = c2.selectbox("Tipo de Ferramenta *", [1, 2, 3], format_func=lambda x: f"Tipo {x}")
            desc = st.text_area("Descrição Técnica")
            
            if st.form_submit_button("Submeter"):
                # Enviar os dados para o endpoint POST /tools/ do backend
                res = api_client.post("/tools/", {
                    "code": code, 
                    "serial_number": sn, 
                    "tool_type_id": tool_type, 
                    "description": desc
                })
                if res:
                    st.success("Ferramenta registada com sucesso na base de dados!")
                    # Recarregar a página para mostrar a nova ferramenta na lista
                    st.rerun()

st.divider()

# Listagem de Ferramentas
if not tools_df.empty:
    # Aplicar filtro de pesquisa se existir texto no input
    if search:
        tools_df = tools_df[tools_df["code"].str.contains(search, case=False)]
    
    # Exibição dos dados numa tabela interativa
    st.dataframe(
        tools_df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "active": st.column_config.CheckboxColumn("Ativa"),
            "code": st.column_config.TextColumn("Código"),
            "created_at": st.column_config.DatetimeColumn("Data de Registo")
        }
    )
else:
    st.info("Nenhuma ferramenta encontrada. Utilize o botão acima para registar a primeira ferramenta.")
