import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileReaderApi {
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('FILE_READER_API_URL');
    }
    
    private createApiEndpoint(apiPath: string): string {
        return `${this.baseUrl}/${apiPath}`;
    }

    convertToPlainText(filename: string): string {
        return this.createApiEndpoint(`/${filename}`);
    }
}