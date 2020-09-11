import { Injectable, Inject } from '@nestjs/common';
// import { USER_REPOSITORY } from '../utils/constants';
//Normalmente se usa para formatear el objeto que recibimos en el request
import { CreateUserDto } from './dto/createUser.dto';
import { validators } from '../../utils/validators.util';
import { ServerMessages } from '../../utils/serverMessages.util';
import { UserClass } from './../../classes/user.class';
import { User } from '../../models/users.entity';
import { UpdatedUserDto } from './dto/updatedUser.dto';
import { NewUserPassword } from './dto/newUserPassword.dto';

@Injectable()
export class UserService {
  constructor(
    //Es una manera de dar de alta el repositorio de la tabla de usuarios
    @Inject('UserRepository')
    private readonly userRepository: typeof User ,
  ) {}

  /* async consultaEjemplo() {
    let response: any = {};
    try {
      response.newband = await this.bandRepository.findAll<Band>({
        attributes: ['band_id', 'name', 'photo', 'base_price', 'reviews', 'score'],
        where: { active: 1 },
        order: [
          ['created_at', 'DESC'],
        ],
        limit: 10,
        include: [{
          model: State,
          attributes: [['name', 'name']],
        }, {
          model: Town,
          attributes: [['name', 'name']],
        }, {
          model: BandSlider,
          attributes: [['url', 'url']],
          limit: 1
        }],
      }).map((band: any) => {
        return Object.assign(
          {
            band_id: band.band_id,
            name: band.name,
            photo: (new String(JSON.stringify(band.sliders[0])))
              .substring(8, new String(
                JSON.stringify(band.sliders[0])).length - 2),
            base_price: band.base_price,
            reviews: band.reviews,
            score: band.score,
            town_name: band.town.name,
            state_name: band.state.name
          })
      });
      return response;
    } catch (error) {
      return error;
    }
  } */

  /* async testUserWithBand(bandId : string) {
    return await this.userRepository.findOne<User>({include: [Band] ,where: {username: bandId}});
    //return await this.bandRepository.findOne<Band>({include: [User] ,where: {band_id: bandId}});
  }
  
  async findOneByEmail(useremail : string): Promise<User> {
    return await this.userRepository.findOne<User>({where: {email: useremail}});
  } */

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      /* attributes: [
        'idUser',
        'name',
        'email',
        'password',
        'username',
        'role',
        'haveImage',
      ], */
      where: { username: username },
    });
  }

  async getAllUsers(): Promise<ServerMessages> {
    try {
      var userList = await this.userRepository.findAll<User>();
      return new ServerMessages(false, 'Lista de usuarios obtenida', userList);
    } catch (error) {
      return new ServerMessages(true, 'Error obteniendo lista de usuarios', {});
    }
  }

  async registerUser(createUser: CreateUserDto): Promise<ServerMessages> {
    if (
      !createUser.name ||
      !createUser.email ||
      createUser.haveImage == undefined ||
      createUser.haveImage == null ||
      !createUser.username ||
      createUser.role ==  undefined ||
      createUser.role == null 
    ) {
      return new ServerMessages(true, 'Peticion incompleta', {});
    } else if (createUser.password.length < 8) {
      return new ServerMessages(
        true,
        'La contraseña debe contener almenos 8 caracteres.',
        {},
      );
    } else if (createUser.username.length < 8) {
      return new ServerMessages(
        true,
        'El nombre de usuario debe contener almenos 8 caracteres.',
        {},
      );
    } else if (createUser.description.length > 999) {
      return new ServerMessages(
        true,
        'Descripcion muy larga maximo de 1000.',
        {},
      );
    }
    //Con esto se evitan incidencias en los nombres
    createUser.username = createUser.username.toLowerCase();
    createUser.email = createUser.email.toLowerCase();

    var user = await this.findOneByUsername(createUser.username);

    var userEmail = await this.userRepository.findOne<User>({
      attributes: ['email'],
      where: { email: createUser.email },
    });

    if (user) {
      return new ServerMessages(
        true,
        'Nombre de usuario actualmente registrado',
        {},
      );
    } else if (userEmail) {
      return new ServerMessages(true, 'Correo actualmente registrado', {});
    } else {
      try {
        var newUser: User = await this.userRepository.create<User>(
          createUser,
          {},
        );
        return new ServerMessages(false, 'Usuario creado con exito', newUser);
      } catch (error) {
        return new ServerMessages(true, 'A ocurrido un error', error);
      }
    }
  }

  async updateUser(updatedUser: UpdatedUserDto): Promise<ServerMessages> {
    if (
      updatedUser.idUser == undefined ||
      updatedUser.idUser == null ||
      !updatedUser.name ||
      !updatedUser.email ||
      updatedUser.haveImage == undefined ||
      updatedUser.haveImage == null ||
      !updatedUser.username ||
      updatedUser.role ==  undefined ||
      updatedUser.role == null 
    ) {
      return new ServerMessages(true, 'Peticion incompleta', {});
    } else if (updatedUser.username.length < 8) {
      return new ServerMessages(
        true,
        'El nombre de usuario debe contener almenos 8 caracteres.',
        {},
      );
    }
    //Con esto se evitan incidencias en los nombres
    updatedUser.username = updatedUser.username.toLowerCase();
    updatedUser.email = updatedUser.email.toLowerCase();

    var user : User = await this.userRepository.findOne<User>({
      where: { idUser: updatedUser.idUser },
    });
    //TO DO - Falta verificar que el correo y el usuario no lo tenga otro usuario
    try {
      user.name = updatedUser.name.toString();
      user.email = updatedUser.email.toString();
      user.haveImage = updatedUser.haveImage;
      user.username = updatedUser.username.toString();
      user.role = updatedUser.role;
      user.save();
      return new ServerMessages(false, 'Usuario actualizado con exito', user);
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error', error);
    }
  }

  async updateUserPassword(
    newUserPassword: NewUserPassword,
  ): Promise<ServerMessages> {
    //console.log(newUserPassword);

    if (!newUserPassword.idUser || !newUserPassword.newPassword) {
      return new ServerMessages(true, 'Peticion incompleta', {});
    } else if (newUserPassword.newPassword.length < 8) {
      return new ServerMessages(
        true,
        'La contraseña del usuario debe contener almenos 8 caracteres.',
        {},
      );
    }

    let user = await this.userRepository.findOne<User>({
      /* attributes: [
        'idUser',
        'name',
        'email',
        'password',
        'type',
        'username',
        'role',
        'description',
        'haveImage',
      ] ,*/
      where: { idUser: newUserPassword.idUser },
    });
    try {
      user.password = await user.hashNewPassword(newUserPassword.newPassword);
      await user.save();
      return new ServerMessages(
        false,
        'Contraseña de usuario actualizada con exito',
        user,
      );
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error', error);
    }
  }
}
