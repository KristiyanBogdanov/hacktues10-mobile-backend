import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose, Type } from 'class-transformer';
import { IMaterial } from '../interface';
import { Question } from './question.schema';

@Exclude()
@Schema({
    versionKey: false,
})
export class Material implements IMaterial {
    @Expose()
    id: string;

    @Expose()
    @Prop()
    title: string;

    @Expose()
    @Prop({ required: true })
    description: string;

    @Expose()
    @Prop({ required: true })
    createdAt: Date;

    @Expose()
    @Prop({ required: true })
    audioUrl: string

    @Expose()
    @Prop({ required: true })
    text: string;

    @Expose()
    @Prop()
    summary: string;

    @Expose()
    @Prop()
    plan: string;

    @Expose()
    @Prop({ type: [String], default: [] })
    tags: string[];

    @Expose()
    @Type(() => Question)
    @Prop({
        type: [Question],
        default: []
    })
    questions: Question[];

    constructor(material: Partial<Material>) {
        Object.assign(this, material);
        this.createdAt = new Date();
    }
}