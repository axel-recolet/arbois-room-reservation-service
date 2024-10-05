import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.entity';
import { CreateUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { User } from './user';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = await this.userModel.create(createUserDto);
      return createdUser.toObject();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email === 1) {
        throw new BadRequestException('This email already exits.');
      }
      throw error;
    }
  }

  async authentication(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const userEntity = await this.userModel.findOne({ email });
    if (!userEntity) return;

    const isCorrectPwd = await bcrypt.compare(password, userEntity.password);
    if (!isCorrectPwd) return;

    return userEntity.toObject();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({
        email,
      });
      return user?.toObject();
    } catch (error) {
      throw error;
    }
  }
}
