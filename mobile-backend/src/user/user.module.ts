import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository';
import { AzureModule } from '../azure/azure.module';
import { FileReaderApi, OpenAIApi, WhisperApi } from '../shared/api';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),
        HttpModule,
        AzureModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        WhisperApi,
        OpenAIApi,
        FileReaderApi
    ],
    exports: [
        UserService,
        UserRepository
    ]
})
export class UserModule { }