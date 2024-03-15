import { IsBoolean } from 'class-validator';

export class UpdateQuestionReq {
    @IsBoolean()
    readonly resolved: boolean;
}