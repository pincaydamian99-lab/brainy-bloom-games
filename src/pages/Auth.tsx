import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AuthForm {
  email: string;
  password: string;
  fullName?: string;
  schoolName?: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthForm>();

  const onSubmit = async (data: AuthForm) => {
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          toast.error('Error al iniciar sesión: ' + (error.message || 'Credenciales incorrectas'));
        } else {
          toast.success('¡Bienvenido/a de vuelta!');
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(data.email, data.password, data.fullName!, data.schoolName);
        if (error) {
          toast.error('Error al registrarse: ' + (error.message || 'Ya existe una cuenta con este email'));
        } else {
          toast.success('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
          setIsLogin(true);
          reset();
        }
      }
    } catch (error) {
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center p-4">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-secondary/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-accent/30 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 bg-pink/30 rounded-full animate-pulse delay-300"></div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <GraduationCap className="w-16 h-16 text-primary animate-pulse" />
              <Sparkles className="w-6 h-6 text-secondary absolute -top-1 -right-1 animate-spin" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-fredoka text-primary flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6" />
              Matemáticas Divertidas
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              {isLogin ? 'Acceso para Docentes' : 'Registro de Nuevo Docente'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-medium">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName', { 
                      required: !isLogin ? 'El nombre es requerido' : false 
                    })}
                    placeholder="Ej: María González"
                    className="border-primary/20 focus:border-primary"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName" className="font-medium">Nombre de la Escuela</Label>
                  <Input
                    id="schoolName"
                    {...register('schoolName')}
                    placeholder="Ej: Escuela Primaria Benito Juárez"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido'
                  }
                })}
                placeholder="profesor@escuela.edu.mx"
                className="border-primary/20 focus:border-primary"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres'
                  }
                })}
                placeholder="••••••••"
                className="border-primary/20 focus:border-primary"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-bold py-3 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? 'Procesando...' : (isLogin ? '🚀 Iniciar Sesión' : '✨ Registrarse')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </p>
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-primary font-bold hover:text-primary/80"
            >
              {isLogin ? 'Registrarse aquí' : 'Iniciar sesión aquí'}
            </Button>
          </div>

          {isLogin && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground text-center">
                💡 <strong>Tip:</strong> Usa esta plataforma para gestionar el progreso de tus estudiantes en matemáticas de forma divertida e interactiva.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}