import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, Clock, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Problem {
  id: number;
  operation: string;
  correctAnswer: number;
  options: number[];
}

export default function CazaRestas() {
  const navigate = useNavigate();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(50);

  const generateProblem = useCallback((): Problem => {
    const num1 = Math.floor(Math.random() * 20) + 5;
    const num2 = Math.floor(Math.random() * Math.min(num1, 15)) + 1;
    const correctAnswer = num1 - num2;
    
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrong = correctAnswer + (Math.floor(Math.random() * 10) - 5);
      if (wrong !== correctAnswer && wrong >= 0 && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    return {
      id: Date.now(),
      operation: `${num1} - ${num2}`,
      correctAnswer,
      options
    };
  }, []);

  useEffect(() => {
    if (gameActive) {
      setCurrentProblem(generateProblem());
    }
  }, [generateProblem, gameActive]);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem || !gameActive) return;

    if (selectedAnswer === currentProblem.correctAnswer) {
      setScore(score + 10);
      setProblemsCompleted(problemsCompleted + 1);
      setPlayerPosition(Math.random() * 80 + 10);
      toast.success(`¡Correcto! ${currentProblem.operation} = ${selectedAnswer}`);
      
      setTimeout(() => {
        setCurrentProblem(generateProblem());
      }, 800);
    } else {
      setLives(lives - 1);
      toast.error(`¡Ups! ${currentProblem.operation} = ${currentProblem.correctAnswer}`);
      
      if (lives - 1 <= 0) {
        endGame();
      } else {
        setTimeout(() => {
          setCurrentProblem(generateProblem());
        }, 1000);
      }
    }
  };

  const endGame = () => {
    setGameActive(false);
    const stars = score >= 100 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Juego terminado! Puntuación: ${score} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameActive(true);
    setProblemsCompleted(0);
    setPlayerPosition(50);
    setCurrentProblem(generateProblem());
  };

  const getStars = () => {
    if (score >= 100) return 3;
    if (score >= 60) return 2;
    if (score >= 30) return 1;
    return 0;
  };

  if (!gameActive) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange/20 via-yellow/10 to-red/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-orange/30 bg-white/95">
          <Trophy className="w-16 h-16 text-orange mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-fredoka text-orange mb-2">¡Juego Terminado!</h2>
            <p className="text-lg text-muted-foreground">Restas completadas: {problemsCompleted}</p>
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
              className="w-full bg-gradient-to-r from-orange to-red hover:from-orange/90 hover:to-red/90 font-bold py-3"
            >
              🎯 Jugar Otra Vez
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-orange text-orange hover:bg-orange/10"
            >
              🏠 Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/20 via-yellow/10 to-red/20 relative overflow-hidden">
      {/* Elementos decorativos del juego */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-16 w-12 h-12 bg-orange/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-8 h-8 bg-yellow/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-24 w-16 h-16 bg-red/20 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Header con stats */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-orange hover:bg-orange/20"
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
            <span className="text-lg">⚡</span>
            <span className="font-bold text-orange">{score}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? "text-red fill-red" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Personaje animado */}
        <div 
          className="absolute top-20 transition-all duration-500 ease-in-out"
          style={{ left: `${playerPosition}%` }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange to-yellow rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg">
            🦊
          </div>
        </div>

        {/* Problema actual */}
        {currentProblem && (
          <Card className="w-full max-w-lg p-8 text-center space-y-6 border-2 border-orange/30 bg-white/95 shadow-xl">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Problema #{problemsCompleted + 1}
              </h3>
              <div className="text-5xl font-fredoka text-orange mb-4">
                {currentProblem.operation} = ?
              </div>
              <p className="text-muted-foreground">
                ¡Ayuda al zorro a encontrar la respuesta correcta!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentProblem.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="h-16 text-2xl font-bold bg-gradient-to-r from-yellow to-orange hover:from-yellow/90 hover:to-orange/90 border-2 border-orange/30 hover:border-orange/50 transform hover:scale-105 transition-all duration-200"
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> ¡Piensa bien antes de responder!
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}