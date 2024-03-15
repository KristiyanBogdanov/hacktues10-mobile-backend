import { PickType } from '@nestjs/swagger';
import { Material } from '../schema';
import { Exclude } from 'class-transformer';

@Exclude()
export class MaterialDto extends PickType(Material, [
    'id',
    'title',
    'description',
    'createdAt',
    'audioUrl',
    'text',
    'summary',
    'plan'
]) { }