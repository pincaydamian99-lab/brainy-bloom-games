import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Heart, Trophy, RotateCcw, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGameProgress } from "@/hooks/useGameProgress";
import rabbitGameImage from "@/assets/rabbit-game.jpg";

interface Balloon {
  id: number;
  number: number;
  x: number;
  y: number;
  isCorrect: boolean;
  collected: boolean;
}

interface GameState {
  score: number;
  lives: number;
  level: number;
  targetSum: number;
  currentNumbers: number[];
  balloons: Balloon[];
  gameStatus: "menu" | "playing" | "paused" | "won" | "lost";
  timeLeft: number;
}

export default function CazaNumeros() {
  const navigate = useNavigate();
  const { saveGameProgress } = useGameProgress();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    targetSum: 10,
    currentNumbers: [],
    balloons: [],
    gameStatus: "menu",
    timeLeft: 60
  });

  const generateBalloons = useCallback((targetSum: number, level: number) => {
    const balloons: Balloon[] = [];
    const numBalloons = Math.min(6 + level, 10);
    
    // Generar números correctos que sumen el objetivo
    let remaining = targetSum;
    const correctNumbers: number[] = [];
    
    while (remaining > 0 && correctNumbers.length < 3) {
      const num = Math.min(remaining, Math.floor(Math.random() * 9) + 1);
      correctNumbers.push(num);
      remaining -= num;
    }
    
    // Generar números incorrectos
    const incorrectNumbers: number[] = [];
    for (let i = 0; i < numBalloons - correctNumbers.length; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 10) + 1;
      } while (correctNumbers.includes(num));
      incorrectNumbers.push(num);
    }
    
    // Combinar y mezclar
    const allNumbers = [...correctNumbers, ...incorrectNumbers].sort(() => Math.random() - 0.5);
    
    allNumbers.forEach((num, index) => {
      balloons.push({
        id: index,
        number: num,
        x: Math.random() * 80 + 10, // 10% - 90% del ancho
        y: Math.random() * 60 + 20, // 20% - 80% de la altura
        isCorrect: correctNumbers.includes(num),
        collected: false
      });
    });
    
    return balloons;
  }, []);

  const startGame = () => {
    const balloons = generateBalloons(gameState.targetSum, gameState.level);
    setGameState(prev => ({
      ...prev,
      balloons,
      gameStatus: "playing",
      timeLeft: 60,
      currentNumbers: [],
      score: 0,
      lives: 3
    }));
  };

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const newTargetSum = 10 + (newLevel - 1) * 5; // Incrementar dificultad
    const balloons = generateBalloons(newTargetSum, newLevel);
    
    setGameState(prev => ({
      ...prev,
      level: newLevel,
      targetSum: newTargetSum,
      balloons,
      currentNumbers: [],
      timeLeft: 60
    }));
  };

  const collectBalloon = (balloonId: number) => {
    if (gameState.gameStatus !== "playing") return;
    
    const balloon = gameState.balloons.find(b => b.id === balloonId);
    if (!balloon || balloon.collected) return;

    const newNumbers = [...gameState.currentNumbers, balloon.number];
    const currentSum = newNumbers.reduce((a, b) => a + b, 0);
    
    setGameState(prev => ({
      ...prev,
      balloons: prev.balloons.map(b => 
        b.id === balloonId ? { ...b, collected: true } : b
      ),
      currentNumbers: newNumbers
    }));

    // Verificar si completó la suma
    if (currentSum === gameState.targetSum) {
      const newScore = gameState.score + 100 * gameState.level;
      setGameState(prev => ({ ...prev, score: newScore, currentNumbers: [] }));
      
      toast("🎉 ¡Perfecto! ¡Suma correcta!", {
        description: `+${100 * gameState.level} puntos`,
        duration: 2000,
      });
      
      // Verificar si completó el nivel
      const remainingCorrect = gameState.balloons.filter(b => 
        b.isCorrect && !b.collected && b.id !== balloonId
      ).length;
      
      if (remainingCorrect === 0) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameStatus: "won" }));
          toast("🌟 ¡Nivel completado! ¡Increíble trabajo!", {
            duration: 3000,
          });
        }, 1000);
      }
    } else if (currentSum > gameState.targetSum) {
      // Se pasó de la suma
      const newLives = gameState.lives - 1;
      setGameState(prev => ({ 
        ...prev, 
        lives: newLives, 
        currentNumbers: [] 
      }));
      
      toast("💔 ¡Ups! Te pasaste de la suma. ¡Inténtalo de nuevo!", {
        duration: 2000,
      });
      
      if (newLives <= 0) {
        setGameState(prev => ({ ...prev, gameStatus: "lost" }));
      }
    }
  };

  // Timer
  useEffect(() => {
    if (gameState.gameStatus === "playing" && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.gameStatus === "playing") {
      setGameState(prev => ({ ...prev, gameStatus: "lost" }));
      toast("⏰ ¡Se acabó el tiempo!", { duration: 3000 });
    }
  }, [gameState.gameStatus, gameState.timeLeft]);

  const resetGame = () => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      targetSum: 10,
      currentNumbers: [],
      balloons: [],
      gameStatus: "menu",
      timeLeft: 60
    });
  };

  const currentSum = gameState.currentNumbers.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-purple/10 to-pink/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold rainbow-text">🐰 Caza de Números</h1>
        
        <div className="flex items-center gap-4">
          {gameState.gameStatus === "playing" && (
            <Button
              variant="outline"
              onClick={() => setGameState(prev => ({ 
                ...prev, 
                gameStatus: prev.gameStatus === "playing" ? "paused" : "playing" 
              }))}
            >
              {gameState.gameStatus === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Panel de estado del juego */}
      {gameState.gameStatus !== "menu" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-secondary" />
              <span className="font-bold">{gameState.score}</span>
            </div>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart key={i} className={`w-4 h-4 ${i < gameState.lives ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Vidas</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-bold">{gameState.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">Nivel</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="font-bold text-lg mb-1">{gameState.timeLeft}s</div>
            <p className="text-xs text-muted-foreground">Tiempo</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="font-bold text-lg mb-1">
              {currentSum} / {gameState.targetSum}
            </div>
            <p className="text-xs text-muted-foreground">Suma Objetivo</p>
          </Card>
        </div>
      )}

      {/* Área principal del juego */}
      <Card className="p-6 min-h-[500px] relative overflow-hidden">
        {gameState.gameStatus === "menu" && (
          <div className="text-center">
            <img 
              src={rabbitGameImage} 
              alt="Conejo matemático" 
              className="w-64 h-48 object-cover rounded-lg mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold mb-4">¡Ayuda al Conejito a Recoger Números!</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              Recoge los globos con números que sumen exactamente el número objetivo. 
              ¡Cuidado de no pasarte!
            </p>
            <Button
              size="lg"
              onClick={startGame}
              className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-white font-bold px-8 py-4 text-lg rounded-xl"
            >
              🎮 ¡Empezar Aventura!
            </Button>
          </div>
        )}

        {gameState.gameStatus === "playing" && (
          <div className="relative w-full h-full min-h-[400px]">
            {/* Objetivo actual */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">
                🎯 Encuentra números que sumen: <span className="text-primary text-2xl">{gameState.targetSum}</span>
              </h3>
              {gameState.currentNumbers.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <span>Seleccionados: </span>
                  {gameState.currentNumbers.map((num, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary rounded-lg font-bold">
                      {num}
                    </span>
                  ))}
                  <span>=</span>
                  <span className="px-2 py-1 bg-primary text-white rounded-lg font-bold">
                    {currentSum}
                  </span>
                </div>
              )}
            </div>

            {/* Globos (botones de números) */}
            {gameState.balloons.map((balloon) => (
              <Button
                key={balloon.id}
                className={`absolute w-16 h-16 rounded-full text-lg font-bold transform transition-all duration-200 hover:scale-110 ${
                  balloon.collected
                    ? "opacity-30 cursor-not-allowed"
                    : balloon.isCorrect
                    ? "bg-gradient-to-br from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white"
                    : "bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground"
                }`}
                style={{
                  left: `${balloon.x}%`,
                  top: `${balloon.y}%`,
                  animation: balloon.collected ? "none" : "float 3s ease-in-out infinite",
                  animationDelay: `${balloon.id * 0.5}s`
                }}
                onClick={() => collectBalloon(balloon.id)}
                disabled={balloon.collected}
              >
                {balloon.number}
              </Button>
            ))}

            {/* Conejo animado */}
            <div className="absolute bottom-4 left-4 text-6xl bounce-gentle">
              🐰
            </div>
          </div>
        )}

        {gameState.gameStatus === "paused" && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">⏸️ Juego Pausado</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ¡Tómate un descanso! Puedes continuar cuando estés listo.
            </p>
            <Button
              size="lg"
              onClick={() => setGameState(prev => ({ ...prev, gameStatus: "playing" }))}
              className="bg-gradient-to-r from-primary to-purple text-white font-bold"
            >
              ▶️ Continuar
            </Button>
          </div>
        )}

        {gameState.gameStatus === "won" && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">🎉 ¡Nivel Completado!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ¡Increíble trabajo! Ganaste {100 * gameState.level} puntos.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={nextLevel}
                className="bg-gradient-to-r from-success to-success/80 text-white font-bold"
              >
                🚀 Siguiente Nivel
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                🏠 Volver al Dashboard
              </Button>
            </div>
          </div>
        )}

        {gameState.gameStatus === "lost" && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">💙 ¡Sigue Intentándolo!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              No te preocupes, ¡todos los matemáticos necesitan práctica!
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Puntuación final: {gameState.score}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={startGame}
                className="bg-gradient-to-r from-primary to-purple text-white font-bold"
              >
                🔄 Intentar de Nuevo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                🏠 Volver al Dashboard
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}