import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  isPlayer: boolean;
  isGoal: boolean;
  problem?: string;
  correctAnswer?: number;
  isAnswered: boolean;
}

interface Problem {
  question: string;
  options: number[];
  correctAnswer: number;
}

export default function LaberintoSumas() {
  const navigate = useNavigate();
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showProblem, setShowProblem] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(true);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [collectedTreasures, setCollectedTreasures] = useState(0);

  const generateProblem = (): Problem => {
    const num1 = Math.floor(Math.random() * 15) + 1;
    const num2 = Math.floor(Math.random() * 15) + 1;
    const correctAnswer = num1 + num2;
    
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrong = correctAnswer + (Math.floor(Math.random() * 8) - 4);
      if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    return {
      question: `${num1} + ${num2} = ?`,
      options,
      correctAnswer
    };
  };

  const generateMaze = useCallback(() => {
    const size = 8;
    const newMaze: MazeCell[][] = [];
    
    // Crear laberinto base
    for (let y = 0; y < size; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < size; x++) {
        const isWall = Math.random() < 0.25 && !(x === 0 && y === 0) && !(x === size-1 && y === size-1);
        row.push({
          x,
          y,
          isWall,
          isPlayer: x === 0 && y === 0,
          isGoal: x === size-1 && y === size-1,
          isAnswered: false
        });
      }
      newMaze.push(row);
    }
    
    // Añadir problemas en celdas aleatorias
    const problemCells = Math.floor(Math.random() * 4) + 3; // 3-6 problemas
    for (let i = 0; i < problemCells; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!newMaze[y][x].isWall && !newMaze[y][x].isPlayer && !newMaze[y][x].isGoal && !newMaze[y][x].problem) {
        const prob = generateProblem();
        newMaze[y][x].problem = prob.question;
        newMaze[y][x].correctAnswer = prob.correctAnswer;
      }
    }
    
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive || showProblem) return;
      
      let newX = playerPos.x;
      let newY = playerPos.y;
      
      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(0, playerPos.y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(maze.length - 1, playerPos.y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(0, playerPos.x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(maze[0]?.length - 1 || 0, playerPos.x + 1);
          break;
        default:
          return;
      }
      
      // Verificar si la nueva posición es válida
      if (maze[newY] && maze[newY][newX] && !maze[newY][newX].isWall) {
        movePlayer(newX, newY);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, maze, gameActive, showProblem]);

  const movePlayer = (newX: number, newY: number) => {
    const cell = maze[newY][newX];
    
    // Actualizar posición del jugador
    const newMaze = maze.map(row => 
      row.map(cell => ({ ...cell, isPlayer: false }))
    );
    newMaze[newY][newX].isPlayer = true;
    setMaze(newMaze);
    setPlayerPos({ x: newX, y: newY });
    
    // Verificar si hay un problema en esta celda
    if (cell.problem && !cell.isAnswered) {
      const problem = generateProblem();
      problem.question = cell.problem;
      problem.correctAnswer = cell.correctAnswer!;
      setCurrentProblem(problem);
      setShowProblem(true);
    }
    
    // Verificar si llegó al objetivo
    if (cell.isGoal) {
      winGame();
    }
  };

  const handleProblemAnswer = (answer: number) => {
    if (!currentProblem) return;
    
    const isCorrect = answer === currentProblem.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 20);
      setProblemsCompleted(problemsCompleted + 1);
      setCollectedTreasures(collectedTreasures + 1);
      toast.success(`¡Correcto! ${currentProblem.question.replace('?', answer.toString())}`);
      
      // Marcar problema como respondido
      const newMaze = [...maze];
      newMaze[playerPos.y][playerPos.x].isAnswered = true;
      setMaze(newMaze);
    } else {
      toast.error(`¡Ups! La respuesta correcta era ${currentProblem.correctAnswer}`);
    }
    
    setShowProblem(false);
    setCurrentProblem(null);
  };

  const winGame = () => {
    setGameActive(false);
    const bonus = Math.max(0, timeLeft * 2);
    const finalScore = score + bonus;
    setScore(finalScore);
    
    const stars = finalScore >= 200 ? 3 : finalScore >= 120 ? 2 : finalScore >= 60 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Laberinto completado! Puntuación final: ${finalScore} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const endGame = () => {
    setGameActive(false);
    const stars = score >= 150 ? 3 : score >= 90 ? 2 : score >= 45 ? 1 : 0;
    
    setTimeout(() => {
      toast.success(`¡Tiempo agotado! Puntuación: ${score} - Estrellas: ${stars}/3`);
    }, 500);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(120);
    setGameActive(true);
    setProblemsCompleted(0);
    setCollectedTreasures(0);
    setShowProblem(false);
    setCurrentProblem(null);
    generateMaze();
  };

  const getStars = () => {
    if (score >= 200) return 3;
    if (score >= 120) return 2;
    if (score >= 60) return 1;
    return 0;
  };

  if (!gameActive) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green/20 via-blue/10 to-purple/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-green/30 bg-white/95">
          <Trophy className="w-16 h-16 text-green mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-fredoka text-green mb-2">
              {score >= 200 ? '¡Explorador Maestro!' : '¡Buen Intento!'}
            </h2>
            <p className="text-lg text-muted-foreground">
              Tesoros encontrados: {collectedTreasures}
            </p>
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
              className="w-full bg-gradient-to-r from-green to-blue hover:from-green/90 hover:to-blue/90 font-bold py-3"
            >
              🗺️ Explorar Otra Vez
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-green text-green hover:bg-green/10"
            >
              🏠 Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green/20 via-blue/10 to-purple/20 relative overflow-hidden">
      {/* Header con stats */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-green hover:bg-green/20"
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
            <span className="text-lg">🗺️</span>
            <span className="font-bold text-green">{score}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <span className="text-lg">💎</span>
            <span className="font-bold text-purple">{collectedTreasures}</span>
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Laberinto */}
        <Card className="p-6 border-2 border-green/30 bg-white/95 shadow-xl mb-4">
          <div className="grid grid-cols-8 gap-1 w-80 h-80">
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`
                    w-9 h-9 border border-gray-200 flex items-center justify-center text-lg relative
                    ${cell.isWall ? 'bg-gray-800' : 'bg-white'}
                    ${cell.isPlayer ? 'bg-blue/20' : ''}
                    ${cell.isGoal ? 'bg-green/20' : ''}
                    ${cell.problem && !cell.isAnswered ? 'bg-yellow/20' : ''}
                    ${cell.isAnswered ? 'bg-green/30' : ''}
                  `}
                >
                  {cell.isPlayer && '🧭'}
                  {cell.isGoal && '🏆'}
                  {cell.problem && !cell.isAnswered && '❓'}
                  {cell.isAnswered && '✅'}
                  {cell.isWall && '🧱'}
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground mb-4">
          Usa las flechas del teclado para moverte. Resuelve los problemas (❓) para ganar puntos.
        </div>

        {/* Modal de problema */}
        {showProblem && currentProblem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-fredoka text-green mb-4">
                  {currentProblem.question}
                </h3>
                <p className="text-muted-foreground">
                  ¡Resuelve para continuar explorando!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentProblem.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleProblemAnswer(option)}
                    className="h-12 text-xl font-bold bg-gradient-to-r from-green to-blue hover:from-green/90 hover:to-blue/90"
                    variant="outline"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}