import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { CreateUserDto } from './dto';
import { instanceToPlain } from 'class-transformer';
import { UserAuthDto } from './dto/user-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createCatDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(createCatDto);
      return createdUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async authentication({
    email,
    password,
  }: UserAuthDto): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    if (!(await bcrypt.compare(password, user.password))) return;

    return user.toObject();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        email,
      });
      return user.toObject();
    } catch (error) {
      throw error;
    }
  }
}
