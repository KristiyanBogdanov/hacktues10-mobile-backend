import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIApi {
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('OPENAI_API_URL');
    }
    
    private createApiEndpoint(apiPath: string): string {
        return `${this.baseUrl}/${apiPath}`;
    }

    summarizeText(): string {
        return this.createApiEndpoint(`summarize`);
    }

    createPlan(): string {
        return this.createApiEndpoint(`plan`);
    }
}