import { Direction } from './../../models/directions.entity';

import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { USER_REPOSITORY } from '../utils/constants';
//Normalmente se usa para formatear el objeto que recibimos en el request
import { ServerMessages } from '../../utils/serverMessages.util';
import { User } from '../../models/users.entity';
import { NewUserPassword } from './dto/newUserPassword.dto';
import { Op } from 'sequelize';
import { CreateUserDto } from './dto/createUser.dto';
import { UserModelClass } from '../../classes/userModel.class';
import { UpdatedUser } from './dto/updatedUser.dto';
import { MailCenterService } from '../mail-center/mail-center.service';

@Injectable()
export class UserService {
  constructor(
    private mailCenterService: MailCenterService,
    //Es una manera de dar de alta el repositorio de la tabla de usuarios
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,

  ) { }

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

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      attributes: { exclude: ['password', 'deleted'] },
      where: { email: email, deleted: false },
    });
  }

  async createUser(newUserData: CreateUserDto): Promise<ServerMessages> {
    if (
      newUserData.email == null ||
      newUserData.email == undefined ||
      newUserData.password == null ||
      newUserData.password == undefined ||
      newUserData.userType == null ||
      newUserData.userType == undefined
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    //Email validation
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(newUserData.email).toLowerCase())) {
      return new ServerMessages(true, 'Correo electrónico invalido.', {});
    }

    //Con esto se evitan incidencias en los nombres
    newUserData.email = newUserData.email.toLowerCase();

    var userEmail = await this.userRepository.findOne<User>({
      attributes: ['email'],
      where: { email: newUserData.email, deleted: false },
    });

    if (userEmail) {
      return new ServerMessages(true, 'Correo actualmente registrado', {});
    } else {
      try {
        let userData = new UserModelClass();
        userData.email = newUserData.email;
        userData.password = newUserData.password;
        userData.userType = newUserData.userType;

        var newUser: User = await this.userRepository.create<User>(userData, {},);
        let resultEmail = await this.mailCenterService.sendWelcomeEmail(newUser.name, newUser.email, newUserData.password);
        /* console.log("siguio");
        console.log(resultEmail); */

        if (resultEmail.error == true) {
          return new ServerMessages(false, 'Usuario creado con éxito, la contraseña no se pudo enviar al correo', resultEmail);
        } else {
          return new ServerMessages(false, 'Usuario creado con éxito se a enviado la contraseña al correo indicado', newUser);
        }
      } catch (error) {
        return new ServerMessages(true, 'A ocurrido un error', error);
      }
    }
  }

  async updateUser(updatedUser: UpdatedUser): Promise<ServerMessages> {
    if (
      updatedUser.idUser == undefined ||
      updatedUser.idUser == null ||
      updatedUser.name == null ||
      updatedUser.name == undefined ||
      updatedUser.surnames == null ||
      updatedUser.surnames == undefined ||
      updatedUser.email == null ||
      updatedUser.email == undefined ||
      updatedUser.birthDay == null ||
      updatedUser.birthDay == undefined ||
      updatedUser.phone == null ||
      updatedUser.phone == undefined ||
      updatedUser.gender == null ||
      updatedUser.gender == undefined ||
      updatedUser.actualPreference == null ||
      updatedUser.actualPreference == undefined ||
      updatedUser.userType == null ||
      updatedUser.userType == undefined ||
      updatedUser.createDate == null ||
      updatedUser.createDate == undefined ||
      updatedUser.lastLogin == null ||
      updatedUser.lastLogin == undefined ||
      updatedUser.deleted == null ||
      updatedUser.deleted == undefined ||
      updatedUser.active == null ||
      updatedUser.active == undefined ||
      updatedUser.conektaClientId == null ||
      updatedUser.conektaClientId == undefined ||
      updatedUser.userFacebookImage == null ||
      updatedUser.userFacebookImage == undefined ||
      updatedUser.billingInformation == null ||
      updatedUser.billingInformation == undefined ||
      updatedUser.directions == null ||
      updatedUser.directions == undefined ||
      updatedUser.directions[0] == null ||
      updatedUser.directions[0] == undefined
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let errorsData = [];
    const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePhone = /^[0-9]{10}$/;
    /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

    if (updatedUser.name.length == 0) {
      errorsData.push(new ServerMessages(true, 'El nombre de usuario incompleto', 1));
    }
    if (updatedUser.surnames.length == 0) {
      errorsData.push(new ServerMessages(true, 'Los apellidos del usuario deben estar completos', 2));
    }
    //Email validation
    if (!reEmail.test(String(updatedUser.email).toLowerCase())) {
      errorsData.push(new ServerMessages(true, 'Correo electrónico de la cuenta invalido.', {}));
    }/* else if(updatedUser.birthDay == undefined){
      return new ServerMessages(true, 'Petición incompleta', 4);
    } */
    if (!rePhone.test(String(updatedUser.phone).toLowerCase())) {
      errorsData.push(new ServerMessages(true, 'Teléfono de la cuenta invalido', 5));
    }/* else if(updatedUser.genre == undefined){
      return new ServerMessages(true, 'Petición incompleta', 6);
    } *//* else if(updatedUser.actualPreference == undefined){
      return new ServerMessages(true, 'Petición incompleta', 7);
    } */
    if (updatedUser.userType < 0 && updatedUser.userType > 2) {
      errorsData.push(new ServerMessages(true, 'Grupo de usuarios invalido', 8));
    }/* else if(updatedUser.createDate == undefined){
      return new ServerMessages(true, 'Petición incompleta', 9);
    } *//* else if(updatedUser.lastLogin == undefined){
      return new ServerMessages(true, 'Petición incompleta', 10);
    } *//* else if(updatedUser.deleted == undefined){
      return new ServerMessages(true, 'Petición incompleta',11);
    } *//* else if(updatedUser.active == undefined){
      return new ServerMessages(true, 'Petición incompleta', 12);
    } *//* else if(updatedUser.conektaClientId == undefined){
      return new ServerMessages(true, 'Petición incompleta', 13);
    } *//* else if(updatedUser.userFacebookImage == undefined){
      return new ServerMessages(true, 'Petición incompleta', 14);
    } */


    /* if(errorsData.length != 0){
      return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
    } */

    //Billing Data Validations
    if (updatedUser.billingInformation.businessName == "") {
      errorsData.push(new ServerMessages(true, 'Nombre del negocio invalido', 15));
    }
    if (updatedUser.billingInformation.rfc.length < 5/* !reRFC.test(String(updatedUser.billingInformation.rfc).toLowerCase()) */) {
      errorsData.push(new ServerMessages(true, 'Ingrese un RFC valido', 16));
    }
    if (!rePhone.test(String(updatedUser.billingInformation.phoneBilling).toLowerCase())) {
      errorsData.push(new ServerMessages(true, 'Teléfono de facturación invalido', 17));
    }
    if (!reEmail.test(String(updatedUser.billingInformation.emailBilling).toLowerCase())) {
      errorsData.push(new ServerMessages(true, 'Correo electrónico de la facturación invalido', 18));
    }
    if (updatedUser.billingInformation.state == "") {
      errorsData.push(new ServerMessages(true, 'Estado de la facturación invalido', 19));
    }
    if (updatedUser.billingInformation.city == "") {
      errorsData.push(new ServerMessages(true, 'Ciudad de la facturación invalida', 20));
    }
    if (updatedUser.billingInformation.postalCode == undefined) {
      errorsData.push(new ServerMessages(true, 'Codigo postal de la facturación invalido', 21));
    }
    if (updatedUser.billingInformation.colony == undefined) {
      errorsData.push(new ServerMessages(true, 'Colonia de la facturación invalida', 22));
    }
    if (updatedUser.billingInformation.street == undefined) {
      errorsData.push(new ServerMessages(true, 'Calle  de la facturación invalida', 23));
    }
    if (updatedUser.billingInformation.number == undefined) {
      errorsData.push(new ServerMessages(true, 'Numero de la facturación invalida', 24));
    }


    //Directions Data Validations
    const element = updatedUser.directions[0];
    if (element.name == "") {
      errorsData.push(new ServerMessages(true, 'Nombre de la dirección invalido', 1));
    }
    if (element.surnames == "") {
      errorsData.push(new ServerMessages(true, 'Apellidos de la dirección inválidos', 2));
    }
    if (element.street == "") {
      errorsData.push(new ServerMessages(true, 'Calle de la dirección invalida', 3));
    }
    if (!rePhone.test(String(element.phone).toLowerCase())) {
      errorsData.push(new ServerMessages(true, 'Teléfono de la dirección invalido', 4));
    }
    if (element.number == "") {
      errorsData.push(new ServerMessages(true, 'Numero de la dirección invalida', 5));
    }
    if (element.state == "") {
      errorsData.push(new ServerMessages(true, 'Estado de la dirección  invalido', 6));
    }
    if (element.city == "") {
      errorsData.push(new ServerMessages(true, 'Ciudad de la dirección invalida', 7));
    }

    if (element.colony == "") {
      errorsData.push(new ServerMessages(true, 'Colonia de la dirección invalida', 8));
    }
    if (element.postalCode == "") {
      errorsData.push(new ServerMessages(true, 'Código postal de la dirección invalido', 9));
    }

    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
    }

    //Validación único email
    var alreadyUserEmail: User = await this.userRepository.findOne<User>({
      where: {
        idUser: { [Op.ne]: updatedUser.idUser },
        deleted: false,
        email: updatedUser.email
      },
    });

    if (alreadyUserEmail) {
      return new ServerMessages(true, 'Correo actualmente registrado', {});
    }

    var userToUpdate: User = await this.userRepository.findOne<User>({
      where: {
        idUser: updatedUser.idUser,
        deleted: false
      },
    });

    if (!userToUpdate) {
      return new ServerMessages(true, 'El usuario no esta disponible', {});
    }

    try {
      userToUpdate.name = updatedUser.name;
      userToUpdate.surnames = updatedUser.surnames;
      userToUpdate.email = updatedUser.email;
      userToUpdate.birthDay = new Date(updatedUser.birthDay);
      userToUpdate.phone = updatedUser.phone;
      userToUpdate.gender = updatedUser.gender;
      userToUpdate.actualPreference = updatedUser.actualPreference;
      userToUpdate.userType = updatedUser.userType;
      userToUpdate.createDate = updatedUser.createDate;
      userToUpdate.lastLogin = updatedUser.lastLogin;
      userToUpdate.deleted = updatedUser.deleted;
      userToUpdate.active = updatedUser.active;
      userToUpdate.conektaClientId = updatedUser.conektaClientId;
      userToUpdate.userFacebookImage = updatedUser.userFacebookImage;

      //Billing Information
      userToUpdate.businessName = updatedUser.billingInformation.businessName;
      userToUpdate.rfc = updatedUser.billingInformation.rfc;
      userToUpdate.phoneBilling = updatedUser.billingInformation.phoneBilling;
      userToUpdate.emailBilling = updatedUser.billingInformation.emailBilling;
      userToUpdate.state = updatedUser.billingInformation.state;
      userToUpdate.city = updatedUser.billingInformation.city;
      userToUpdate.postalCode = updatedUser.billingInformation.postalCode;
      userToUpdate.colony = updatedUser.billingInformation.colony;
      userToUpdate.street = updatedUser.billingInformation.street;
      userToUpdate.number = updatedUser.billingInformation.number;

      await userToUpdate.save();
      //Ig user is admin or provider
      if (userToUpdate.userType == 0 || userToUpdate.userType == 1) {
        try {
          var directionToUpdate: Direction = await this.directionRepository.findOne<Direction>({
            where: {
              idDirection: updatedUser.directions[0].idDirection,
              deleted: false
            },
          });
          directionToUpdate.idDirection = updatedUser.directions[0].idDirection;
          directionToUpdate.name = updatedUser.directions[0].name;
          directionToUpdate.surnames = updatedUser.directions[0].surnames;
          directionToUpdate.phone = updatedUser.directions[0].phone;
          directionToUpdate.street = updatedUser.directions[0].street;
          directionToUpdate.number = updatedUser.directions[0].number;
          directionToUpdate.extNumber = updatedUser.directions[0].extNumber;
          directionToUpdate.state = updatedUser.directions[0].state;
          directionToUpdate.city = updatedUser.directions[0].city;
          directionToUpdate.postalCode = updatedUser.directions[0].postalCode;
          directionToUpdate.colony = updatedUser.directions[0].colony;
          directionToUpdate.default = true;
          directionToUpdate.deleted = false;
          await directionToUpdate.save();

          updatedUser.directions[0] = directionToUpdate;
          return new ServerMessages(false, 'Usuario actualizado con éxito', updatedUser);
        } catch (error) {
          return new ServerMessages(true, 'A ocurrido un error actualizando la dirección del usuario', error);
        }
      }
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error actualizando el usuario', error);
    }
  }

  /* async updateUserPassword(
    idUser,
    newUserPassword: NewUserPassword,
  ): Promise<ServerMessages> {
    //console.log(newUserPassword);

    if (!newUserPassword.idUser || !idUser || !newUserPassword.newPassword) {
      return new ServerMessages(true, 'Petición incompleta', {});
    } else if (newUserPassword.newPassword.length < 8) {
      return new ServerMessages(true, 'La contraseña del usuario debe contener al menos 8 caracteres.', {});
    }

    let user = await this.userRepository.findOne<User>({
      where: { idUser: idUser, deleted: false },
    });

    try {
      user.password = await user.hashNewPassword(newUserPassword.newPassword);
      await user.save();

      let resultEmail = await this.mailCenterService.sendChangePasswordEmail(user.name+" "+user.surnames,user.email,newUserPassword.newPassword);

      if (resultEmail.error == true) {
        return new ServerMessages(false, 'Contraseña actualizada con éxito, la contraseña no se pudo enviar al correo', resultEmail);
      } else {
        return new ServerMessages(false, 'Contraseña actualizada con éxito se a enviado la contraseña al correo indicado', {});
      }
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error', error);
    }
  } */

  async resetUserPassword(data: any): Promise<ServerMessages> {
    //console.log(data.email);
    if (!data.email) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let user = await this.userRepository.findOne<User>({
      where: {
        email: data.email,
        deleted: false
      },
    });

    if (!user) {
      return new ServerMessages(true, 'El usuario no esta disponible', {});
    }


    try {
      var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }

      user.password = await user.hashNewPassword(retVal);
      await user.save();

      let resultEmail = await this.mailCenterService.sendChangePasswordEmail(user.name + " " + user.surnames, user.email, retVal);
      /* console.log("siguio");
      console.log(resultEmail); */

      if (resultEmail.error == true) {
        return new ServerMessages(false, 'Contraseña actualizada con éxito, la contraseña no se pudo enviar al correo', resultEmail);
      } else {
        return new ServerMessages(false, 'Contraseña actualizada con éxito se a enviado la contraseña al correo indicado', {});
      }
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error', error);
    }
  }

  async updateUserPreference(idUser, data: any): Promise<ServerMessages> {
    //console.log(newUserPassword);

    if (
      idUser == null ||
      idUser == undefined ||
      data == null ||
      data == undefined ||
      data.newPreference == null ||
      data.newPreference == undefined
       ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    } else if (data.newPreference < 0 || data.newPreference > 3) {
      return new ServerMessages(true, 'Genero invalido', {});
    }

    let user: User = await this.userRepository.findOne<User>({
      where: {
        idUser: idUser,
        deleted: false
      },
    });

    if (!user) {
      return new ServerMessages(true, 'Usuario no disponible', {});
    }

    try {
      user.actualPreference = data.newPreference;
      await user.save();

      return new ServerMessages(false, 'Preferencia del usuario actualizada con éxito', {});
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error actualizando la preferencia del usuario', error);
    }
  }
}
