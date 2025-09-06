import type { PersonaKey } from './persona.types';
import { personaLabelKorean } from './persona.types';

export const fileNameByKey: Record<PersonaKey, string> = {
  ECONOMY: 'economy.png',
  JOB: 'job.png',
  RELATION: 'relation.png',
  BODY: 'body.png',
  FAMILY: 'family.png',
  'ECONOMY+JOB': 'economy_job.png',
  'ECONOMY+RELATION': 'economy_relation.png',
  'ECONOMY+BODY': 'economy_body.png',
  'ECONOMY+FAMILY': 'economy_family.png',
  'JOB+RELATION': 'job_relation.png',
  'JOB+BODY': 'job_body.png',
  'JOB+FAMILY': 'job_family.png',
  'RELATION+BODY': 'relation_body.png',
  'RELATION+FAMILY': 'relation_family.png',
  'BODY+FAMILY': 'body_family.png',
};

export function imageUrlFor(key: PersonaKey): string {
  const base =
    process.env.MCP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
  return `${base.replace(/\/$/, '')}/static/persona/${fileNameByKey[key]}`;
}

export function labelFor(key: PersonaKey): string {
  return personaLabelKorean[key];
}
