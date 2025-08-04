import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Target, Calendar } from 'lucide-react';

interface GameProgressCardProps {
  gameName: string;
  bestScore: number;
  starsEarned: number;
  totalAttempts: number;
  isCompleted: boolean;
  onPlay: () => void;
}

export function GameProgressCard({
  gameName,
  bestScore,
  starsEarned,
  totalAttempts,
  isCompleted,
  onPlay
}: GameProgressCardProps) {
  const getGameDisplayName = (name: string) => {
    const names: { [key: string]: string } = {
      'caza-numeros': 'Caza Números',
      'caza-restas': 'Caza Restas',
      'laberinto-sumas': 'Laberinto de Sumas',
      'constructor-figuras': 'Constructor de Figuras',
      'aventura-fracciones': 'Aventura Fracciones',
      'patrones-numericos': 'Patrones Numéricos',
      'juego-tiempo': 'Juego del Tiempo'
    };
    return names[name] || name;
  };

  const getGameEmoji = (name: string) => {
    const emojis: { [key: string]: string } = {
      'caza-numeros': '🔢',
      'caza-restas': '➖',
      'laberinto-sumas': '🧩',
      'constructor-figuras': '🔷',
      'aventura-fracciones': '🍕',
      'patrones-numericos': '🔀',
      'juego-tiempo': '⏰'
    };
    return emojis[name] || '🎮';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/30" onClick={onPlay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getGameEmoji(gameName)}</div>
          <div>
            <h3 className="font-fredoka text-lg font-semibold">{getGameDisplayName(gameName)}</h3>
            <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
              {isCompleted ? "Completado" : "Pendiente"}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < starsEarned 
                  ? "text-yellow fill-yellow" 
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Trophy className="w-5 h-5 text-orange mx-auto" />
          <p className="text-sm font-medium">{bestScore}</p>
          <p className="text-xs text-muted-foreground">Mejor Score</p>
        </div>
        
        <div className="space-y-1">
          <Target className="w-5 h-5 text-green mx-auto" />
          <p className="text-sm font-medium">{totalAttempts}</p>
          <p className="text-xs text-muted-foreground">Intentos</p>
        </div>
        
        <div className="space-y-1">
          <Calendar className="w-5 h-5 text-blue mx-auto" />
          <p className="text-sm font-medium">{starsEarned}/3</p>
          <p className="text-xs text-muted-foreground">Estrellas</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green to-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(starsEarned / 3) * 100}%` }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Progreso: {Math.round((starsEarned / 3) * 100)}%
        </p>
      </div>
    </Card>
  );
}