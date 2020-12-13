import { Product } from './../../models/products.entity';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { ServerMessages } from '../../utils/serverMessages.util';
import * as sequelize from 'sequelize';
import { Op } from 'sequelize';
import { UpdatedUser } from '../user/dto/updatedUser.dto';

@Injectable()
export class ProvidersService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('ProductRepository') private readonly productRepository: typeof Product,
        private mailCenterService: MailCenterService,
    ) { }

    async getProviders(emailUser: string): Promise<ServerMessages> {
        try {
            var providerList: User[] = await this.userRepository.findAll<User>({
                attributes: {
                    exclude: ['password', 'deleted'],
                    /* include: ['password','deleted'] */
                },
                where: {
                    deleted: false,
                    email: {
                        [sequelize.Op.not]: emailUser
                    },
                    userType: 1,
                },
                /* include: [
                    {
                        model: Product,
                        as: "products",
                        where: { 
                            deleted: false
                        },
                    }
                ] , */
                order: [
                    ['idUser', 'DESC'],
                    /* [ { model: ProductImage, as: 'images' } , 'position', 'ASC'] */
                ]
            }).map(async (provider: User) => {
                var productsProviderList: Product[] = await this.productRepository.findAll<Product>({
                    where: {
                        idProvider: provider.idUser,
                        deleted: false,
                    },
                });
                return Object.assign(
                    {
                        idUser: provider.idUser,
                        nameContact: provider.name + " " + provider.surnames,
                        businessName: provider.businessName,
                        phoneContact: provider.phone,
                        emailContact: provider.email,
                        createDate: provider.createDate,
                        lastLogin: provider.lastLogin,
                        noProducts: productsProviderList.length,
                    });
            });;
            return new ServerMessages(false, 'Lista de proveedores obtenida', providerList);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de proveedores', {});
        }
    }

    async getProviderById(idProvider: string): Promise<ServerMessages> {
        try {
            var providerFinded: User = await this.userRepository.findOne<User>({
                attributes: {
                    exclude: ['password', 'passwordF', 'deleted'],
                },
                where: {
                    idUser: idProvider,
                    deleted: false,
                    userType: 1
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

            if (!providerFinded) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            providerFinded.directions = await this.directionRepository.findAll<Direction>({
                /* attributes: {
                    exclude: ['password', 'deleted'],
                    include: ['password','deleted']
                }, */
                limit: 1,
                where: {
                    idUser: idProvider,
                    deleted: false,
                },
            });


            return new ServerMessages(false, 'Datos del proveedor obtenidos', {
                idUser: providerFinded.idUser,
                name: providerFinded.name,
                surnames: providerFinded.surnames,
                email: providerFinded.email,
                birthDay: providerFinded.birthDay,
                phone: providerFinded.phone,
                gender: providerFinded.gender,
                actualPreference: providerFinded.actualPreference,
                userType: providerFinded.userType,
                createDate: providerFinded.createDate,
                lastLogin: providerFinded.lastLogin,
                deleted: providerFinded.deleted,
                active: providerFinded.active,
                conektaClientId: providerFinded.conektaClientId,
                userFacebookImage: providerFinded.userFacebookImage,
                billingInformation: {
                    businessName: providerFinded.businessName,
                    rfc: providerFinded.rfc,
                    phoneBilling: providerFinded.phoneBilling,
                    emailBilling: providerFinded.emailBilling,
                    state: providerFinded.state,
                    city: providerFinded.city,
                    postalCode: providerFinded.postalCode,
                    colony: providerFinded.colony,
                    street: providerFinded.street,
                    number: providerFinded.number,
                },
                directions: providerFinded.directions,
            });
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo los datos del proveedor', {});
        }
    }

    async updateProviderAccountData(updatedProvider: UpdatedUser): Promise<ServerMessages> {
        if (
            updatedProvider.idUser == undefined ||
            updatedProvider.idUser == null ||
            updatedProvider.name == null ||
            updatedProvider.name == undefined ||
            updatedProvider.surnames == null ||
            updatedProvider.surnames == undefined ||
            updatedProvider.email == null ||
            updatedProvider.email == undefined ||
            updatedProvider.birthDay == null ||
            updatedProvider.birthDay == undefined ||
            updatedProvider.phone == null ||
            updatedProvider.phone == undefined ||
            updatedProvider.gender == null ||
            updatedProvider.gender == undefined ||
            updatedProvider.actualPreference == null ||
            updatedProvider.actualPreference == undefined ||
            updatedProvider.userType == null ||
            updatedProvider.userType == undefined ||
            updatedProvider.createDate == null ||
            updatedProvider.createDate == undefined ||
            updatedProvider.lastLogin == null ||
            updatedProvider.lastLogin == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

        if (updatedProvider.name.length == 0) {
            errorsData.push(new ServerMessages(true, 'El nombre de usuario incompleto', 1));
        }
        if (updatedProvider.surnames.length == 0) {
            errorsData.push(new ServerMessages(true, 'Los apellidos del usuario deben estar completos', 2));
        }
        //Email validation
        if (!reEmail.test(String(updatedProvider.email).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Correo electrónico de la cuenta invalido.', {}));
        }/* if(updatedUser.birthDay == undefined){
          return new ServerMessages(true, 'Petición incompleta', 4);
        } */
        if (!rePhone.test(String(updatedProvider.phone).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono de la cuenta invalido', 5));
        }
        if (updatedProvider.gender == -1) {
            errorsData.push(new ServerMessages(true, 'Genero invalido', 6));
        }/* if(updatedUser.actualPreference == undefined){
          return new ServerMessages(true, 'Petición incompleta', 7);
        } */
        if (updatedProvider.userType < 0 && updatedProvider.userType > 2) {
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
                    [sequelize.Op.ne]: updatedProvider.idUser
                },
                deleted: false,
                email: updatedProvider.email
            },
        });

        if (alreadyUserEmail) {
            return new ServerMessages(true, 'Correo actualmente registrado', alreadyUserEmail);
        }

        var userToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: updatedProvider.idUser,
                deleted: false,
                userType: 1
            },

        });

        if (!userToUpdate) {
            return new ServerMessages(true, 'El Proveedor no esta disponible', {});
        }

        try {
            userToUpdate.name = updatedProvider.name;
            userToUpdate.surnames = updatedProvider.surnames;
            userToUpdate.email = updatedProvider.email;
            userToUpdate.birthDay = new Date(updatedProvider.birthDay);
            userToUpdate.phone = updatedProvider.phone;
            userToUpdate.gender = updatedProvider.gender;
            userToUpdate.actualPreference = updatedProvider.actualPreference;
            userToUpdate.userType = updatedProvider.userType;
            userToUpdate.createDate = updatedProvider.createDate;
            userToUpdate.lastLogin = updatedProvider.lastLogin;

            await userToUpdate.save();

            return new ServerMessages(false, 'Proveedor actualizado con éxito', updatedProvider);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el Proveedor', error);
        }
    }


    async updateProviderBillingData(updatedProvider: UpdatedUser): Promise<ServerMessages> {
        if (
            updatedProvider.billingInformation == null ||
            updatedProvider.billingInformation == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


        //Billing Data Validations
        if (updatedProvider.billingInformation.businessName == "") {
            errorsData.push(new ServerMessages(true, 'Nombre del negocio invalido', 15));
        }
        if (updatedProvider.billingInformation.rfc.length < 5/* !reRFC.test(String(updatedUser.billingInformation.rfc).toLowerCase()) */) {
            errorsData.push(new ServerMessages(true, 'Ingrese un RFC valido', 16));
        }
        if (!rePhone.test(String(updatedProvider.billingInformation.phoneBilling).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Teléfono de facturación invalido', 17));
        }
        if (!reEmail.test(String(updatedProvider.billingInformation.emailBilling).toLowerCase())) {
            errorsData.push(new ServerMessages(true, 'Correo electrónico de la facturación invalido', 18));
        }
        if (updatedProvider.billingInformation.state == "") {
            errorsData.push(new ServerMessages(true, 'Estado de la facturación invalido', 19));
        }
        if (updatedProvider.billingInformation.city == "") {
            errorsData.push(new ServerMessages(true, 'Ciudad de la facturación invalida', 20));
        }
        if (updatedProvider.billingInformation.postalCode == "") {
            errorsData.push(new ServerMessages(true, 'Codigo postal de la facturación invalido', 21));
        }
        if (updatedProvider.billingInformation.colony == "") {
            errorsData.push(new ServerMessages(true, 'Colonia de la facturación invalida', 22));
        }
        if (updatedProvider.billingInformation.street == "") {
            errorsData.push(new ServerMessages(true, 'Calle  de la facturación invalida', 23));
        }
        if (updatedProvider.billingInformation.number == "") {
            errorsData.push(new ServerMessages(true, 'Numero de la facturación invalida', 24));
        }

        if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos de facturación inválidos', errorsData);
        }

        //Validación único email
        var alreadyUserEmail: User = await this.userRepository.findOne<User>({
            where: {
                idUser: { [Op.ne]: updatedProvider.idUser },
                deleted: false,
                email: updatedProvider.email
            },
        });

        if (alreadyUserEmail) {
            return new ServerMessages(true, 'Correo actualmente registrado', {});
        }

        var providerToUpdate: User = await this.userRepository.findOne<User>({
            where: {
                idUser: updatedProvider.idUser,
                deleted: false,
                userType: 1
            },
        });

        if (!providerToUpdate) {
            return new ServerMessages(true, 'El proveedor no esta disponible', {});
        }

        try {
            //Billing Information
            providerToUpdate.businessName = updatedProvider.billingInformation.businessName.toUpperCase();
            providerToUpdate.rfc = updatedProvider.billingInformation.rfc.toUpperCase();
            providerToUpdate.phoneBilling = updatedProvider.billingInformation.phoneBilling;
            providerToUpdate.emailBilling = updatedProvider.billingInformation.emailBilling.toLowerCase();
            providerToUpdate.state = updatedProvider.billingInformation.state;
            providerToUpdate.city = updatedProvider.billingInformation.city;
            providerToUpdate.postalCode = updatedProvider.billingInformation.postalCode;
            providerToUpdate.colony = updatedProvider.billingInformation.colony;
            providerToUpdate.street = updatedProvider.billingInformation.street;
            providerToUpdate.number = updatedProvider.billingInformation.number;

            await providerToUpdate.save();

            return new ServerMessages(false, 'Proveedor actualizado con éxito', updatedProvider);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error actualizando el Proveedor', error);
        }
    }

    async addDirectionProvider(newDirection: Direction): Promise<ServerMessages> {
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

    async saveDirectionsProvider(dataDirections: Direction[]): Promise<ServerMessages> {
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

    async updateProviderPassword(
        idProvider,
    ): Promise<ServerMessages> {

        if (!idProvider) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let user = await this.userRepository.findOne<User>({
            where: {
                idUser: idProvider,
                deleted: false
            },
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

    async desactiveProvider(idProvider: string): Promise<ServerMessages> {
        if (
            idProvider == undefined ||
            idProvider == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        try {
            //Validación cliente activo
            var providerToDesactive: User = await this.userRepository.findOne<User>({
                where: {
                    idUser: idProvider,
                    deleted: false
                },
                include: [{
                    model: Direction,
                    as: "directions"
                }]
            });

            if (!providerToDesactive) {
                return new ServerMessages(true, 'El usuario no esta disponible', {});
            }

            providerToDesactive.active = !providerToDesactive.active;
            await providerToDesactive.save();

            return new ServerMessages(false, 'Proveedor ' + (providerToDesactive.active == true ? 'activado' : 'desactivado') + ' con éxito', {});
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error desactivando el proveedor', error);
        }
    }
}
