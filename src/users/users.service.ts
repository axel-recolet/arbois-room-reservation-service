import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto';
import { User } from './user';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signup(createUserDto: CreateUserDto) {
    try {
      return this.usersRepo.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.usersRepo.authentication(email, password);
      if (!user) {
        throw new UnauthorizedException();
      }

      const payload = {
        id: user.id,
        email: user.email,
        userName: user.userName,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    try {
      return this.usersRepo.findOneByEmail(email);
    } catch (error) {
      throw error;
    }
  }
}
