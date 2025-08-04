import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Trophy, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  timeEstimate: string;
  stars: number;
  maxStars: number;
  image?: string;
  category: string;
  isCompleted?: boolean;
  onPlay: () => void;
  className?: string;
}

export function GameCard({
  title,
  description,
  difficulty,
  timeEstimate,
  stars,
  maxStars,
  image,
  category,
  isCompleted = false,
  onPlay,
  className
}: GameCardProps) {
  const difficultyColors = {
    "Fácil": "bg-success/20 text-success",
    "Medio": "bg-secondary/20 text-secondary-foreground",
    "Difícil": "bg-destructive/20 text-destructive"
  };

  const categoryColors = {
    "Matemáticas": "bg-primary/10 border-primary/20",
    "Aritmética": "bg-secondary/10 border-secondary/20",
    "Geometría": "bg-success/10 border-success/20",
    "Fracciones": "bg-pink/10 border-pink/20",
    "Lógica": "bg-purple/10 border-purple/20",
    "Tiempo": "bg-accent/10 border-accent/20",
    "Varios": "bg-muted/10 border-muted/20"
  };

  return (
    <Card className={cn(
      "game-card p-6 h-full flex flex-col",
      "border-2 transition-all duration-300",
      categoryColors[category as keyof typeof categoryColors] || "bg-card",
      isCompleted && "ring-2 ring-success/50",
      className
    )}>
      {/* Imagen del juego */}
      {image && (
        <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la imagen no carga
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-6xl">
                  ${category === 'Matemáticas' ? '🧮' : 
                    category === 'Geometría' ? '🔷' : 
                    category === 'Fracciones' ? '🍕' : 
                    category === 'Lógica' ? '🧠' : 
                    category === 'Tiempo' ? '⏰' : '🎯'}
                </div>
              `;
            }}
          />
        </div>
      )}

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isCompleted && (
          <Trophy className="w-5 h-5 text-success star-sparkle ml-2" />
        )}
      </div>

      {/* Metadatos */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          difficultyColors[difficulty]
        )}>
          {difficulty}
        </span>
        <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeEstimate}
        </span>
      </div>

      {/* Estrellas */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Progreso:</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: maxStars }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < stars 
                  ? "text-secondary fill-secondary star-sparkle" 
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-1">
          {stars}/{maxStars}
        </span>
      </div>

      {/* Botón de jugar */}
      <Button
        onClick={onPlay}
        className={cn(
          "w-full mt-auto font-bold py-3 rounded-xl",
          "bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90",
          "transform hover:scale-105 transition-all duration-200",
          "flex items-center justify-center gap-2"
        )}
        size="lg"
      >
        <Play className="w-5 h-5" />
        {isCompleted ? "¡Jugar Otra Vez!" : "¡Empezar Aventura!"}
      </Button>
    </Card>
  );
}