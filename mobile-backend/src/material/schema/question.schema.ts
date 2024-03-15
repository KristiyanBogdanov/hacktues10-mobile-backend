import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { IQuestion } from '../interface';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
@Schema({
    versionKey: false,
})
export class Question implements IQuestion {
    private _id: Types.ObjectId;

    @Expose()
    id: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @Prop({ required: true })
    text: string;

    @Expose()
    @Prop({ required: true })
    createdAt: Date;

    @Expose()
    @Prop({ required: true })
    resolved: boolean;

    constructor(question: Partial<Question>) {
        Object.assign(this, question);
        this._id = new Types.ObjectId();
        this.id = this._id.toHexString();
        this.createdAt = new Date();
        this.resolved = false;
    }
}