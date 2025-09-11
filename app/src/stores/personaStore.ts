import { create } from 'zustand';

export type DialogueStyle = 'empathy' | 'solution';

export type PersonaState = {
  personaKey?: string;
  personaLabel?: string;
  imageUrl?: string;
  reason?: string;
  dialogueStyle?: DialogueStyle;
  setPersona: (p: { personaKey: string; personaLabel: string; imageUrl?: string; reason?: string }) => void;
  clearPersona: () => void;
  setDialogueStyle: (style: DialogueStyle) => void; // [!] 추가: 스타일 설정 액션
};

export const usePersona = create<PersonaState>((set) => ({
  personaKey: undefined,
  personaLabel: undefined,
  imageUrl: undefined,
  reason: undefined,
  dialogueStyle: undefined, // [!] 상태 초기값 설정
  setPersona: (p) => set(p),
  clearPersona: () => set({
    personaKey: undefined,
    personaLabel: undefined,
    imageUrl: undefined,
    reason: undefined,
    dialogueStyle: undefined
  }),
  setDialogueStyle: (style) => set({ dialogueStyle: style }), // [!] 액션 구현

}));
