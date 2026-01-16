/**
 * Type definitions for provider outputs and performance utilities
 */

// Type definitions for provider outputs
interface MediaOutput {
  currentSession?: {
    sessionId?: string;
    isPlaying?: boolean;
  };
}

interface CpuOutput {
  usage?: number;
}

interface MemoryOutput {
  usage?: number;
}

interface AudioOutput {
  defaultPlaybackDevice?: {
    volume?: number;
  };
}

interface DateOutput {
  formatted?: string;
}

interface KomorebiOutput {
  focusedWorkspace?: {
    name?: string;
  };
}

export interface ProviderOutput {
  media?: MediaOutput | null;
  cpu?: CpuOutput | null;
  memory?: MemoryOutput | null;
  audio?: AudioOutput | null;
  date?: DateOutput | null;
  komorebi?: KomorebiOutput | null;
}

export type PartialProviderOutput = Partial<ProviderOutput>;