import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Calculator, 
  Shapes, 
  PieChart, 
  Brain, 
  Ruler, 
  Clock, 
  Gamepad2,
  ChevronDown,
  ChevronRight,
  Star,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  children?: {
    title: string;
    path: string;
    description: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Matemáticas",
    icon: Calculator,
    children: [
      { title: "Caza de Números", path: "/caza-numeros", description: "Sumas y restas divertidas" },
      { title: "Laberinto de Sumas", path: "/laberinto-sumas", description: "Resuelve para avanzar" },
      { title: "Batalla de Divisiones", path: "/batalla-divisiones", description: "Hechizos matemáticos" }
    ]
  },
  {
    title: "Aritmética",
    icon: Calculator,
    children: [
      { title: "Caza de Restas", path: "/caza-restas", description: "Cofres mágicos" },
      { title: "Multiplicar y Ganar", path: "/multiplicar", description: "Colecciona estrellas" }
    ]
  },
  {
    title: "Geometría",
    icon: Shapes,
    children: [
      { title: "Constructor de Figuras", path: "/constructor-figuras", description: "Arrastra y construye" },
      { title: "Formas Mágicas", path: "/formas-magicas", description: "Reconoce formas" }
    ]
  },
  {
    title: "Fracciones",
    icon: PieChart,
    children: [
      { title: "Aventura de Fracciones", path: "/aventura-fracciones", description: "Corta pizzas y pasteles" },
      { title: "Partes del Todo", path: "/partes-todo", description: "Aprende mitades y cuartos" }
    ]
  },
  {
    title: "Lógica y Patrones",
    icon: Brain,
    children: [
      { title: "Patrones Numéricos", path: "/patrones-numericos", description: "Completa secuencias" },
      { title: "Comparaciones", path: "/comparaciones", description: "Mayor, menor, igual" }
    ]
  },
  {
    title: "Tiempo y Medidas",
    icon: Ruler,
    children: [
      { title: "Medidas Divertidas", path: "/medidas", description: "Compara tamaños" },
      { title: "¿Qué Hora Es?", path: "/que-hora-es", description: "Lee el reloj" }
    ]
  },
  {
    title: "Juegos Varios",
    icon: Gamepad2,
    children: [
      { title: "Rompecabezas Matemático", path: "/rompecabezas", description: "Une operaciones" },
      { title: "Memorama Matemático", path: "/memorama", description: "Encuentra pares" }
    ]
  }
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Matemáticas"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="w-80 bg-white/90 backdrop-blur-lg border-r border-white/20 h-screen overflow-y-auto">
      {/* Header del Sidebar */}
      <div className="p-6 bg-gradient-to-r from-primary to-purple text-white">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-8 h-8 star-sparkle" />
          <h2 className="text-xl font-bold">Matemáticas</h2>
        </div>
        <p className="text-sm opacity-90">¡Aprende jugando!</p>
        
        {/* Progreso del niño */}
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tu Progreso</span>
            <Trophy className="w-4 h-4" />
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-secondary h-2 rounded-full w-1/3"></div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span>Nivel 3</span>
            <span>⭐ 127 estrellas</span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isExpanded = expandedItems.includes(item.title);
          const Icon = item.icon;
          
          return (
            <div key={item.title} className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between p-3 h-auto text-left font-medium",
                  "hover:bg-primary/10 hover:text-primary transition-all duration-200",
                  "rounded-xl"
                )}
                onClick={() => toggleExpanded(item.title)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              
              {isExpanded && item.children && (
                <div className="ml-4 space-y-1 animate-fade-in">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) => cn(
                        "block p-3 rounded-lg transition-all duration-200",
                        "hover:bg-gradient-to-r hover:from-secondary/20 hover:to-pink/20",
                        "border border-transparent hover:border-secondary/30",
                        isActive 
                          ? "bg-gradient-to-r from-primary/20 to-purple/20 border-primary/30 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="font-medium text-sm">{child.title}</div>
                      <div className="text-xs opacity-70 mt-1">{child.description}</div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}