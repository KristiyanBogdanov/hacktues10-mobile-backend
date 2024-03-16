import { IsStrongPasswordOptions } from 'class-validator';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const STRONG_PASSWORD_OPTIONS: IsStrongPasswordOptions = {
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 0
};
export const PASSWORD_MAX_LENGTH = 128;

export const MATERIAL_TITLE_MIN_LENGTH = 3;
export const MATERIAL_TITLE_MAX_LENGTH = 50;

export const MATERIALS_PAGINATION_LIMIT = 20;