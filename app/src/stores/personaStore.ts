import { create } from 'zustand';

export type PersonaState = {
  personaKey?: string;
  personaLabel?: string;
  imageUrl?: string;
  reason?: string;
  setPersona: (p: { personaKey: string; personaLabel: string; imageUrl?: string; reason?: string }) => void;
  clearPersona: () => void;
};

export const usePersona = create<PersonaState>((set) => ({
  personaKey: undefined,
  personaLabel: undefined,
  imageUrl: undefined,
  reason: undefined,
  setPersona: (p) => set(p),
  clearPersona: () => set({ personaKey: undefined, personaLabel: undefined, imageUrl: undefined, reason: undefined }),
}));
