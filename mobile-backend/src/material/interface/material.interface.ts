import { IQuestion } from './question.interface';

export interface IMaterial {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    audioUrl: string;
    text: string;
    summary: string;
    plan: string;
    tags: string[];
    questions: IQuestion[];
}