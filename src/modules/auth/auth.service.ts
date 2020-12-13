import { Card } from './../../models/cards.entity';
import { Injectable, UnauthorizedException, Inject , ValidationError} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';

import { ServerMessages } from './../../utils/serverMessages.util';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
    @Inject('CardRepository') private readonly cardRepository: typeof Card,
  ) {}

  async validateUserByPassword(loginAttempt: LoginUserDto) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !loginAttempt.password ||
      !loginAttempt.email
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    } else if (loginAttempt.password.length < 8) {
      return new ServerMessages(
        true,
        'La contraseña debe contener al menos 8 caracteres.',
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
      /* attributes: { exclude: ['password','deleted'] }, */
      where: { email: loginAttempt.email , deleted : false, active : true },
      include: [{
        model: Direction,
        as : "directions"
      }],
    });

    return new Promise(async (resolve, reject) => {
      let response: any;
      if (userToAttempt == null) {
        resolve(
          new ServerMessages(true, 'Usuario y/ó contraseña inválidos', {}),
        );
      } else {
        // Check the supplied password against the hash stored for this email
        let checPass = await userToAttempt.validPassword(loginAttempt.password);
        if (checPass) {
          // If there is a successful match, generate a JWT for the user
          response = this.createJwtPayload(userToAttempt.email);
          response.user = userToAttempt;
          //Save the last login
          userToAttempt.lastLogin = new Date();

          resolve(new ServerMessages(false, 'Inicio Exitoso', response));
        } else {
          resolve(
            new ServerMessages(
              true,
              'Usuario y/ó contraseña inválidos',
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
    let tempDataUser = new User();

    let userToAttempt: User = await this.userRepository.findOne<User>({
      /* attributes: { exclude: ['password','deleted'] }, */
      where: { 
        email: payload.email , 
        deleted : false, 
        active : true 
      },
    });

    if (userToAttempt) {
      // If there is a successful match, generate a JWT for the user
      //let token = this.createJwtPayload(user.email);
      //return  new ServerMessages(false , "Inicio Exitoso", response ) ;

      return {
        idUser : userToAttempt.idUser,
        name : userToAttempt.name,
        surnames : userToAttempt.surnames,
        email : userToAttempt.email,
        password : userToAttempt.password,
        passwordF : userToAttempt.passwordF,
        birthDay : userToAttempt.birthDay,
        phone : userToAttempt.phone,
        gender : userToAttempt.gender,
        actualPreference : userToAttempt.actualPreference,
        userType : userToAttempt.userType,
        createDate : userToAttempt.createDate,
        lastLogin : userToAttempt.lastLogin,
        businessName : userToAttempt.businessName,
        rfc : userToAttempt.rfc,
        phoneBilling : userToAttempt.phoneBilling,
        emailBilling : userToAttempt.emailBilling,
        state : userToAttempt.state,
        city : userToAttempt.city,
        postalCode : userToAttempt.postalCode,
        colony : userToAttempt.colony,
        street : userToAttempt.street,
        number : userToAttempt.number,
        deleted : userToAttempt.deleted,
        active : userToAttempt.active,
        conektaClientId : userToAttempt.conektaClientId,
        userFacebookImage : userToAttempt.userFacebookImage,
        cards : await this.cardRepository.findAll({
          where : {
            idUser : userToAttempt.idUser,
            deleted : false, 
          }
        }),
        directions : await this.directionRepository.findAll({
          where : {
            idUser : userToAttempt.idUser,
            deleted : false, 
          }
        }),
        /* products : await this.directionRepository.findAll({
          where : {
            idUser : userToAttempt.idUser,
            deleted : false, 
          }
        }), */
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  createJwtPayload(email) {
    let data: JwtPayload = {
      email: email,
    };
    let jwt = this.jwtService.sign(data);
    return {
      expiresIn: 60 * 60 * 24 * 365, //Token de un año de vida para evitar guardar datos personales en los dispositivos
      token: jwt,
    };
  }
}
