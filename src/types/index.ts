export interface BreathPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  benefits?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'any';
  category?: string;
  instructions?: string;
}

export type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export interface BreathSettings {
  pattern: BreathPattern;
  cycles: number;
  guidanceVolume: number;
  backgroundVolume: number;
  useVoiceGuidance: boolean;
  useVisualCues: boolean;
  useAudioCues: boolean;
}