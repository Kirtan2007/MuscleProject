import { supabase } from './supabaseClient';

// --- ROUTINES ---

export const fetchUserRoutines = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('user_routines')
    .select('day_id, exercises')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading routines:', error);
    return null;
  }

  return data.reduce((acc, row) => {
    acc[row.day_id] = row.exercises;
    return acc;
  }, {});
};

export const saveUserRoutineDay = async (userId, dayId, exercises) => {
  if (!userId) return;
  const { error } = await supabase
    .from('user_routines')
    .upsert(
      {
        user_id: userId,
        day_id: dayId,
        exercises,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, day_id' }
    );

  if (error) console.error(`Error saving routine for ${dayId}:`, error);
};

// --- WORKOUT HISTORY ---

export const fetchUserHistory = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('workout_history')
    .select('id, workout_data, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching workout history:', error);
    return [];
  }

  return data.map((entry) => ({
    ...entry.workout_data,
    id: entry.id,
    timestamp: entry.completed_at,
  }));
};

export const logCompletedWorkout = async (userId, workoutData) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('workout_history')
    .insert([
      {
        user_id: userId,
        workout_data: workoutData,
        completed_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error logging workout:', error);
    return null;
  }

  return data;
};