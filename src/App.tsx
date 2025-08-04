import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CazaNumeros from "./pages/games/CazaNumeros";
import CazaRestas from "./pages/games/CazaRestas";
import LaberintoSumas from "./pages/games/LaberintoSumas";
import ConstructorFiguras from "./pages/games/ConstructorFiguras";
import AventuraFracciones from "./pages/games/AventuraFracciones";
import PatronesNumericos from "./pages/games/PatronesNumericos";
import JuegoTiempo from "./pages/games/JuegoTiempo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center">
        <div className="text-2xl font-fredoka text-primary">Cargando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/caza-numeros" element={<ProtectedRoute><CazaNumeros /></ProtectedRoute>} />
            <Route path="/caza-restas" element={<ProtectedRoute><CazaRestas /></ProtectedRoute>} />
            <Route path="/laberinto-sumas" element={<ProtectedRoute><LaberintoSumas /></ProtectedRoute>} />
            <Route path="/constructor-figuras" element={<ProtectedRoute><ConstructorFiguras /></ProtectedRoute>} />
            <Route path="/aventura-fracciones" element={<ProtectedRoute><AventuraFracciones /></ProtectedRoute>} />
            <Route path="/patrones-numericos" element={<ProtectedRoute><PatronesNumericos /></ProtectedRoute>} />
            <Route path="/juego-tiempo" element={<ProtectedRoute><JuegoTiempo /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
