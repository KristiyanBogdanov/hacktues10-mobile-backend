import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhisperApi {
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('WHISPER_API_URL');
    }
    
    private createApiEndpoint(apiPath: string): string {
        return `${this.baseUrl}/${apiPath}`;
    }

    generateTextFromSpeech(): string {
        return this.createApiEndpoint(`stt`);
    }
}