import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, Clock, Watch } from 'lucide-react';
import { toast } from 'sonner';

interface TimeChallenge {
  id: number;
  question: string;
  targetTime: { hours: number; minutes: number };
  type: 'read' | 'set';
}

export default function JuegoTiempo() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState<TimeChallenge | null>(null);
  const [userTime, setUserTime] = useState({ hours: 12, minutes: 0 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(80);
  const [gameActive, setGameActive] = useState(true);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const generateChallenge = (): TimeChallenge => {
    const challengeTypes = ['read', 'set'] as const;
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    
    const timeStrings = {
      0: 'en punto',
      15: 'y cuarto',
      30: 'y media',
      45: 'menos cuarto'
    };
    
    const hourNames = [
      '', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis',
      'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'
    ];
    
    let question: string;
    
    if (type === 'read') {
      question = `¿Qué hora marca el reloj?`;
    } else {
      const timeString = minutes === 45 
        ? `${hourNames[hours === 12 ? 1 : hours + 1]} ${timeStrings[minutes]}`
        : `${hourNames[hours]} ${timeStrings[minutes]}`;
      question = `Configura el reloj para que marque las ${timeString}`;
    }
    
    return {
      id: Date.now(),
      question,
      targetTime: { hours, minutes },
      type
    };
  };

  useEffect(() => {
    if (gameActive) {
      setCurrentChallenge(generateChallenge());
      setUserTime({ hours: 12, minutes: 0 });
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

  const checkAnswer = () => {
    if (!currentChallenge) return;

    const isCorrect = 
      userTime.hours === currentChallenge.targetTime.hours &&
      userTime.minutes === currentChallenge.targetTime.minutes;

    if (isCorrect) {
      setScore(score + 15);
      setProblemsCompleted(problemsCompleted + 1);
      toast.success('¡Perfecto! Hora correcta');
      
      setTimeout(() => {
        setCurrentChallenge(generateChallenge());
        setUserTime({ hours: 12, minutes: 0 });
      }, 1500);
    } else {
      const correctTimeStr = formatTime(currentChallenge.targetTime);
      toast.error(`¡Casi! La hora correcta era ${correctTimeStr}`);
      
      // Mostrar la respuesta correcta brevemente
      setTimeout(() => {
        setUserTime(currentChallenge.targetTime);
        
        setTimeout(() => {
          setCurrentChallenge(generateChallenge());
          setUserTime({ hours: 12, minutes: 0 });
        }, 2000);
      }, 1000);
    }
  };

  const formatTime = (time: { hours: number; minutes: number }) => {
    const minuteStr = time.minutes === 0 ? '00' : time.minutes.toString();
    return `${time.hours}:${minuteStr}`;
  };

  const endGame = () => {
    setGameActive(false);
    const stars = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Tiempo agotado! Puntuación: ${score} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(80);
    setGameActive(true);
    setProblemsCompleted(0);
    setUserTime({ hours: 12, minutes: 0 });
    setCurrentChallenge(generateChallenge());
  };

  const getStars = () => {
    if (score >= 90) return 3;
    if (score >= 60) return 2;
    if (score >= 30) return 1;
    return 0;
  };

  const renderClock = (time: { hours: number; minutes: number }, isTarget: boolean = false) => {
    const hourAngle = (time.hours % 12) * 30 + time.minutes * 0.5;
    const minuteAngle = time.minutes * 6;

    return (
      <div className={`relative w-48 h-48 mx-auto ${isTarget ? 'opacity-60' : ''}`}>
        <svg width="192" height="192" viewBox="0 0 192 192" className="absolute">
          {/* Círculo del reloj */}
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="white"
            stroke="#8B5CF6"
            strokeWidth="4"
          />
          
          {/* Números */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i + 1) * 30 - 90;
            const radian = (angle * Math.PI) / 180;
            const x = 96 + 70 * Math.cos(radian);
            const y = 96 + 70 * Math.sin(radian);
            
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold fill-purple"
              >
                {i + 1}
              </text>
            );
          })}
          
          {/* Manecilla de horas */}
          <line
            x1="96"
            y1="96"
            x2={96 + 40 * Math.cos((hourAngle - 90) * Math.PI / 180)}
            y2={96 + 40 * Math.sin((hourAngle - 90) * Math.PI / 180)}
            stroke="#DC2626"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Manecilla de minutos */}
          <line
            x1="96"
            y1="96"
            x2={96 + 65 * Math.cos((minuteAngle - 90) * Math.PI / 180)}
            y2={96 + 65 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Centro */}
          <circle cx="96" cy="96" r="6" fill="#374151" />
        </svg>
        
        {/* Tiempo digital */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-lg font-bold">
          {formatTime(time)}
        </div>
      </div>
    );
  };

  if (!gameActive) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue/20 via-indigo/10 to-purple/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-blue/30 bg-white/95">
          <Watch className="w-16 h-16 text-blue mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-fredoka text-blue mb-2">¡Maestro del Tiempo!</h2>
            <p className="text-lg text-muted-foreground">Horas resueltas: {problemsCompleted}</p>
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
              className="w-full bg-gradient-to-r from-blue to-purple hover:from-blue/90 hover:to-purple/90 font-bold py-3"
            >
              ⏰ Practicar Más Horas
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-blue text-blue hover:bg-blue/10"
            >
              🏠 Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/20 via-indigo/10 to-purple/20 relative overflow-hidden">
      {/* Header con stats */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-blue hover:bg-blue/20"
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
            <span className="text-lg">⏰</span>
            <span className="font-bold text-blue">{score}</span>
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {currentChallenge && (
          <Card className="w-full max-w-2xl p-8 text-center space-y-6 border-2 border-blue/30 bg-white/95 shadow-xl">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Desafío #{problemsCompleted + 1}
              </h3>
              <div className="text-2xl font-fredoka text-blue mb-4">
                {currentChallenge.question}
              </div>
            </div>

            {/* Relojes */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Reloj de referencia (si es tipo 'read') */}
              {currentChallenge.type === 'read' && (
                <div>
                  <h4 className="text-lg font-medium mb-4 text-gray-600">Reloj a leer:</h4>
                  {renderClock(currentChallenge.targetTime, true)}
                </div>
              )}
              
              {/* Reloj interactivo del usuario */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-blue">
                  {currentChallenge.type === 'read' ? 'Tu respuesta:' : 'Configura el reloj:'}
                </h4>
                {renderClock(userTime)}
                
                {/* Controles */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-sm font-medium">Horas</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserTime(prev => ({
                            ...prev,
                            hours: prev.hours === 1 ? 12 : prev.hours - 1
                          }))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-bold">{userTime.hours}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserTime(prev => ({
                            ...prev,
                            hours: prev.hours === 12 ? 1 : prev.hours + 1
                          }))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-sm font-medium">Minutos</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserTime(prev => ({
                            ...prev,
                            minutes: prev.minutes === 0 ? 45 : prev.minutes - 15
                          }))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-bold">{userTime.minutes.toString().padStart(2, '0')}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserTime(prev => ({
                            ...prev,
                            minutes: (prev.minutes + 15) % 60
                          }))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={checkAnswer}
                className="bg-gradient-to-r from-blue to-purple hover:from-blue/90 hover:to-purple/90 font-bold px-8 py-3"
              >
                ✅ Confirmar Hora
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> La manecilla corta marca las horas, la larga los minutos
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}