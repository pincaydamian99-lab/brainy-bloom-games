import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, Clock, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Pattern {
  id: number;
  sequence: (number | string)[];
  missing: number[];
  type: 'addition' | 'multiplication' | 'alternating' | 'fibonacci';
  instruction: string;
}

export default function PatronesNumericos() {
  const navigate = useNavigate();
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameActive, setGameActive] = useState(true);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const generatePattern = (): Pattern => {
    const patterns = [
      // Suma constante
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        const sequence = [];
        for (let i = 0; i < 7; i++) {
          sequence.push(start + i * step);
        }
        const missing = [Math.floor(Math.random() * 5) + 2];
        return {
          sequence: sequence.map((num, i) => missing.includes(i) ? '?' : num),
          missing: missing.map(i => sequence[i]),
          type: 'addition' as const,
          instruction: `Encuentra el número que falta en esta secuencia (suma ${step})`
        };
      },
      
      // Multiplicación
      () => {
        const start = Math.floor(Math.random() * 3) + 2;
        const factor = Math.floor(Math.random() * 3) + 2;
        const sequence = [];
        for (let i = 0; i < 5; i++) {
          sequence.push(start * Math.pow(factor, i));
        }
        const missing = [Math.floor(Math.random() * 3) + 1];
        return {
          sequence: sequence.map((num, i) => missing.includes(i) ? '?' : num),
          missing: missing.map(i => sequence[i]),
          type: 'multiplication' as const,
          instruction: `Encuentra el patrón multiplicativo (×${factor})`
        };
      },
      
      // Alternante
      () => {
        const base1 = Math.floor(Math.random() * 10) + 1;
        const base2 = Math.floor(Math.random() * 10) + 5;
        const step1 = Math.floor(Math.random() * 3) + 2;
        const step2 = Math.floor(Math.random() * 3) + 2;
        const sequence = [];
        for (let i = 0; i < 6; i++) {
          if (i % 2 === 0) {
            sequence.push(base1 + (i / 2) * step1);
          } else {
            sequence.push(base2 + (Math.floor(i / 2)) * step2);
          }
        }
        const missing = [Math.floor(Math.random() * 4) + 1];
        return {
          sequence: sequence.map((num, i) => missing.includes(i) ? '?' : num),
          missing: missing.map(i => sequence[i]),
          type: 'alternating' as const,
          instruction: 'Descubre el patrón alternante'
        };
      }
    ];

    const patternGenerator = patterns[Math.floor(Math.random() * patterns.length)];
    const pattern = patternGenerator();
    
    return {
      id: Date.now(),
      ...pattern
    };
  };

  useEffect(() => {
    if (gameActive) {
      setCurrentPattern(generatePattern());
      setUserAnswers({});
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

  const handleAnswerChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      setUserAnswers(prev => ({
        ...prev,
        [index]: value
      }));
    }
  };

  const checkAnswers = () => {
    if (!currentPattern) return;

    const missingIndices = currentPattern.sequence
      .map((item, index) => item === '?' ? index : -1)
      .filter(index => index !== -1);

    let correct = 0;
    missingIndices.forEach((index, i) => {
      const userAnswer = parseInt(userAnswers[index]);
      const correctAnswer = currentPattern.missing[i];
      
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });

    if (correct === missingIndices.length) {
      const points = currentPattern.type === 'multiplication' ? 25 : 
                   currentPattern.type === 'alternating' ? 20 : 15;
      setScore(score + points);
      setProblemsCompleted(problemsCompleted + 1);
      toast.success('¡Excelente! Patrón descifrado correctamente');
      
      setTimeout(() => {
        setCurrentPattern(generatePattern());
        setUserAnswers({});
      }, 1500);
    } else {
      toast.error(`¡Casi! ${correct}/${missingIndices.length} respuestas correctas`);
      // Mostrar las respuestas correctas brevemente
      setTimeout(() => {
        const newAnswers = {...userAnswers};
        missingIndices.forEach((index, i) => {
          newAnswers[index] = currentPattern.missing[i].toString();
        });
        setUserAnswers(newAnswers);
        
        setTimeout(() => {
          setCurrentPattern(generatePattern());
          setUserAnswers({});
        }, 2000);
      }, 1000);
    }
  };

  const endGame = () => {
    setGameActive(false);
    const stars = score >= 120 ? 3 : score >= 80 ? 2 : score >= 40 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Tiempo agotado! Puntuación: ${score} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameActive(true);
    setProblemsCompleted(0);
    setUserAnswers({});
    setCurrentPattern(generatePattern());
  };

  const getStars = () => {
    if (score >= 120) return 3;
    if (score >= 80) return 2;
    if (score >= 40) return 1;
    return 0;
  };

  if (!gameActive) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple/20 via-blue/10 to-indigo/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-purple/30 bg-white/95">
          <Brain className="w-16 h-16 text-purple mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-fredoka text-purple mb-2">¡Genio de Patrones!</h2>
            <p className="text-lg text-muted-foreground">Patrones resueltos: {problemsCompleted}</p>
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
              className="w-full bg-gradient-to-r from-purple to-indigo hover:from-purple/90 hover:to-indigo/90 font-bold py-3"
            >
              🧠 Resolver Más Patrones
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-purple text-purple hover:bg-purple/10"
            >
              🏠 Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/20 via-blue/10 to-indigo/20 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-12 h-12 bg-purple/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-24 w-8 h-8 bg-indigo/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-16 h-16 bg-blue/20 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Header con stats */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-purple hover:bg-purple/20"
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
            <span className="text-lg">🧠</span>
            <span className="font-bold text-purple">{score}</span>
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {currentPattern && (
          <Card className="w-full max-w-2xl p-8 text-center space-y-6 border-2 border-purple/30 bg-white/95 shadow-xl">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Patrón #{problemsCompleted + 1}
              </h3>
              <div className="text-2xl font-fredoka text-purple mb-4">
                {currentPattern.instruction}
              </div>
            </div>

            {/* Secuencia visual */}
            <div className="flex flex-wrap justify-center items-center gap-4 my-8">
              {currentPattern.sequence.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  {item === '?' ? (
                    <input
                      type="text"
                      value={userAnswers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-16 h-16 text-2xl font-bold text-center border-2 border-purple/30 rounded-lg focus:border-purple focus:outline-none"
                      placeholder="?"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-purple/20 to-indigo/20 border-2 border-purple/30 rounded-lg flex items-center justify-center text-2xl font-bold text-purple">
                      {item}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={checkAnswers}
                disabled={Object.keys(userAnswers).length === 0}
                className="bg-gradient-to-r from-purple to-indigo hover:from-purple/90 hover:to-indigo/90 font-bold px-8 py-3"
              >
                ✅ Verificar Patrón
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Observa cómo cambian los números de uno al siguiente
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}