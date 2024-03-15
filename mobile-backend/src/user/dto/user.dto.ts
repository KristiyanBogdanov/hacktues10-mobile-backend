import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../schema';

@Exclude()
export class UserDto extends PickType(User, [
    'id',
    'username',
    'email',
    'materials'
]) { }