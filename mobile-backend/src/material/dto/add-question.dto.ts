import { PickType } from '@nestjs/swagger';
import { Question } from '../schema';

export class AddQuestionReq extends PickType(Question, [
    'text',
]) {
    readonly text: Question['text'];
}