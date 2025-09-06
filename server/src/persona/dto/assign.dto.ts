import { IsArray, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';
import { CATEGORY_KEYS, type CategoryKey } from '../persona.types';

export class AssignPersonaDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsIn(CATEGORY_KEYS, { each: true })
  categories!: CategoryKey[];
}
