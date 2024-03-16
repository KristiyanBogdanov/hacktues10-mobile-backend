import { PickType } from '@nestjs/swagger';
import { Question } from '../schema';
import { Exclude } from 'class-transformer';

@Exclude()
export class QuestionDto extends PickType(Question, [
    'id',
    'text',
    'createdAt',
    'resolved'
]) { }