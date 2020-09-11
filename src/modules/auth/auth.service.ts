import { Injectable, UnauthorizedException, Inject , ValidationError} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';

import { ServerMessages } from './../../utils/serverMessages.util';
import { User } from '../../models/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('UserRepository') private readonly userRepository: typeof User,
  ) {}

  async validateUserByPassword(loginAttempt: LoginUserDto) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !loginAttempt.password ||
      !loginAttempt.email
    ) {
      return new ServerMessages(true, 'Peticion incompleta', {});
    } else if (loginAttempt.password.length < 8) {
      return new ServerMessages(
        true,
        'La contraseña debe contener almenos 8 caracteres.',
        {},
      );
    } else if ( !re.test(String(loginAttempt.email).toLowerCase()) ) {
      return new ServerMessages(
        true,
        'Email invalido.',
        {},
      );
    }
    // This will be used for the initial login whit email
    let userToAttempt: User = await this.userRepository.findOne<User>({
      where: { email: loginAttempt.email },
    });

    return new Promise(async (resolve, reject) => {
      let response: any;
      if (userToAttempt == null) {
        resolve(
          new ServerMessages(true, 'Usuario y/ó contraseña invalidos', {}),
        );
      } else {
        // Check the supplied password against the hash stored for this username
        let checPass = await userToAttempt.validPassword(loginAttempt.password);
        if (checPass) {
          // If there is a successful match, generate a JWT for the user
          response = this.createJwtPayload(userToAttempt.username);
          response.user = userToAttempt;

          resolve(new ServerMessages(false, 'Inicio Exitoso', response));
        } else {
          resolve(
            new ServerMessages(
              true,
              'Usuario y/ó contraseña invalidos',
              new UnauthorizedException(),
            ),
          );
        }
      }
    });
  }

  //Esta funcion nos ayuda a crear el middleware donde vamos a sacar el usuario segun los token que lleguen
  async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    let user: any;
    user = await this.usersService.findOneByUsername(payload.usuario);

    if (user) {
      // If there is a successful match, generate a JWT for the user
      //let token = this.createJwtPayload(user.email);
      //return  new ServerMessages(false , "Inicio Exitoso", response ) ;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  createJwtPayload(usuario) {
    let data: JwtPayload = {
      usuario: usuario,
    };
    let jwt = this.jwtService.sign(data);
    return {
      expiresIn: 60 * 60 * 24 * 365, //Token de un año de vida para evitar guardar datos personales en los dispositivos
      token: jwt,
    };
  }
}
