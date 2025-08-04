import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import shapesGameImage from "@/assets/shapes-game.jpg";

interface Shape {
  id: string;
  type: "circle" | "square" | "triangle" | "rectangle";
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  targetImage: string;
  emoji: string;
  requiredShapes: Array<{
    type: "circle" | "square" | "triangle" | "rectangle";
    color: string;
    minCount: number;
  }>;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Construye una Casa",
    description: "Usa un cuadrado para la casa y un triángulo para el techo",
    targetImage: "🏠",
    emoji: "🏠",
    requiredShapes: [
      { type: "square", color: "#60A5FA", minCount: 1 },
      { type: "triangle", color: "#EF4444", minCount: 1 }
    ]
  },
  {
    id: 2,
    title: "Crea un Gato",
    description: "Combina círculos y triángulos para hacer un gatito",
    targetImage: "🐱",
    emoji: "🐱",
    requiredShapes: [
      { type: "circle", color: "#F97316", minCount: 1 },
      { type: "triangle", color: "#F97316", minCount: 2 }
    ]
  },
  {
    id: 3,
    title: "Haz un Robot",
    description: "Usa rectángulos y círculos para construir un robot",
    targetImage: "🤖",
    emoji: "🤖",
    requiredShapes: [
      { type: "rectangle", color: "#6B7280", minCount: 2 },
      { type: "circle", color: "#10B981", minCount: 2 }
    ]
  }
];

const availableShapes = [
  { type: "circle" as const, color: "#EF4444", name: "Círculo Rojo" },
  { type: "circle" as const, color: "#F97316", name: "Círculo Naranja" },
  { type: "circle" as const, color: "#10B981", name: "Círculo Verde" },
  { type: "square" as const, color: "#60A5FA", name: "Cuadrado Azul" },
  { type: "square" as const, color: "#8B5CF6", name: "Cuadrado Morado" },
  { type: "triangle" as const, color: "#EF4444", name: "Triángulo Rojo" },
  { type: "triangle" as const, color: "#F97316", name: "Triángulo Naranja" },
  { type: "rectangle" as const, color: "#6B7280", name: "Rectángulo Gris" },
  { type: "rectangle" as const, color: "#F59E0B", name: "Rectángulo Amarillo" }
];

export default function ConstructorFiguras() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [placedShapes, setPlacedShapes] = useState<Shape[]>([]);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addShape = (shapeType: typeof availableShapes[0]) => {
    const newShape: Shape = {
      id: `${shapeType.type}-${Date.now()}`,
      type: shapeType.type,
      color: shapeType.color,
      size: 60,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      rotation: 0
    };
    
    setPlacedShapes(prev => [...prev, newShape]);
    toast(`✨ ¡${shapeType.name} agregado!`, { duration: 1000 });
  };

  const handleDragStart = (e: React.DragEvent, shapeId: string) => {
    setDraggedShape(shapeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedShape || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedShapes(prev => 
      prev.map(shape => 
        shape.id === draggedShape 
          ? { ...shape, x: Math.max(0, Math.min(x - 30, rect.width - 60)), y: Math.max(0, Math.min(y - 30, rect.height - 60)) }
          : shape
      )
    );
    setDraggedShape(null);
  };

  const rotateShape = (shapeId: string) => {
    setPlacedShapes(prev => 
      prev.map(shape => 
        shape.id === shapeId 
          ? { ...shape, rotation: (shape.rotation + 45) % 360 }
          : shape
      )
    );
  };

  const removeShape = (shapeId: string) => {
    setPlacedShapes(prev => prev.filter(shape => shape.id !== shapeId));
    toast("🗑️ Forma eliminada", { duration: 1000 });
  };

  const clearCanvas = () => {
    setPlacedShapes([]);
    toast("🧹 ¡Lienzo limpio!", { duration: 1000 });
  };

  const checkCompletion = () => {
    const challenge = challenges[currentChallenge];
    const shapeCount: Record<string, number> = {};
    
    placedShapes.forEach(shape => {
      const key = `${shape.type}-${shape.color}`;
      shapeCount[key] = (shapeCount[key] || 0) + 1;
    });

    let allRequirementsMet = true;
    for (const req of challenge.requiredShapes) {
      const key = `${req.type}-${req.color}`;
      if ((shapeCount[key] || 0) < req.minCount) {
        allRequirementsMet = false;
        break;
      }
    }

    if (allRequirementsMet && placedShapes.length > 0) {
      const newScore = score + 100;
      setScore(newScore);
      setCompletedChallenges(prev => [...prev, challenge.id]);
      
      toast(`🎉 ¡${challenge.title} completado!`, {
        description: `¡Excelente trabajo! +100 puntos`,
        duration: 3000,
      });

      // Avanzar al siguiente desafío
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallenge(prev => prev + 1);
          setPlacedShapes([]);
          toast(`🚀 ¡Nuevo desafío desbloqueado!`, { duration: 2000 });
        }, 2000);
      } else {
        toast(`🏆 ¡Felicidades! ¡Completaste todos los desafíos!`, {
          description: `Puntuación final: ${newScore}`,
          duration: 5000,
        });
      }
    } else {
      toast("🤔 ¡Sigue intentando! Revisa los requisitos del desafío", {
        duration: 2000,
      });
    }
  };

  const renderShape = (shape: Shape) => {
    const baseStyle = {
      position: "absolute" as const,
      left: shape.x,
      top: shape.y,
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.color,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: "move",
      border: "2px solid rgba(255,255,255,0.3)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    };

    const shapeElement = (() => {
      switch (shape.type) {
        case "circle":
          return (
            <div
              style={{ ...baseStyle, borderRadius: "50%" }}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id)}
              onClick={() => rotateShape(shape.id)}
              onDoubleClick={() => removeShape(shape.id)}
              title="Clic para rotar, doble clic para eliminar"
            />
          );
        case "square":
          return (
            <div
              style={{ ...baseStyle, borderRadius: "8px" }}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id)}
              onClick={() => rotateShape(shape.id)}
              onDoubleClick={() => removeShape(shape.id)}
              title="Clic para rotar, doble clic para eliminar"
            />
          );
        case "triangle":
          return (
            <div
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderLeft: `${shape.size/2}px solid transparent`,
                borderRight: `${shape.size/2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
                borderRadius: "4px"
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id)}
              onClick={() => rotateShape(shape.id)}
              onDoubleClick={() => removeShape(shape.id)}
              title="Clic para rotar, doble clic para eliminar"
            />
          );
        case "rectangle":
          return (
            <div
              style={{ 
                ...baseStyle, 
                width: shape.size * 1.5, 
                height: shape.size * 0.7,
                borderRadius: "8px" 
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id)}
              onClick={() => rotateShape(shape.id)}
              onDoubleClick={() => removeShape(shape.id)}
              title="Clic para rotar, doble clic para eliminar"
            />
          );
        default:
          return null;
      }
    })();

    return <div key={shape.id}>{shapeElement}</div>;
  };

  const challenge = challenges[currentChallenge];

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/20 via-secondary/10 to-purple/20 p-4">
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
        
        <h1 className="text-2xl font-bold rainbow-text">🔷 Constructor de Figuras</h1>
        
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-secondary" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral - Formas disponibles */}
        <Card className="lg:col-span-1 p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            🎨 Caja de Herramientas
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {availableShapes.map((shape, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform"
                onClick={() => addShape(shape)}
              >
                <div
                  className="w-6 h-6 rounded-sm"
                  style={{ 
                    backgroundColor: shape.color,
                    borderRadius: shape.type === "circle" ? "50%" : "4px",
                    clipPath: shape.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none"
                  }}
                />
                <span className="text-xs">{shape.type === "circle" ? "●" : 
                                          shape.type === "square" ? "■" : 
                                          shape.type === "triangle" ? "▲" : "▬"}</span>
              </Button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar Todo
            </Button>
            
            <Button
              onClick={checkCompletion}
              className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-bold flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              ¡Verificar!
            </Button>
          </div>
        </Card>

        {/* Área principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Desafío actual */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {challenge.emoji} {challenge.title}
                </h2>
                <p className="text-muted-foreground">{challenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Desafío</div>
                <div className="text-2xl font-bold">{currentChallenge + 1}/{challenges.length}</div>
              </div>
            </div>

            {/* Requisitos */}
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-secondary" />
                <span className="font-medium">Formas necesarias:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.requiredShapes.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 px-2 py-1 bg-background rounded-lg text-sm">
                    <div
                      className="w-4 h-4"
                      style={{ 
                        backgroundColor: req.color,
                        borderRadius: req.type === "circle" ? "50%" : "2px",
                        clipPath: req.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none"
                      }}
                    />
                    <span>{req.minCount}x {req.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Canvas de construcción */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">🎯 Área de Construcción</h3>
              <div className="text-sm text-muted-foreground">
                Arrastra las formas • Clic para rotar • Doble clic para eliminar
              </div>
            </div>
            
            <div
              ref={canvasRef}
              className="relative w-full h-96 bg-gradient-to-br from-background/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {placedShapes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <div>¡Arrastra formas aquí para construir!</div>
                  </div>
                </div>
              )}
              
              {placedShapes.map(renderShape)}
            </div>
          </Card>

          {/* Progreso */}
          <Card className="p-4">
            <h4 className="font-bold mb-3">🏆 Progreso de Desafíos</h4>
            <div className="grid grid-cols-3 gap-2">
              {challenges.map((ch, index) => (
                <div
                  key={ch.id}
                  className={`p-3 rounded-lg text-center transition-all ${
                    completedChallenges.includes(ch.id)
                      ? "bg-success/20 text-success border border-success/30"
                      : index === currentChallenge
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <div className="text-2xl mb-1">{ch.emoji}</div>
                  <div className="text-xs font-medium">{ch.title}</div>
                  {completedChallenges.includes(ch.id) && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}