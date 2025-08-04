import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Sparkles, Play, Users, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mathHeroImage from "@/assets/math-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/30 via-purple/20 to-pink/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${mathHeroImage})` }}
        />
        
        {/* Gradiente superpuesto */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple/60 to-pink/80" />
        
        {/* Contenido principal */}
        <div className="relative z-10 px-6 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Título principal */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-12 h-12 star-sparkle" />
              <h1 className="text-6xl font-bold">Matemáticas Divertidas</h1>
              <Sparkles className="w-12 h-12 star-sparkle" />
            </div>
            
            <p className="text-2xl mb-4 opacity-90">
              ¡La plataforma mágica donde los números cobran vida!
            </p>
            
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              Diseñado especialmente para niños de 5 a 8 años. 
              Aprende matemáticas jugando con aventuras interactivas, 
              colores vibrantes y personajes adorables.
            </p>

            {/* Botón principal */}
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-12 py-6 text-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Play className="w-8 h-8 mr-3" />
              ¡Empezar Aventura!
            </Button>

            {/* Decoraciones flotantes */}
            <div className="absolute top-10 left-10 text-6xl float">🌟</div>
            <div className="absolute top-20 right-20 text-5xl float" style={{ animationDelay: "1s" }}>🎨</div>
            <div className="absolute bottom-20 left-20 text-6xl float" style={{ animationDelay: "2s" }}>🧮</div>
            <div className="absolute bottom-10 right-10 text-5xl float" style={{ animationDelay: "0.5s" }}>🚀</div>
          </div>
        </div>
      </div>

      {/* Características principales */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 rainbow-text">
            🎯 ¿Por qué elegir Matemáticas Divertidas?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Característica 1 */}
            <Card className="game-card p-8 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-4">Juegos Interactivos</h3>
              <p className="text-muted-foreground">
                Más de 15 minijuegos educativos diseñados para hacer que las matemáticas sean súper divertidas
              </p>
              <div className="flex items-center justify-center gap-1 mt-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                ))}
              </div>
            </Card>

            {/* Característica 2 */}
            <Card className="game-card p-8 text-center">
              <div className="text-6xl mb-4">👶</div>
              <h3 className="text-xl font-bold mb-4">Para Niños de 5-8 años</h3>
              <p className="text-muted-foreground">
                Diseño especialmente adaptado para niños pequeños con colores vibrantes y navegación intuitiva
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Edad apropiada</span>
              </div>
            </Card>

            {/* Característica 3 */}
            <Card className="game-card p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-4">Sistema de Recompensas</h3>
              <p className="text-muted-foreground">
                Estrellas, medallas y logros que motivan a los niños a seguir aprendiendo y progresando
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Trophy className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Motivación constante</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Categorías de juegos */}
      <div className="py-20 px-6 bg-white/10 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 rainbow-text">
            🎪 Categorías de Aventuras
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "🧮", title: "Aritmética", desc: "Sumas, restas y más" },
              { emoji: "🔷", title: "Geometría", desc: "Formas y figuras" },
              { emoji: "🍕", title: "Fracciones", desc: "Partes del todo" },
              { emoji: "🧠", title: "Lógica", desc: "Patrones y secuencias" },
              { emoji: "⏰", title: "Tiempo", desc: "Horas y medidas" },
              { emoji: "🎯", title: "Comparaciones", desc: "Mayor, menor, igual" },
              { emoji: "🎲", title: "Juegos Varios", desc: "Rompecabezas y más" },
              { emoji: "🌟", title: "Especiales", desc: "Eventos y desafíos" }
            ].map((category, index) => (
              <Card key={index} className="game-card p-6 text-center">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h4 className="font-bold mb-2">{category.title}</h4>
                <p className="text-sm text-muted-foreground">{category.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 rainbow-text">
            🚀 ¡Comienza tu Aventura Matemática Ahora!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de niños que ya están aprendiendo matemáticas de la forma más divertida
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-white font-bold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              <Target className="w-6 h-6 mr-2" />
              ¡Ir al Dashboard!
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">✨ Gratis para siempre</span>
              <span>•</span>
              <span className="text-sm">🎯 Sin anuncios molestos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
