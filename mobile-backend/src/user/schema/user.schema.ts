import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IsEmail, IsStrongPassword, Length } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { STRONG_PASSWORD_OPTIONS, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../../shared/constants';
import { IUser } from '../interface';
import { Material } from '../../material/schema';

@Exclude()
@Schema({
    collection: 'users',
    versionKey: false
})
export class User implements IUser {
    @Expose()
    id: string;

    @Expose()
    @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
    @Prop({ required: true })
    username: string;

    @Expose()
    @IsEmail()
    @Prop({
        index: {
            name: 'emailIndex',
            unique: true
        },
        required: true 
    })
    email: string;

    @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
    @Prop({ required: true })
    password: string;

    @Expose()
    @Prop()
    refreshToken: string;

    @Expose()
    @Type(() => Material)
    @Prop({
        type: [Material],
        default: []
    })
    materials: Material[];

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);