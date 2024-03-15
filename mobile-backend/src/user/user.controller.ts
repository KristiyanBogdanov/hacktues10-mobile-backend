import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthNotRequired } from '../shared/decorator';
import { ValidateMongoId } from '../shared/pipe';
import { JwtPayload } from '../auth/type';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { AddMaterialReq, AddQuestionReq, MaterialDto, QuestionDto, UpdateQuestionReq } from '../material/dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async fetchData(@Req() request: Request): Promise<UserDto> {
        const payload = request.user as JwtPayload;
        return await this.userService.fetchData(payload.id);
    }

    @Get('/materials')
    async fetchMaterials(@Req() request: Request): Promise<MaterialDto[]> {
        const payload = request.user as JwtPayload;
        return await this.userService.fetchMaterials(payload.id);
    }

    @UseInterceptors(FilesInterceptor('files'))
    @Post('/materials/mp3')
    async createMaterialFromMP3(@Req() request: Request, @UploadedFiles() files: Express.Multer.File[], @Body() materialData: AddMaterialReq): Promise<MaterialDto> {
        const payload = request.user as JwtPayload;
        return await this.userService.createMaterialFromMP3(payload.id, files[0], materialData);
    }

    @Post('/materials/text')
    async createMaterialFromText(@Req() request: Request, @UploadedFiles() textFile: Express.Multer.File, @Body() materialData: AddMaterialReq): Promise<MaterialDto> {
        const payload = request.user as JwtPayload;
        return await this.userService.createMaterialFromText(payload.id, textFile, materialData);
    }

    @Post('/materials/:materialId/questions')
    async addQuestion(@Req() request: Request, @Param('materialId', ValidateMongoId) materialId: string, @Body() questionData: AddQuestionReq): Promise<QuestionDto> {
        const payload = request.user as JwtPayload;
        return await this.userService.addQuestion(payload.id, materialId, questionData);
    }

    @Patch('/materials/:materialId/questions/:questionId')
    async updateQuestion(
        @Req() request: Request, 
        @Param('materialId', ValidateMongoId) materialId: string, 
        @Param('questionId', ValidateMongoId) questionId: string, 
        @Body() updateData: UpdateQuestionReq
    ): Promise<QuestionDto> {
        const payload = request.user as JwtPayload;
        return await this.userService.updateQuestion(payload.id, materialId, questionId, updateData);
    }
}