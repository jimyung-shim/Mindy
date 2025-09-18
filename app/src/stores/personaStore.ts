import { create } from 'zustand';

export type DialogueStyle = 'empathy' | 'solution';

export type ChatAtmosphere = 'calm' | 'bright';

export type CounselingStyle = 'questioning' | 'listening';

export type PersonaState = {
  personaKey?: string;
  personaLabel?: string;
  imageUrl?: string;
  reason?: string;
  dialogueStyle?: DialogueStyle;
  chatAtmosphere?: ChatAtmosphere;
  counselingStyle?: CounselingStyle;

  setPersona: (p: { personaKey: string; personaLabel: string; imageUrl?: string; reason?: string }) => void;
  clearPersona: () => void;
  setDialogueStyle: (style: DialogueStyle) => void;
  setChatAtmosphere: (style: ChatAtmosphere) => void;
  setCounselingStyle: (style: CounselingStyle) => void;
};

export const usePersona = create<PersonaState>((set) => ({
  personaKey: undefined,
  personaLabel: undefined,
  imageUrl: undefined,
  reason: undefined,
  dialogueStyle: undefined,
  chatAtmosphere: undefined,
  counselingStyle: undefined,

  setPersona: (p) => set(p),
  clearPersona: () => set({
    personaKey: undefined,
    personaLabel: undefined,
    imageUrl: undefined,
    reason: undefined,
    dialogueStyle: undefined,
    chatAtmosphere: undefined,
    counselingStyle: undefined,
  }),
  setDialogueStyle: (style) => set({ dialogueStyle: style }),
  setChatAtmosphere: (style) => set({ chatAtmosphere: style }),
  setCounselingStyle: (style) => set({ counselingStyle: style }),
}));
