import streamlit as st
import pandas as pd
from utils.api_client import api_client

st.title("⚙️ Gestão de Intervenções")
st.markdown("Manutenção, reparações e calibrações de ferramentas registadas.")

# Obter dados necessários (Intervenções e Ferramentas)
# Precisamos das ferramentas para preencher o campo de seleção no formulário.
interventions = api_client.get("/interventions/") or []
tools = api_client.get("/tools/") or []
# Criamos um mapa {id: código} para facilitar a exibição dos nomes das ferramentas na tabela
tools_map = {t["id"]: t["code"] for t in tools}

# Alerta de Regra de Negócio (vindo do React original)
st.warning("⚠️ **Atenção: Limite de intervenções.** Apenas 1 intervenção pode estar aberta por ferramenta.")

# Barra de Ferramentas
col_search, col_filter, col_add = st.columns([3, 1, 1])
with col_search:
    search = st.text_input("🔍 Pesquisar por ID ou tipo...", placeholder="Ex: Manutenção")

# Botão para mostrar o formulário de criação
if st.button("➕ Nova Intervenção", type="primary", use_container_width=True):
    st.session_state.show_int_form = True

# Formulário de Criação de Intervenção
if st.session_state.get("show_int_form"):
    with st.expander("📝 Registar Nova Intervenção", expanded=True):
        with st.form("new_int"):
            c1, c2 = st.columns(2)
            # Seleção da ferramenta pelo código (usando o mapa que criamos acima)
            tool_id = c1.selectbox("Ferramenta *", options=list(tools_map.keys()), format_func=lambda x: tools_map[x])
            int_type = c2.selectbox("Tipo de Intervenção *", ["Manutenção Preventiva", "Reparação", "Calibração"])
            resp = c1.text_input("Responsável Técnico *")
            loc = c2.text_input("Localização / Posto")
            desc = st.text_area("Descrição do Problema / Trabalho")
            
            if st.form_submit_button("Submeter Intervenção"):
                # 1. Enviar apenas para a base de dados local (FastAPI)
                # O utilizador agora decidirá manualmente quando enviar para o OpenProject via botão "Enviar".
                data = {
                    "tool_id": tool_id,
                    "intervention_type": int_type,
                    "responsible": resp,
                    "location": loc,
                    "description": desc,
                    "status": "Aberta"
                }
                res = api_client.post("/interventions/", data)
                if res:
                    st.success("Intervenção registada localmente! Utilize o botão 'Enviar' na lista abaixo para sincronizar.")
                    st.rerun()

st.divider()

# Listagem de Intervenções
if interventions:
    df = pd.DataFrame(interventions)
    # Adicionar uma coluna legível com o código da ferramenta em vez do ID numérico
    df["Ferramenta"] = df["tool_id"].map(tools_map)
    
    if search:
        df = df[df["intervention_type"].str.contains(search, case=False)]
        
    # Exibição das Intervenções com Botão de Sincronização Manual
    st.subheader("Intervenções Registadas")
    
    # Em vez de uma tabela estática (st.dataframe), usamos um loop para adicionar o "Botão Enviar" solicitado
    for index, row in df.iterrows():
        with st.container():
            col1, col2, col3 = st.columns([1, 4, 1])
            with col1:
                st.write(f"**ID: {row['id']}**")
            with col2:
                st.write(f"🛠️ **{row['Ferramenta']}** | {row['intervention_type']} | {row['status']}")
                st.caption(f"Responsável: {row['responsible']} | Aberta em: {row['opened_at']}")
            with col3:
                # O "Botão Enviar" solicitado para sincronização manual
                if st.button("📤 Enviar", key=f"send_{row['id']}", help="Sincronizar com OpenProject"):
                    # Ao clicar, o frontend chama o endpoint de sync do backend para esta intervenção específica
                    sync_res = api_client.post(f"/sync/intervention/{row['id']}", {})
                    if sync_res:
                        st.success(f"Sincronizado!")
                        st.toast(f"Intervenção {row['id']} enviada para o OpenProject.")
            st.divider()
else:
    st.info("Nenhuma intervenção ativa encontrada.")
