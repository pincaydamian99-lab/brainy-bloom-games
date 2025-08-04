import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface GameProgressData {
  game_name: string;
  best_score: number;
  stars_earned: number;
  total_attempts: number;
  completed_at?: string;
}

export function useGameProgress() {
  const { user } = useAuth();
  const [gameProgress, setGameProgress] = useState<GameProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('student_id', user.id);

      if (error) throw error;
      setGameProgress(data || []);
    } catch (error) {
      console.error('Error fetching game progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const saveGameProgress = async (
    gameName: string,
    score: number,
    starsEarned: number
  ) => {
    if (!user) return;

    try {
      // Buscar progreso existente
      const { data: existing } = await supabase
        .from('game_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('game_name', gameName)
        .single();

      const gameData = {
        student_id: user.id,
        game_name: gameName,
        best_score: existing ? Math.max(existing.best_score || 0, score) : score,
        stars_earned: existing ? Math.max(existing.stars_earned || 0, starsEarned) : starsEarned,
        total_attempts: existing ? (existing.total_attempts || 0) + 1 : 1,
        completed_at: starsEarned > 0 ? new Date().toISOString() : existing?.completed_at
      };

      const { error } = await supabase
        .from('game_progress')
        .upsert(gameData, { onConflict: 'student_id,game_name' });

      if (error) throw error;

      toast.success(`¡Progreso guardado! Mejor puntuación: ${gameData.best_score}`);
      fetchProgress();
    } catch (error) {
      console.error('Error saving game progress:', error);
      toast.error('Error al guardar el progreso');
    }
  };

  const getGameStats = (gameName: string) => {
    const game = gameProgress.find(g => g.game_name === gameName);
    return {
      bestScore: game?.best_score || 0,
      starsEarned: game?.stars_earned || 0,
      totalAttempts: game?.total_attempts || 0,
      isCompleted: (game?.stars_earned || 0) > 0
    };
  };

  return {
    gameProgress,
    loading,
    saveGameProgress,
    getGameStats,
    refreshProgress: fetchProgress
  };
}