import { Button } from "@/components/ui/button";
import { Star, Sparkles, Trophy, Target } from "lucide-react";
import mathHeroImage from "@/assets/math-hero.jpg";

export function HeroSection() {
  return (
    <div className="relative mb-8 p-8 rounded-2xl overflow-hidden">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${mathHeroImage})` }}
      />
      
      {/* Gradiente superpuesto */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple/60 to-pink/80" />
      
      {/* Contenido */}
      <div className="relative z-10 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 star-sparkle" />
          <h1 className="text-4xl font-bold">¡Bienvenido a tu Aventura Matemática!</h1>
          <Sparkles className="w-8 h-8 star-sparkle" />
        </div>
        
        <p className="text-xl mb-6 opacity-90">
          Descubre el mundo mágico de los números donde aprender es súper divertido
        </p>

        {/* Estadísticas destacadas */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 text-secondary" />
              <span className="text-2xl font-bold">127</span>
            </div>
            <p className="text-sm opacity-80">Estrellas ganadas</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-5 h-5 text-secondary" />
              <span className="text-2xl font-bold">5</span>
            </div>
            <p className="text-sm opacity-80">Logros desbloqueados</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-5 h-5 text-secondary" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-sm opacity-80">Juegos completados</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
          >
            🎮 ¡Seguir Jugando!
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 font-bold px-8 py-3 rounded-xl"
          >
            🎯 Ver Mi Progreso
          </Button>
        </div>

        {/* Decoraciones flotantes */}
        <div className="absolute top-4 left-4 text-3xl float">🌟</div>
        <div className="absolute top-8 right-8 text-2xl float" style={{ animationDelay: "1s" }}>🎨</div>
        <div className="absolute bottom-4 left-8 text-3xl float" style={{ animationDelay: "2s" }}>🧮</div>
        <div className="absolute bottom-8 right-4 text-2xl float" style={{ animationDelay: "0.5s" }}>🚀</div>
      </div>
    </div>
  );
}