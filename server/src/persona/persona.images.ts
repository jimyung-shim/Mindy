import type { PersonaKey } from './persona.types';
import { personaLabelKorean } from './persona.types';

export const fileNameByKey: Record<PersonaKey, string> = {
  HEALTH: 'health.png',
  RELATIONSHIP: 'relationship.png',
  ECONOMY_JOB: 'economy_job.png',
  LIFE: 'life.png',
  CBT: 'cbt.png',
};

export function imageUrlFor(key: PersonaKey): string {
  const base =
    process.env.MCP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
  return `${base.replace(/\/$/, '')}/static/persona/${fileNameByKey[key]}`;
}

export function labelFor(key: PersonaKey): string {
  return personaLabelKorean[key];
}
