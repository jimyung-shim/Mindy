import { z } from 'zod';
import type { McpToolProvider } from '../../mcp/mcp.types';
import { PersonaService } from '../persona.service';
import type { CategoryKey } from '../persona.types';

const CATEGORY_ENUM = z.enum([
  'RELATION_BULLYING',
  'SELF_PERSONALITY',
  'MENTAL_HEALTH',
  'FAMILY',
  'WORKPLACE',
  'PARENTING',
  'CAREER',
  'ROMANCE',
  'BREAKUP_DIVORCE',
  'STUDY',
  'MARRIAGE',
  'LGBT',
  'PHYSICAL_HEALTH',
  'SEX_CRIME',
  'APPEARANCE',
  'SEX_LIFE',
  'FINANCE_BUSINESS',
  'PET_LOSS',
] as const);

export const assignPersonaSchema = z
  .object({
    categories: z.array(CATEGORY_ENUM).min(1).max(4),
  })
  .describe('Assign persona from up to 4 categories');

type AssignInput = z.infer<typeof assignPersonaSchema>; // { categories: readonly CategoryKey[] }

export function createAssignPersonaTool(
  persona: PersonaService,
): McpToolProvider<AssignInput> {
  return {
    name: 'assign_persona',
    description:
      '선택된 카테고리(최대 4개)로 15종 중 하나의 페르소나를 배정합니다.',
    inputSchema: assignPersonaSchema,
    run: (input) => {
      const categories = input.categories as ReadonlyArray<CategoryKey>;
      const r = persona.assign(categories as CategoryKey[]);
      const payload = {
        ...r,
        imageUrl: `https://placehold.co/256x256?text=${encodeURIComponent(r.personaLabel)}`,
      };
      return Promise.resolve(payload);
    },
  };
}
