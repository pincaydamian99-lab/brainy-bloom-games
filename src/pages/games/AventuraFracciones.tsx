import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, Clock, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

interface FractionProblem {
  id: number;
  instruction: string;
  totalParts: number;
  targetParts: number;
  selectedParts: number[];
}

export default function AventuraFracciones() {
  const navigate = useNavigate();
  const [currentProblem, setCurrentProblem] = useState<FractionProblem | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameActive, setGameActive] = useState(true);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

  const generateProblem = (): FractionProblem => {
    const totalParts = [4, 6, 8][Math.floor(Math.random() * 3)];
    const targetParts = Math.floor(Math.random() * (totalParts - 1)) + 1;
    
    return {
      id: Date.now(),
      instruction: `Corta la pizza en ${targetParts}/${totalParts}`,
      totalParts,
      targetParts,
      selectedParts: []
    };
  };

  useEffect(() => {
    if (gameActive) {
      setCurrentProblem(generateProblem());
      setSelectedParts([]);
    }
  }, [gameActive, problemsCompleted]);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const handlePartClick = (partIndex: number) => {
    if (!currentProblem || !gameActive) return;

    const newSelectedParts = selectedParts.includes(partIndex)
      ? selectedParts.filter(p => p !== partIndex)
      : [...selectedParts, partIndex];

    setSelectedParts(newSelectedParts);
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    if (selectedParts.length === currentProblem.targetParts) {
      setScore(score + 15);
      setProblemsCompleted(problemsCompleted + 1);
      toast.success(`¡Perfecto! ${currentProblem.targetParts}/${currentProblem.totalParts} está correcto`);
      
      setTimeout(() => {
        setSelectedParts([]);
        setCurrentProblem(generateProblem());
      }, 1500);
    } else {
      toast.error(`¡Casi! Necesitas ${currentProblem.targetParts} partes, pero seleccionaste ${selectedParts.length}`);
      setSelectedParts([]);
    }
  };

  const endGame = () => {
    setGameActive(false);
    const stars = score >= 120 ? 3 : score >= 75 ? 2 : score >= 45 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Tiempo agotado! Puntuación: ${score} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameActive(true);
    setProblemsCompleted(0);
    setSelectedParts([]);
    setCurrentProblem(generateProblem());
  };

  const getStars = () => {
    if (score >= 120) return 3;
    if (score >= 75) return 2;
    if (score >= 45) return 1;
    return 0;
  };

  const renderPizza = () => {
    if (!currentProblem) return null;

    const { totalParts } = currentProblem;
    const anglePerPart = 360 / totalParts;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="transform -rotate-90"
        >
          {/* Pizza base */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="4"
          />
          
          {/* Pizza parts */}
          {Array.from({ length: totalParts }, (_, index) => {
            const startAngle = index * anglePerPart;
            const endAngle = (index + 1) * anglePerPart;
            const isSelected = selectedParts.includes(index);
            
            const startRadian = (startAngle * Math.PI) / 180;
            const endRadian = (endAngle * Math.PI) / 180;
            
            const x1 = 128 + 120 * Math.cos(startRadian);
            const y1 = 128 + 120 * Math.sin(startRadian);
            const x2 = 128 + 120 * Math.cos(endRadian);
            const y2 = 128 + 120 * Math.sin(endRadian);
            
            const largeArc = anglePerPart > 180 ? 1 : 0;
            
            const pathData = [
              `M 128 128`,
              `L ${x1} ${y1}`,
              `A 120 120 0 ${largeArc} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={isSelected ? "#EF4444" : "#F59E0B"}
                  stroke="#D97706"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-all duration-200"
                  onClick={() => handlePartClick(index)}
                />
                {/* Pepperoni decorations */}
                {Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
                  const pepperoniAngle = startAngle + (anglePerPart / (i + 2));
                  const pepperoniRadian = (pepperoniAngle * Math.PI) / 180;
                  const radius = 40 + Math.random() * 40;
                  const px = 128 + radius * Math.cos(pepperoniRadian);
                  const py = 128 + radius * Math.sin(pepperoniRadian);
                  
                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py}
                      r="6"
                      fill="#DC2626"
                      className="pointer-events-none"
                    />
                  );
                })}
              </g>
            );
          })}
          
          {/* Center dot */}
          <circle
            cx="128"
            cy="128"
            r="8"
            fill="#D97706"
          />
        </svg>
      </div>
    );
  };

  if (!gameActive) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink/20 via-yellow/10 to-orange/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-pink/30 bg-white/95">
          <ChefHat className="w-16 h-16 text-pink mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-fredoka text-pink mb-2">¡Buen Trabajo Chef!</h2>
            <p className="text-lg text-muted-foreground">Fracciones completadas: {problemsCompleted}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center items-center gap-2">
              <span className="text-xl font-bold">Puntuación: {score}</span>
            </div>
            
            <div className="flex justify-center items-center gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < stars 
                      ? "text-yellow fill-yellow animate-pulse" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={restartGame}
              className="w-full bg-gradient-to-r from-pink to-orange hover:from-pink/90 hover:to-orange/90 font-bold py-3"
            >
              🍕 Cocinar Otra Vez
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-pink text-pink hover:bg-pink/10"
            >
              🏠 Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink/20 via-yellow/10 to-orange/20 relative overflow-hidden">
      {/* Header con stats */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-pink hover:bg-pink/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 text-red" />
            <span className="font-bold text-red">{timeLeft}s</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <span className="text-lg">🍕</span>
            <span className="font-bold text-pink">{score}</span>
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {currentProblem && (
          <Card className="w-full max-w-2xl p-8 text-center space-y-6 border-2 border-pink/30 bg-white/95 shadow-xl">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Problema #{problemsCompleted + 1}
              </h3>
              <div className="text-3xl font-fredoka text-pink mb-4">
                {currentProblem.instruction}
              </div>
              <p className="text-muted-foreground">
                Haz clic en las partes de la pizza para seleccionarlas
              </p>
            </div>

            {renderPizza()}

            <div className="space-y-4">
              <div className="text-lg font-medium">
                Seleccionadas: {selectedParts.length}/{currentProblem.targetParts}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={checkAnswer}
                  disabled={selectedParts.length === 0}
                  className="bg-gradient-to-r from-pink to-orange hover:from-pink/90 hover:to-orange/90 font-bold px-8 py-3"
                >
                  ✅ Confirmar
                </Button>
                
                <Button
                  onClick={() => setSelectedParts([])}
                  variant="outline"
                  className="border-pink text-pink hover:bg-pink/10 px-8 py-3"
                >
                  🔄 Limpiar
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Las fracciones muestran cuántas partes tomar del total
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}