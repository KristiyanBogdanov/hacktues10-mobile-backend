import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientSession, Document } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { UserRepository } from './repository';
import { User } from './schema';
import { CreatePlanRes, GenerateTextFromSpeechRes, SummarizeTextRes, UserDto } from './dto';
import { AddMaterialReq, AddQuestionReq, MaterialDto, QuestionDto, UpdateQuestionReq } from '../material/dto';
import { WhisperApi, OpenAIApi, FileReaderApi } from '../shared/api';
import { checkCacheDirectoryExistence, createFileContentCache, removeFileContentCache } from '../shared/util/cache.util';
import { Material, Question } from '../material/schema';
import { AzureService } from '../azure/azure.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly whisperApi: WhisperApi,
        private readonly openAIApi: OpenAIApi,
        private readonly fileReaderApi: FileReaderApi,
        private readonly httpService: HttpService,
        private readonly azureService: AzureService
    ) { }

    async create(user: User, session: ClientSession): Promise<User> {
        const emailIsAlreadyUsed = await this.userRepository.findOne({ email: user.email });

        if (emailIsAlreadyUsed) {
            throw new ConflictException();
        }

        return await this.userRepository.createInSession(user, session);
    }

    async mapToUserDto(user: User): Promise<UserDto> {
        const userDto = plainToClass(UserDto, user);

        return userDto;
    }

    async fetchData(userId: string): Promise<UserDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException();
        }

        return this.mapToUserDto(user);
    }

    private async sendRequestToOpenAI(text: string): Promise<[SummarizeTextRes, CreatePlanRes]> {
        return Promise.all([
            lastValueFrom(this.httpService.post<SummarizeTextRes>(
                this.openAIApi.summarizeText(), { text: text })
            ).then((response) => response.data),
            lastValueFrom(this.httpService.post<CreatePlanRes>(
                this.openAIApi.createPlan(), { text: text })
            ).then((response) => response.data)
        ]);
    }

    async createMaterialFromMP3(userId: string, audio: Express.Multer.File, materialData: AddMaterialReq): Promise<MaterialDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException();
        }

        checkCacheDirectoryExistence();

        const filename = `${uuidv4()}.mp3`;
        createFileContentCache(filename, audio.buffer);

        const whisperResult = await lastValueFrom(
            this.httpService.get<GenerateTextFromSpeechRes>(this.whisperApi.generateTextFromSpeech(filename))
        ).then((response) => response.data);


        const [[summary, plan], audioUrl] = await Promise.all([
            this.sendRequestToOpenAI(whisperResult.results[0].transcript),
            this.azureService.uploadFile('audio', audio)
        ]);

        const material = new Material({
            ...materialData,
            audioUrl: audioUrl,
            summary: summary.message,
            plan: plan.message,
            tags: plan.tags,
        });

        user.materials.push(material);
        await user.save();

        removeFileContentCache(filename);

        return plainToClass(MaterialDto, material);
    }

    async createMaterialFromText(userId: string, textFile: Express.Multer.File, materialData: AddMaterialReq): Promise<MaterialDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException();
        }

        const filename = `${uuidv4()}.${textFile.mimetype.split('/')[1]}`;
        createFileContentCache(filename, textFile.buffer);

        const text = await lastValueFrom(
            this.httpService.get<string>(this.fileReaderApi.convertToPlainText(filename))
        ).then((response) => response.data);

        const [summary, plan] = await this.sendRequestToOpenAI(text);

        const material = new Material({
            ...materialData,
            summary: summary.message,
            plan: plan.message,
            tags: plan.tags,
        });

        user.materials.push(material);
        await user.save();

        removeFileContentCache(filename);

        return plainToClass(MaterialDto, material);
    }

    async addQuestion(userId: string, materialId: string, question: AddQuestionReq): Promise<QuestionDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException();
        }

        const material = user.materials.find((material) => material.id === materialId);

        if (!material) {
            throw new NotFoundException();
        }

        const newQuestion = new Question(question);
        material.questions.push(newQuestion);
        await user.save();

        console.log(newQuestion);

        return plainToClass(QuestionDto, newQuestion);
    }

    async updateQuestion(userId: string, materialId: string, questionId: string, updateData: UpdateQuestionReq): Promise<QuestionDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException();
        }

        const material = user.materials.find((material) => material.id === materialId);

        if (!material) {
            throw new NotFoundException();
        }

        const question = material.questions.find((question) => question.id === questionId);

        if (!question) {
            throw new NotFoundException();
        }

        question.resolved = updateData.resolved;
        await user.save();

        return plainToClass(QuestionDto, question);
    }
}