import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

export class User extends OmitType(UserEntity, ['password']) {}
