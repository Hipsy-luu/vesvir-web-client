import { NewUserPassword } from './../user/dto/newUserPassword.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ServerMessages } from '../../utils/serverMessages.util';
import { User } from '../../models/users.entity';
import * as sequelize from 'sequelize';
import { Direction } from '../../models/directions.entity';
import { Op } from 'sequelize';
import { UpdatedUser } from '../user/dto/updatedUser.dto';
import { MailCenterService } from '../mail-center/mail-center.service';

@Injectable()
export class CustomersService {

    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        private mailCenterService: MailCenterService,
    ) { }

    async getCustomersList(emailUser: string): Promise<ServerMessages> {
        try {
            var customerList: User[] = await this.userRepository.findAll<User>({
                attributes: {
                    exclude: ['password', 'deleted'],
                    /* include: ['password','deleted'] */
                },
                where: {
                    deleted: false,
                    email: {
                        [sequelize.Op.not]: emailUser
                    },
                    userType: 2,
                },
                /* include: [
                    {
                        model: Direction,
                        as: "directions",
                        where: { 
                            deleted: false
                        },
                    }
                ] */
            }).map(async (customer: User) => {
                var directions: Direction[] = await this.directionRepository.findAll<Direction>({
                    /* attributes: {
                        exclude: ['password', 'deleted'],
                        include: ['password','deleted']
                    }, */
                    where: {
                        idUser: customer.idUser,
                        deleted: false,
                    },
                });
                return Object.assign(
                    {
                        idUser: customer.idUser,
                        name: customer.name,
                        surnames: customer.surnames,
                        email: customer.email,
                        gender: customer.gender,
                        actualPreference: customer.actualPreference,
                        createDate: customer.createDate,
                        lastLogin: customer.lastLogin,
                        noDirections: directions.length,
                    })
            });;
            return new ServerMessages(false, 'Lista de clientes obtenida', customerList);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de clientes', {});
        }
    }

    async getCustomerById(idCustomer: string): Promise<ServerMessages> {
        try {
            var customerFinded: User = await this.userRepository.findOne<User>({
                attributes: {
                    exclude: ['password', 'passwordF', 'deleted'],
                },
                where: {
                    idUser: idCustomer,
                    deleted: false,
                    userType: 2
                },
                /* include: [
                    {
                        model: Direction,
                        as: "directions",
                        where: { 
                            deleted: false
                        },
                    }
                ] */
            });

            if (!customerFinded) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            customerFinded.directions = await this.directionRepository.findAll<Direction>({
                /* attributes: {
                    exclude: ['password', 'deleted'],
                    include: ['password','deleted']
                }, */
                where: {
                    idUser: idCustomer,
                    deleted: false,
                },
            });


            return new ServerMessages(false, 'Datos del cliente obtenidos', {
                idUser: customerFinded.idUser,
                name: customerFinded.name,
                surnames: customerFinded.surnames,
                email: customerFinded.email,
                birthDay: customerFinded.birthDay,
                phone: customerFinded.phone,
                gender: customerFinded.gender,
                actualPreference: customerFinded.actualPreference,
                userType: customerFinded.userType,
                createDate: customerFinded.createDate,
                lastLogin: customerFinded.lastLogin,
                deleted: customerFinded.deleted,
                active: customerFinded.active,
                conektaClientId: customerFinded.conektaClientId,
                userFacebookImage: customerFinded.userFacebookImage,
                billingInformation: {
                    businessName: customerFinded.businessName,
                    rfc: customerFinded.rfc,
                    phoneBilling: customerFinded.phoneBilling,
                    emailBilling: customerFinded.emailBilling,
                    state: customerFinded.state,
                    city: customerFinded.city,
                    postalCode: customerFinded.postalCode,
                    colony: customerFinded.colony,
                    street: customerFinded.street,
                    number: customerFinded.number,
                },
                directions: customerFinded.directions,
            });
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo los datos del cliente', {});
        }
    }

    async updateCustomerAccountData(updatedCustomer: UpdatedUser): Promise<ServerMessages> {
        if (
            updatedCustomer.idUser == undefined ||
            updatedCustomer.idUser == null ||
            updatedCustomer.name == null ||
            updatedCustomer.name == undefined ||
            updatedCustomer.surnames == null ||
            updatedCustomer.surnames == undefined ||
            updatedCustomer.email == null ||
            updatedCustomer.email == undefined ||
            updatedCustomer.birthDay == null ||
            updatedCustomer.birthDay == undefined ||
            updatedCustomer.phone == null ||
            updatedCustomer.phone == undefined ||
            updatedCustomer.gender == null ||
            updatedCustomer.gender == undefined ||
            updatedCustomer.actualPreference == null ||
            updatedCustomer.actualPreference == undefined ||
            updatedCustomer.userType == null ||
            updatedCustomer.userType == undefined ||
            updatedCustomer.createDate == null ||
            updatedCustomer.createDate == undefined ||
            updatedCustomer.lastLogin == null ||
            updatedCustomer.lastLogin == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (updatedCustomer.name.length == 0) {
            errorsData.push(new ServerMessages(true, 'El nombre de usuario incompleto', 1));
        }
        if (updatedCustomer.surnames.length == 0) {
            errorsData.push(new ServerMessages(true, 'Los apellidos del usuario deben estar completos', 2));
        }
        //Email validation
        if (!reEmail.test(String(updatedCustomer.email).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Correo electrónico de la cuenta invalido.', {}));
        }/* if(updatedUser.birthDay == undefined){
          return new ServerMessages(true, 'Petición incompleta', 4);
        } */
        if (!rePhone.test(String(updatedCustomer.phone).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono de la cuenta invalido', 5));
        }
        if (updatedCustomer.gender == -1) {
            errorsData.push(new ServerMessages(true, 'Genero invalido', 6));
        }/* if(updatedUser.actualPreference == undefined){
          return new ServerMessages(true, 'Petición incompleta', 7);
        } */
        if (updatedCustomer.userType < 0 && updatedCustomer.userType > 2) {
            errorsData.push(new ServerMessages(true, 'Grupo de usuarios invalido', 8));
        }/* if(updatedUser.createDate == undefined){
          return new ServerMessages(true, 'Petición incompleta', 9);
        } *//* if(updatedUser.lastLogin == undefined){
          return new ServerMessages(true, 'Petición incompleta', 10);
        } *//* if(updatedUser.deleted == undefined){
          return new ServerMessages(true, 'Petición incompleta',11);
        } *//* if(updatedUser.active == undefined){
          return new ServerMessages(true, 'Petición incompleta', 12);
        } *//* if(updatedUser.conektaClientId == undefined){
          return new ServerMessages(true, 'Petición incompleta', 13);
        } *//* if(updatedUser.userFacebookImage == undefined){
          return new ServerMessages(true, 'Petición incompleta', 14);
        } */


        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
        }

        //Validación único email
        var alreadyUserEmail: User = await this.userRepository.findOne<User>({
            where: {
                idUser: {
                    [Op.ne]: updatedCustomer.idUser
                },
                deleted: false,
                email: updatedCustomer.email
            },
        });

        if (alreadyUserEmail) {
            return new ServerMessages(true, 'Correo actualmente registrado', alreadyUserEmail);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: { idUser: updatedCustomer.idUser, deleted: false },

        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        userToUpdate.directions = await this.directionRepository.findAll<Direction>({
            /* attributes: {
                exclude: ['password', 'deleted'],
                include: ['password','deleted']
            }, */
            where: {
                idUser: userToUpdate.idUser,
                deleted: false,
            },
        });

        try {
            userToUpdate.name = updatedCustomer.name;
            userToUpdate.surnames = updatedCustomer.surnames;
            userToUpdate.email = updatedCustomer.email;
            userToUpdate.birthDay = new Date(updatedCustomer.birthDay);
            userToUpdate.phone = updatedCustomer.phone;
            userToUpdate.gender = updatedCustomer.gender;
            userToUpdate.actualPreference = updatedCustomer.actualPreference;
            userToUpdate.userType = updatedCustomer.userType;
            userToUpdate.createDate = updatedCustomer.createDate;
            userToUpdate.lastLogin = updatedCustomer.lastLogin;

            await userToUpdate.save();

            //En caso de que no exista la dirección del usuario hay que crearla
            if ((userToUpdate.userType == 1 || userToUpdate.userType == 0)) {
                if (userToUpdate.directions.length == 0) {
                    var newDirection: Direction = await this.directionRepository.create<Direction>({
                        name: userToUpdate.name,
                        surnames: userToUpdate.surnames,
                        phone: userToUpdate.phone,
                        street: userToUpdate.street,
                        number: userToUpdate.number,
                        extNumber: "",
                        state: userToUpdate.state,
                        city: userToUpdate.city,
                        postalCode: userToUpdate.postalCode,
                        colony: userToUpdate.colony,
                        default: true,
                        deleted: false,
                        idUser: userToUpdate.idUser
                    }, {});
                    updatedCustomer.directions.push(newDirection);
                    return new ServerMessages(false, 'Usuario actualizado con éxito y dirección añadida', updatedCustomer);
                } else {
                    for (let index = 0; index < userToUpdate.directions.length; index++) {
                        userToUpdate.directions[index].deleted = true;
                        userToUpdate.directions[index].default = false;
                        userToUpdate.directions[index].save();
                    }

                    userToUpdate.directions[0].deleted = false;
                    userToUpdate.directions[0].default = true;
                    userToUpdate.directions[0].save();
                    return new ServerMessages(false, 'Usuario actualizado con éxito', updatedCustomer);
                }

            } else {


                return new ServerMessages(false, 'Usuario actualizado con éxito', updatedCustomer);
            }


        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el usuario', error);
        }
    }

    async updateCustomerBillingData(updatedUser: UpdatedUser): Promise<ServerMessages> {
        if (
            updatedUser.billingInformation == null ||
            updatedUser.billingInformation == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


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
        if (updatedUser.billingInformation.postalCode == "") {
            errorsData.push(new ServerMessages(true, 'Codigo postal de la facturación invalido', 21));
        }
        if (updatedUser.billingInformation.colony == "") {
            errorsData.push(new ServerMessages(true, 'Colonia de la facturación invalida', 22));
        }
        if (updatedUser.billingInformation.street == "") {
            errorsData.push(new ServerMessages(true, 'Calle  de la facturación invalida', 23));
        }
        if (updatedUser.billingInformation.number == "") {
            errorsData.push(new ServerMessages(true, 'Numero de la facturación invalida', 24));
        }

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de facturación inválidos', errorsData);
        }

        //Validación único email
        var alreadyUserEmail: User = await this.userRepository.findOne<User>({
            where: { idUser: { [Op.ne]: updatedUser.idUser }, deleted: false, email: updatedUser.email },
        });

        if (alreadyUserEmail) {
            return new ServerMessages(true, 'Correo actualmente registrado', {});
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: { idUser: updatedUser.idUser, deleted: false },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {

            //Billing Information
            userToUpdate.businessName = updatedUser.billingInformation.businessName.toUpperCase();
            userToUpdate.rfc = updatedUser.billingInformation.rfc.toUpperCase();
            userToUpdate.phoneBilling = updatedUser.billingInformation.phoneBilling;
            userToUpdate.emailBilling = updatedUser.billingInformation.emailBilling.toLowerCase();
            userToUpdate.state = updatedUser.billingInformation.state;
            userToUpdate.city = updatedUser.billingInformation.city;
            userToUpdate.postalCode = updatedUser.billingInformation.postalCode;
            userToUpdate.colony = updatedUser.billingInformation.colony;
            userToUpdate.street = updatedUser.billingInformation.street;
            userToUpdate.number = updatedUser.billingInformation.number;

            await userToUpdate.save();

            return new ServerMessages(false, 'Usuario actualizado con éxito', updatedUser);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el usuario', error);
        }
    }

    async addDirectionCustomer(newDirection: Direction): Promise<ServerMessages> {
        if (
            newDirection.idUser == undefined ||
            newDirection.idUser == null ||
            newDirection.name == undefined ||
            newDirection.name == undefined ||
            newDirection.surnames == undefined ||
            newDirection.surnames == undefined ||
            newDirection.phone == undefined ||
            newDirection.phone == undefined ||
            newDirection.street == undefined ||
            newDirection.street == undefined ||
            newDirection.number == undefined ||
            newDirection.number == undefined ||
            newDirection.extNumber == undefined ||
            newDirection.extNumber == undefined ||
            newDirection.state == undefined ||
            newDirection.state == undefined ||
            newDirection.city == undefined ||
            newDirection.city == undefined ||
            newDirection.postalCode == undefined ||
            newDirection.postalCode == undefined ||
            newDirection.colony == undefined ||
            newDirection.colony == undefined ||
            newDirection.default == undefined ||
            newDirection.default == undefined ||
            newDirection.default == undefined ||
            newDirection.default == undefined ||
            newDirection.idUser == undefined ||
            newDirection.idUser == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


        //Directions Data Validations
        if (newDirection.name == "") {
            errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
        }
        if (newDirection.surnames == "") {
            errorsData.push(new ServerMessages(true, 'Apellidos inválidos', 2));
        }
        if (newDirection.street == "") {
            errorsData.push(new ServerMessages(true, 'Calle invalida', 3));
        }
        if (!rePhone.test(String(newDirection.phone).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono invalido', 4));
        }
        if (newDirection.number == "") {
            errorsData.push(new ServerMessages(true, 'Numero  invalida', 5));
        }
        if (newDirection.state == "") {
            errorsData.push(new ServerMessages(true, 'Estado invalido', 6));
        }
        if (newDirection.city == "") {
            errorsData.push(new ServerMessages(true, 'Ciudad invalida', 7));
        }

        if (newDirection.colony == "") {
            errorsData.push(new ServerMessages(true, 'Colonia invalida', 8));
        }
        if (newDirection.postalCode == "") {
            errorsData.push(new ServerMessages(true, 'Código postal invalido', 9));
        }

        /* if(errorsData.length != 0){
          return new ServerMessages(true, 'Campos de Facturación inválidos', errorsData);
        } */

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de dirección inválidos', errorsData);
        }

        //Validación cliente activo
        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: { idUser: newDirection.idUser, deleted: false },

        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            var newDirection: Direction = await this.directionRepository.create<Direction>({
                name: newDirection.name,
                surnames: newDirection.surnames,
                phone: newDirection.phone,
                street: newDirection.street,
                number: newDirection.number,
                extNumber: newDirection.extNumber,
                state: newDirection.state,
                city: newDirection.city,
                postalCode: newDirection.postalCode,
                colony: newDirection.colony,
                default: newDirection.default,
                deleted: false,
                idUser: newDirection.idUser
            }, {});
            return new ServerMessages(false, 'Dirección creada con éxito', newDirection);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error creando la dirección del usuario', error);
        }
    }


    async saveDirectionsCustomer(dataDirections: Direction[]): Promise<ServerMessages> {
        if (
            dataDirections == undefined ||
            dataDirections == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }



        try {
            let errorsData = [];
            const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const rePhone = /^[0-9]{10}$/;
            /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

            if (dataDirections.length == 0) {
                return new ServerMessages(false, 'Nada que guardar', dataDirections);
            }

            for (let index = 0; index < dataDirections.length; index++) {
                const element = dataDirections[index];
                //Directions Data Validations
                if (element.name == "") {
                    errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
                }
                if (element.surnames == "") {
                    errorsData.push(new ServerMessages(true, 'Apellidos inválidos', 2));
                }
                if (element.street == "") {
                    errorsData.push(new ServerMessages(true, 'Calle invalida', 3));
                }
                if (!rePhone.test(String(element.phone).toLowerCase())) {
                    errorsData.push(new ServerMessages(true, 'Teléfono invalido', 4));
                }
                if (element.number == "") {
                    errorsData.push(new ServerMessages(true, 'Numero  invalida', 5));
                }
                if (element.state == "") {
                    errorsData.push(new ServerMessages(true, 'Estado invalido', 6));
                }
                if (element.city == "") {
                    errorsData.push(new ServerMessages(true, 'Ciudad invalida', 7));
                }

                if (element.colony == "") {
                    errorsData.push(new ServerMessages(true, 'Colonia invalida', 8));
                }
                if (element.postalCode == "") {
                    errorsData.push(new ServerMessages(true, 'Código postal invalido', 9));
                }
            }


            /* if(errorsData.length != 0){
              return new ServerMessages(true, 'Campos de Facturación inválidos', errorsData);
            } */

            if (errorsData.length != 0) {
                return new ServerMessages(true, 'Campos de la dirección inválidos', errorsData);
            }


            //Validación cliente activo
            var userToUpdate: User = await this.userRepository.findOne<User>({
                where: { idUser: dataDirections[0].idUser, deleted: false },
            });

            if (!userToUpdate) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            for (let index = 0; index < dataDirections.length; index++) {
                const element = dataDirections[index];
                var directionToUpdate: Direction = await this.directionRepository.findOne<Direction>({
                    where: { idDirection: element.idDirection, deleted: false },
                });



                if (directionToUpdate) {
                    directionToUpdate.name = element.name;
                    directionToUpdate.surnames = element.surnames;
                    directionToUpdate.phone = element.phone;
                    directionToUpdate.street = element.street;
                    directionToUpdate.number = element.number;
                    directionToUpdate.extNumber = element.extNumber;
                    directionToUpdate.state = element.state;
                    directionToUpdate.city = element.city;
                    directionToUpdate.postalCode = element.postalCode;
                    directionToUpdate.colony = element.colony;
                    directionToUpdate.default = element.default;
                    directionToUpdate.deleted = element.deleted;
                    directionToUpdate.idUser = element.idUser;

                    await directionToUpdate.save();

                    //console.log(directionToUpdate);
                }
            }

            return new ServerMessages(false, 'Dirección actualizada con éxito', dataDirections);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando la dirección del usuario', error);
        }
    }


    async deleteDirectionCustomer(idDirection: string): Promise<ServerMessages> {
        if (
            idDirection == undefined ||
            idDirection == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        console.log(idDirection);

        var directionToDelete: Direction = await this.directionRepository.findOne<Direction>({
            where: { idDirection: idDirection, deleted: false },
        });

        if (!directionToDelete) {
            return new ServerMessages(true, 'La dirección no esta disponible', {});
        }

        try {
            directionToDelete.deleted = true;
            await directionToDelete.save();

            return new ServerMessages(false, 'Dirección eliminada con éxito', directionToDelete);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando la dirección del usuario', error);
        }
    }

    async resetCustomerPassword(
        idCustomer,
    ): Promise<ServerMessages> {

        if (!idCustomer) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let user = await this.userRepository.findOne<User>({
            where: { idUser: idCustomer, deleted: false },
        });

        try {
            let newPassword = await user.generatePassword();

            user.password = await user.hashNewPassword(newPassword);
            await user.save();

            let resultEmail = await this.mailCenterService.sendChangePasswordEmail(user.name + " " + user.surnames, user.email, newPassword);
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



    async deleteCustomer(idCustomer: string): Promise<ServerMessages> {
        if (
            idCustomer == undefined ||
            idCustomer == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        try {
            //Validación cliente activo
            var userToDelete: User = await this.userRepository.findOne<User>({
                where: { idUser: idCustomer },
                include: [{
                    model: Direction,
                    as: "directions"
                }]
            });

            if (!userToDelete) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            for (let index = 0; index < userToDelete.directions.length; index++) {
                userToDelete.directions[index].deleted = true;
                await userToDelete.directions[index].save();
            }

            userToDelete.deleted = true;
            await userToDelete.save();

            return new ServerMessages(false, 'Cliente eliminado con éxito', userToDelete);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error eliminando el cliente', error);
        }
    }


    //Customers Mobile requests

    async updateCustomerNameSurnames(idUser: number, updatedNameSurnames: any): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            updatedNameSurnames.newName == null ||
            updatedNameSurnames.newName == undefined ||
            updatedNameSurnames.newSurnames == null ||
            updatedNameSurnames.newSurnames == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (updatedNameSurnames.newName.length == 0) {
            errorsData.push(new ServerMessages(true, 'El nombre de usuario incompleto', 1));
        }
        if (updatedNameSurnames.newSurnames.length == 0) {
            errorsData.push(new ServerMessages(true, 'Los apellidos del usuario deben estar completos', 2));
        }


        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },

        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            userToUpdate.name = updatedNameSurnames.newName;
            userToUpdate.surnames = updatedNameSurnames.newSurnames;
            await userToUpdate.save();

            return new ServerMessages(false, 'Nombre actualizado con éxito', userToUpdate);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el nombre del usuario', error);
        }
    }


    async updateCustomerBirthday(idUser: number, updatedBirthday: any): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            updatedBirthday.newBirthDay == null ||
            updatedBirthday.newBirthDay == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            userToUpdate.birthDay = new Date(updatedBirthday.newBirthDay);
            await userToUpdate.save();

            return new ServerMessages(false, 'Fecha de nacimiento actualizada con éxito', userToUpdate);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando la fecha de nacimiento del usuario', error);
        }
    }

    async updateCustomerPassword(idUser, newUserPassword): Promise<ServerMessages> {

        if (
            idUser == undefined ||
            idUser == null ||
            newUserPassword.newPassword == null ||
            newUserPassword.newPassword == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let user = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },
        });

        try {
            user.password = await user.hashNewPassword(newUserPassword.newPassword);
            await user.save();

            let resultEmail = await this.mailCenterService.sendChangePasswordEmail(user.name + " " + user.surnames, user.email, newUserPassword.newPassword);
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


    async updateCustomerGender(idUser: number, updatedGender: any): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            updatedGender.newGender == null ||
            updatedGender.newGender == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (updatedGender.newGender < 0 || updatedGender.newGender > 1) {
            errorsData.push(new ServerMessages(true, 'Sexo invalido', 0));
        }

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            userToUpdate.gender = updatedGender.newGender;
            await userToUpdate.save();

            return new ServerMessages(false, 'Sexo actualizado con éxito', userToUpdate);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el sexo del usuario', error);
        }
    }

    async updateCustomerPhone(idUser: number, updatedPhone: any): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            updatedPhone.newPhone == null ||
            updatedPhone.newPhone == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (updatedPhone.newPhone.length < 10) {
            errorsData.push(new ServerMessages(true, 'Teléfono invalido', 0));
        }

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            userToUpdate.phone = updatedPhone.newPhone;
            await userToUpdate.save();

            return new ServerMessages(false, 'Teléfono actualizado con éxito', userToUpdate);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el teléfono del usuario', error);
        }
    }


    async updateCustomerBillingInformation(idUser: number, updatedBillingInformation: any): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            updatedBillingInformation.businessName == null ||
            updatedBillingInformation.businessName == undefined ||
            updatedBillingInformation.rfc == null ||
            updatedBillingInformation.rfc == undefined ||
            updatedBillingInformation.phoneBilling == null ||
            updatedBillingInformation.phoneBilling == undefined ||
            updatedBillingInformation.emailBilling == null ||
            updatedBillingInformation.emailBilling == undefined ||
            updatedBillingInformation.state == null ||
            updatedBillingInformation.state == undefined ||
            updatedBillingInformation.city == null ||
            updatedBillingInformation.city == undefined ||
            updatedBillingInformation.postalCode == null ||
            updatedBillingInformation.postalCode == undefined ||
            updatedBillingInformation.colony == null ||
            updatedBillingInformation.colony == undefined ||
            updatedBillingInformation.street == null ||
            updatedBillingInformation.street == undefined ||
            updatedBillingInformation.number == null ||
            updatedBillingInformation.number == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', updatedBillingInformation);
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


        //Billing Data Validations
        if (updatedBillingInformation.businessName == "") {
            errorsData.push(new ServerMessages(true, 'Nombre del negocio invalido', 15));
        }
        if (updatedBillingInformation.rfc.length < 5/* !reRFC.test(String(updatedUser.billingInformation.rfc).toLowerCase()) */) {
            errorsData.push(new ServerMessages(true, 'Ingrese un RFC valido', 16));
        }
        if (!rePhone.test(String(updatedBillingInformation.phoneBilling).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono de facturación invalido', 17));
        }
        if (!reEmail.test(String(updatedBillingInformation.emailBilling).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Correo electrónico de la facturación invalido', 18));
        }
        if (updatedBillingInformation.state == "") {
            errorsData.push(new ServerMessages(true, 'Estado de la facturación invalido', 19));
        }
        if (updatedBillingInformation.city == "") {
            errorsData.push(new ServerMessages(true, 'Ciudad de la facturación invalida', 20));
        }
        if (updatedBillingInformation.postalCode == "") {
            errorsData.push(new ServerMessages(true, 'Código postal de la facturación invalido', 21));
        }
        if (updatedBillingInformation.colony == "") {
            errorsData.push(new ServerMessages(true, 'Colonia de la facturación invalida', 22));
        }
        if (updatedBillingInformation.street == "") {
            errorsData.push(new ServerMessages(true, 'Calle  de la facturación invalida', 23));
        }
        if (updatedBillingInformation.number == "") {
            errorsData.push(new ServerMessages(true, 'Numero de la facturación invalida', 24));
        }

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de facturación inválidos', errorsData);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false
            },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {

            //Billing Information
            userToUpdate.businessName = updatedBillingInformation.businessName.toUpperCase();
            userToUpdate.rfc = updatedBillingInformation.rfc.toUpperCase();
            userToUpdate.phoneBilling = updatedBillingInformation.phoneBilling;
            userToUpdate.emailBilling = updatedBillingInformation.emailBilling.toLowerCase();
            userToUpdate.state = updatedBillingInformation.state;
            userToUpdate.city = updatedBillingInformation.city;
            userToUpdate.postalCode = updatedBillingInformation.postalCode;
            userToUpdate.colony = updatedBillingInformation.colony;
            userToUpdate.street = updatedBillingInformation.street;
            userToUpdate.number = updatedBillingInformation.number;

            await userToUpdate.save();

            return new ServerMessages(false, 'Datos de facturación actualizados', userToUpdate);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando los datos de facturación', error);
        }
    }

    async addNewCustomerDirection(idUser: number, newDirection: Direction): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            newDirection.name == undefined ||
            newDirection.name == null ||
            newDirection.surnames == undefined ||
            newDirection.surnames == null ||
            newDirection.phone == undefined ||
            newDirection.phone == null ||
            newDirection.street == undefined ||
            newDirection.street == null ||
            newDirection.number == undefined ||
            newDirection.number == null ||
            newDirection.extNumber == undefined ||
            newDirection.extNumber == null ||
            newDirection.state == undefined ||
            newDirection.state == null ||
            newDirection.city == undefined ||
            newDirection.city == null ||
            newDirection.postalCode == undefined ||
            newDirection.postalCode == null ||
            newDirection.colony == undefined ||
            newDirection.colony == null ||
            newDirection.default == undefined ||
            newDirection.default == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


        //Directions Data Validations
        if (newDirection.name == "") {
            errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
        }
        if (newDirection.surnames == "") {
            errorsData.push(new ServerMessages(true, 'Apellidos inválidos', 2));
        }
        if (newDirection.street == "") {
            errorsData.push(new ServerMessages(true, 'Calle invalida', 3));
        }
        if (!rePhone.test(String(newDirection.phone).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono invalido', 4));
        }
        if (newDirection.number == "") {
            errorsData.push(new ServerMessages(true, 'Numero  invalida', 5));
        }
        if (newDirection.state == "") {
            errorsData.push(new ServerMessages(true, 'Estado invalido', 6));
        }
        if (newDirection.city == "") {
            errorsData.push(new ServerMessages(true, 'Ciudad invalida', 7));
        }

        if (newDirection.colony == "") {
            errorsData.push(new ServerMessages(true, 'Colonia invalida', 8));
        }
        if (newDirection.postalCode == "") {
            errorsData.push(new ServerMessages(true, 'Código postal invalido', 9));
        }

        /* if(errorsData.length != 0){
          return new ServerMessages(true, 'Campos de Facturación inválidos', errorsData);
        } */

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de dirección inválidos', errorsData);
        }

        //Validación cliente activo
        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: idUser,
                deleted: false,
                userType: 2
            },
        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El usuario no esta disponible', {});
        }

        try {
            var newDirection: Direction = await this.directionRepository.create<Direction>({
                name: newDirection.name,
                surnames: newDirection.surnames,
                phone: newDirection.phone,
                street: newDirection.street,
                number: newDirection.number,
                extNumber: newDirection.extNumber,
                state: newDirection.state,
                city: newDirection.city,
                postalCode: newDirection.postalCode,
                colony: newDirection.colony,
                default: newDirection.default,
                deleted: false,
                idUser: userToUpdate.idUser
            }, {});
            return new ServerMessages(false, 'Dirección creada con éxito', newDirection);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error creando la dirección del usuario', error);
        }
    }

    async updateDirectionsCustomer(idUser : number, dataDirections: Direction[]): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            dataDirections == undefined ||
            dataDirections == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        try {
            let errorsData = [];
            const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const rePhone = /^[0-9]{10}$/;
            /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

            if (dataDirections.length == 0) {
                return new ServerMessages(false, 'Nada que guardar', dataDirections);
            }

            for (let index = 0; index < dataDirections.length; index++) {
                const element = dataDirections[index];
                //Directions Data Validations
                if (element.name == "") {
                    errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
                }
                if (element.surnames == "") {
                    errorsData.push(new ServerMessages(true, 'Apellidos inválidos', 2));
                }
                if (element.street == "") {
                    errorsData.push(new ServerMessages(true, 'Calle invalida', 3));
                }
                if (!rePhone.test(String(element.phone).toLowerCase())) {
                    errorsData.push(new ServerMessages(true, 'Teléfono invalido', 4));
                }
                if (element.number == "") {
                    errorsData.push(new ServerMessages(true, 'Numero  invalida', 5));
                }
                if (element.state == "") {
                    errorsData.push(new ServerMessages(true, 'Estado invalido', 6));
                }
                if (element.city == "") {
                    errorsData.push(new ServerMessages(true, 'Ciudad invalida', 7));
                }

                if (element.colony == "") {
                    errorsData.push(new ServerMessages(true, 'Colonia invalida', 8));
                }
                if (element.postalCode == "") {
                    errorsData.push(new ServerMessages(true, 'Código postal invalido', 9));
                }
            }


            /* if(errorsData.length != 0){
              return new ServerMessages(true, 'Campos de Facturación inválidos', errorsData);
            } */

            if (errorsData.length != 0) {
                return new ServerMessages(true, 'Campos de la dirección inválidos', errorsData);
            }


            //Validación cliente activo
            var userToUpdate: User = await this.userRepository.findOne<User>({
                where: { 
                    idUser: idUser, 
                    deleted: false ,
                    userType : 2
                },
            });

            if (!userToUpdate) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            for (let index = 0; index < dataDirections.length; index++) {
                const element = dataDirections[index];

                var directionToUpdate: Direction = await this.directionRepository.findOne<Direction>({
                    where: { 
                        idDirection: element.idDirection, 
                        deleted: false,
                        idUser : idUser
                    },
                });

                if (directionToUpdate) {
                    directionToUpdate.name = element.name;
                    directionToUpdate.surnames = element.surnames;
                    directionToUpdate.phone = element.phone;
                    directionToUpdate.street = element.street;
                    directionToUpdate.number = element.number;
                    directionToUpdate.extNumber = element.extNumber;
                    directionToUpdate.state = element.state;
                    directionToUpdate.city = element.city;
                    directionToUpdate.postalCode = element.postalCode;
                    directionToUpdate.colony = element.colony;
                    directionToUpdate.default = element.default;
                    /* directionToUpdate.deleted = element.deleted;
                    directionToUpdate.idUser = element.idUser; */

                    await directionToUpdate.save();

                    //console.log(directionToUpdate);
                }
            }

            return new ServerMessages(false, 'Dirección actualizada con éxito', dataDirections);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando la dirección del usuario', error);
        }
    }

    async deleteCustomerDirection(idUser : number,idDirection: string): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            idDirection == undefined ||
            idDirection == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }
        //console.log(idDirection);

        var directionToDelete: Direction = await this.directionRepository.findOne<Direction>({
            where: { 
                idDirection: idDirection, 
                deleted: false ,
                idUser : idUser
            },
        });

        if (!directionToDelete) {
            return new ServerMessages(true, 'La dirección no esta disponible', {});
        }

        try {
            directionToDelete.deleted = true;
            await directionToDelete.save();

            return new ServerMessages(false, 'Dirección eliminada con éxito', directionToDelete);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando la dirección del usuario', error);
        }
    }
}
