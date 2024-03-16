import { PickType } from '@nestjs/swagger';
import { User } from '../../user/schema';

export class SignUpReq extends PickType(User, [
    'username',
    'email',
    'password',
]) {
    readonly username: User['username'];
    readonly email: User['email'];
    readonly password: User['password'];
}