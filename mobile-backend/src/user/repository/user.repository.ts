import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Document, Model } from 'mongoose';
import { EntityRepository } from '../../database';
import { User } from '../schema';

@Injectable()
export class UserRepository extends EntityRepository<User> {
    constructor(@InjectModel(User.name) userModel: Model<User>) {
        super(userModel);
    }

    async findById(
        entityId: string,
        projection?: Record<string, unknown>,
        options?: Record<string, unknown>
    ): Promise<(User & Document) | null> {
        return await super.findById(entityId, projection, options);
    }

    async findOne(
        filter: Record<string, unknown>,
        projection?: Record<string, unknown>,
        options?: Record<string, unknown>
    ): Promise<(User & Document) | null> {
        return await super.findOne(filter, projection, options);
    }

    async updateRefreshToken(userId: string, refreshToken: string, session?: ClientSession): Promise<number> {
        return await this.updateOne(
            { _id: userId },
            { $set: { refreshToken } },
            { session }
        );
    }
}