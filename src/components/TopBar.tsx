import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, Volume2, VolumeX, Star, Award } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TopBar() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userName] = useState("Pequeño Matemático"); // En una app real, vendría del contexto de usuario

  const handleLogout = () => {
    toast("¡Hasta la vista! Vuelve pronto para más aventuras matemáticas 🌟");
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast(soundEnabled ? "Sonido desactivado 🔇" : "Sonido activado 🔊");
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-lg border-b border-white/20 px-6 flex items-center justify-between">
      {/* Título principal */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          <h1 className="text-xl font-bold rainbow-text">
            Dashboard - Matemáticas Divertidas
          </h1>
        </div>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Edad: 5-8 años</span>
          <span>•</span>
          <span>Nivel: Principiante</span>
        </div>
      </div>

      {/* Información del usuario y controles */}
      <div className="flex items-center gap-4">
        {/* Estadísticas rápidas */}
        <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-secondary/20 to-pink/20 rounded-full">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">127</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-purple" />
            <span className="text-sm font-medium">5</span>
          </div>
        </div>

        {/* Saludo personalizado */}
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            ¡Hola, {userName}!
          </span>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className="w-10 h-10 rounded-full hover:bg-primary/10"
            title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full hover:bg-muted/50"
            title="Configuración"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}