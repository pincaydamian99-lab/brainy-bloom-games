import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import rabbitGameImage from "@/assets/rabbit-game.jpg";
import shapesGameImage from "@/assets/shapes-game.jpg";
import pizzaFractionsImage from "@/assets/pizza-fractions.jpg";

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  timeEstimate: string;
  stars: number;
  maxStars: number;
  image?: string;
  category: string;
  isCompleted?: boolean;
}

const featuredGames: Game[] = [
  {
    id: "caza-numeros",
    title: "Caza de Números",
    description: "¡Ayuda al conejito a saltar entre plataformas y recoger los números correctos!",
    difficulty: "Fácil",
    timeEstimate: "5-10 min",
    stars: 3,
    maxStars: 3,
    image: rabbitGameImage,
    category: "Matemáticas",
    isCompleted: true
  },
  {
    id: "constructor-figuras",
    title: "Constructor de Figuras",
    description: "Arrastra formas geométricas para construir animales y objetos divertidos",
    difficulty: "Fácil",
    timeEstimate: "8-12 min",
    stars: 2,
    maxStars: 3,
    image: shapesGameImage,
    category: "Geometría"
  },
  {
    id: "aventura-fracciones",
    title: "Aventura de Fracciones",
    description: "¡Conviértete en chef y corta pizzas en fracciones deliciosas!",
    difficulty: "Medio",
    timeEstimate: "10-15 min",
    stars: 1,
    maxStars: 3,
    image: pizzaFractionsImage,
    category: "Fracciones"
  },
  {
    id: "laberinto-sumas",
    title: "Laberinto de Sumas",
    description: "Resuelve sumas para encontrar el camino correcto hacia el tesoro",
    difficulty: "Fácil",
    timeEstimate: "6-10 min",
    stars: 0,
    maxStars: 3,
    category: "Matemáticas"
  },
  {
    id: "patrones-numericos",
    title: "Patrones Numéricos",
    description: "¡Completa las secuencias de números en el tren mágico!",
    difficulty: "Medio",
    timeEstimate: "8-12 min",
    stars: 0,
    maxStars: 3,
    category: "Lógica"
  },
  {
    id: "que-hora-es",
    title: "¿Qué Hora Es?",
    description: "Aprende a leer el reloj con nuestro amigo el búho sabio",
    difficulty: "Medio",
    timeEstimate: "10-15 min",
    stars: 0,
    maxStars: 3,
    category: "Tiempo"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", "Matemáticas", "Geometría", "Fracciones", "Lógica", "Tiempo"];

  const filteredGames = featuredGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayGame = (gameId: string) => {
    const game = featuredGames.find(g => g.id === gameId);
    toast(`🎮 ¡Iniciando ${game?.title}! ¡Prepárate para la diversión!`, {
      description: "Cargando tu aventura matemática...",
      duration: 3000,
    });
    
    // Navegar al juego específico
    navigate(`/${gameId}`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-primary/5 to-purple/10">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar />
        
        {/* Contenido del dashboard */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Filtros y búsqueda */}
          <div className="mb-6 p-4 bg-white/50 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar juegos divertidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-white/30"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-white/80 border border-white/30 rounded-lg text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="w-10 h-10"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="w-10 h-10"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sección de juegos destacados */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌟</span>
              <h2 className="text-2xl font-bold">Juegos Destacados</h2>
              <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full font-medium">
                {filteredGames.length} juegos
              </span>
            </div>
            
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  difficulty={game.difficulty}
                  timeEstimate={game.timeEstimate}
                  stars={game.stars}
                  maxStars={game.maxStars}
                  image={game.image}
                  category={game.category}
                  isCompleted={game.isCompleted}
                  onPlay={() => handlePlayGame(game.id)}
                  className={viewMode === "list" ? "md:flex md:flex-row md:items-center" : ""}
                />
              ))}
            </div>
          </div>

          {/* Sección de logros recientes */}
          <div className="mb-8 p-6 bg-gradient-to-r from-success/10 to-secondary/10 rounded-xl border border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏆</span>
              <h3 className="text-xl font-bold">¡Logros Recientes!</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium">Primera Victoria</p>
                  <p className="text-sm text-muted-foreground">Completaste tu primer juego</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-medium">Coleccionista</p>
                  <p className="text-sm text-muted-foreground">100+ estrellas ganadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-2xl">🧮</span>
                <div>
                  <p className="font-medium">Matemático Junior</p>
                  <p className="text-sm text-muted-foreground">Dominaste las sumas</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}