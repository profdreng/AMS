import streamlit as st
import os

# Define the pages (portas)
dashboard = st.Page("pages/0_dashboard.py", title="Dashboard", icon="📊", default=True)
ferramentas = st.Page("pages/1_ferramentas.py", title="Gestão de Ferramentas", icon="🛠️")
intervencoes = st.Page("pages/2_intervencoes.py", title="Intervenções Técnicas", icon="⚙️")
projetos = st.Page("pages/3_projetos.py", title="Projetos (OpenProject)", icon="🏗️")
custos = st.Page("pages/4_custos.py", title="Controlo de Custos", icon="💶")

# Initialize Navigation
pg = st.navigation({
    "Principal": [dashboard],
    "Gestão Técnica": [ferramentas, intervencoes],
    "Administração": [projetos, custos],
})

# Page Configuration (Global)
st.set_page_config(
    page_title="APMS - Asset & Project Management",
    page_icon="🏗️",
    layout="wide",
)

# Run the selected page
pg.run()
