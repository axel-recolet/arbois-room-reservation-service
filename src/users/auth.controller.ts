import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly _usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<undefined> {
    try {
      await this._usersService.signup(createUserDto);
      return undefined;
    } catch (error) {
      throw error;
    }
  }
}
