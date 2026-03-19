import { useNavigate } from "react-router";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect } from "react";

export function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que está a tentar aceder não existe.
          <br />
          A redirecionar para a página inicial...
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-[#0066A1] hover:bg-[#005080] gap-2"
        >
          <Home className="w-4 h-4" />
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
}
