import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { ServerMessages } from '../../utils/serverMessages.util';
import { LoginUserDto } from '../user/dto/loginUser.dto';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  // This route will require successfully passing our default auth strategy (JWT) in order
  // to access the route
  @Get('validate-token')
  @UseGuards(AuthGuard())
  testAuthRoute(@Request() req) {
    let user = req.user;
    return new ServerMessages(false, 'Acceso a ruta de prueba correcto', {
      user: user,
    });
  }
}
