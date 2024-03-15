import { IMaterial } from '../../material/interface';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    materials: IMaterial[];
}