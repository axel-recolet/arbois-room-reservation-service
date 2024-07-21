import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  findOneByEmail(email: string) {
    try {
      this.usersRepo.findOneByEmail;
    } catch (error) {
      throw error;
    }
  }

  signUp(createUserDto: CreateUserDto) {
    try {
      return this.usersRepo.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async signIn(username: string, pass: string): Promise<any> {}
}
