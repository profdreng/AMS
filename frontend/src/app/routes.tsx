import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Ferramentas } from "./pages/Ferramentas";
import { Projetos } from "./pages/Projetos";
import { Intervencoes } from "./pages/Intervencoes";
import { Documentacao } from "./pages/Documentacao";
import { Custos } from "./pages/Custos";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "ferramentas", Component: Ferramentas },
      { path: "projetos", Component: Projetos },
      { path: "intervencoes", Component: Intervencoes },
      { path: "documentacao", Component: Documentacao },
      { path: "custos", Component: Custos },
      { path: "*", Component: NotFound },
    ],
  },
]);