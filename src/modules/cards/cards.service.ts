import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { ServerMessages } from '../../utils/serverMessages.util';
import { Card } from '../../models/cards.entity';

import { conektaConf } from './../../conf/conekta.conf';
import * as conekta from 'conekta';

conekta.api_key = conektaConf.api_key;
conekta.locale = conektaConf.locale;
conekta.api_version = conektaConf.api_version;

@Injectable()
export class CardsService {
    conekta;

    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('CardRepository') private readonly cardRepository: typeof Card,
        private mailCenterService: MailCenterService,
    ) {
        this.conekta = conekta;
    }


    //API coneckta functions
    async createCustomer(userData: User, cardData: Card): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.create({
                'name': userData.name + " " + userData.surnames,
                'email': userData.email,
                'phone': '+52' + userData.phone,
                /* 'metadata': { 'description': 'Compra de creditos: 300(MXN)', 'reference': '1334523452345' }, */
                /* 'payment_sources': [{
                    'type': 'card',
                    'token_id': cardData.token
                }] */
            }, (err, customer) => {
                if (err) {
                    /* console.log("entro");
                    console.log(err); */
                    resolve(err);
                } else {
                    resolve(customer.toObject());
                }
            });
        });
    }

    async addCardToCustomer(conektaIdCustomer: string, cardData: Card): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(conektaIdCustomer, (err, customer) => {
                if (err) {
                    resolve(err);
                } else {
                    customer.createPaymentSource({
                        type: "card",
                        token_id: cardData.token/* "tok_test_visa_4242" */
                    }, function (err, card) {
                        if (err) {
                            /* console.log("entro err 2 ");
                            console.log(err); */
                            resolve(err);
                        } else {
                            //console.log(card);
                            resolve(card);
                        }
                    });
                }
            });
        });
    }

    async deleteCardToCustomer(conektaIdCustomer: string, cardData: Card): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(conektaIdCustomer, (err, customer) => {
                if (err) {
                    resolve(err);
                } else {
                    let cardsConekta: [] = customer.payment_sources.toObject().data;
                    //console.log(cardsConekta);

                    let indexCardFinded = cardsConekta.findIndex((card: any) => {
                        return card.id == cardData.token;
                    });

                    //console.log(cardsConekta[indexCardFinded]);

                    if (indexCardFinded == -1) {
                        resolve({ object: "error", message: "no se encuantra la tarjeta" });
                    } else {
                        customer.payment_sources.get(indexCardFinded).delete(function (err, resp) {
                            if (err) {
                                //console.log("entro err eli 2 ");
                                //console.log(err);
                                resolve(err);
                            } else {
                                //console.log("simonki");
                                //console.log(resp);
                                resolve(resp);
                            }
                        });
                    }

                }
            });
        });
    }

    async addNewCustomerCard(idUser: number, newCard: Card): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            /* newCard.idCard == undefined ||
            newCard.idCard == null || */
            newCard.idUser == undefined ||
            newCard.idUser == null ||
            newCard.brand == undefined ||
            newCard.brand == null ||
            newCard.lastFour == undefined ||
            newCard.lastFour == null ||
            newCard.token == undefined ||
            newCard.token == null ||
            newCard.createdAt == undefined ||
            newCard.createdAt == null ||
            newCard.deleted == undefined ||
            newCard.deleted == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsData = [];
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const rePhone = /^[0-9]{10}$/;
        /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */


        //Directions Data Validations
        if (newCard.brand == "") {
            errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
        }
        if (newCard.lastFour == "") {
            errorsData.push(new ServerMessages(true, 'Apellidos inválidos', 2));
        }
        if (newCard.token == "") {
            errorsData.push(new ServerMessages(true, 'Calle invalida', 3));
        }

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

        let newClient: boolean = false;
        //Si el cliente aun no tiene asignado un id en conecta se lo asignamos creandole uno
        if (userToUpdate.conektaClientId == "" || userToUpdate.conektaClientId.length == 0) {
            //Si no tiene aun un token se le crea uno porque significa que aun no se da de alta en la api de conekta

            let customerConekta: any = await this.createCustomer(userToUpdate, newCard);

            //Si el cliente aun no esta registrado en nuestra cuenta de conekta
            if (customerConekta.object == "error") {
                return new ServerMessages(true, 'Error creando el id de conekta del cliente', customerConekta);
            } else {
                try {
                    userToUpdate.conektaClientId = customerConekta.id;
                    await userToUpdate.save();

                    newClient = true;
                } catch (error) {
                    return new ServerMessages(false, 'Error guardando id del cliente', error);
                }
            }
        }

        //Se crea la tarjeta en conekta
        let responseCreateCard: any = await this.addCardToCustomer(userToUpdate.conektaClientId, newCard);

        if (responseCreateCard.object == "error") {
            return new ServerMessages(true, 'Error añadiendo la nueva tarjeta', responseCreateCard);
        } else {
            var newCard: Card = await this.cardRepository.create<Card>({
                idUser: idUser,
                brand: newCard.brand,
                lastFour: newCard.lastFour,
                token: responseCreateCard.id,
                createdAt: new Date(),
                deleted: false,
            }, {});

            if (newClient == true) {
                return new ServerMessages(false, 'Cliente creado y tarjeta añadida con éxito', newCard/* userToUpdate */);
            } else {
                return new ServerMessages(false, 'Tarjeta añadida con éxito', newCard/* userToUpdate */);
            }
        }
    }

    async deleteCustomerCard(idUser: number, idCard: string): Promise<ServerMessages> {
        if (
            idUser == undefined ||
            idUser == null ||
            idCard == undefined ||
            idCard == null
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }
        //console.log(idDirection);

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

        var cardToDelete: Card = await this.cardRepository.findOne<Card>({
            where: {
                idCard: idCard,
                deleted: false,
                idUser: idUser
            },
        });

        if (!cardToDelete) {
            return new ServerMessages(true, 'La tarjeta no esta disponible', {});
        }

        try {


            //Si el cliente aun no esta registrado en nuestra cuenta de conekta
            if (userToUpdate.conektaClientId.length == 0 || userToUpdate.conektaClientId == "") {
                return new ServerMessages(true, 'El cliente aun no cuenta con un id ce conekta', {});
            } else {
                try {
                    let resultDeleteCardConekta: any = await this.deleteCardToCustomer(userToUpdate.conektaClientId, cardToDelete);

                    //console.log(resultDeleteCardConekta);
                    if (resultDeleteCardConekta.object == "error") {
                        return new ServerMessages(true, 'Error eliminando la tarjeta de conekta del cliente', resultDeleteCardConekta);
                    } else {
                        try {
                            

                            var cardToDelete2: Card = await this.cardRepository.findOne<Card>({
                                where: {
                                    /* idCard: idCard, */
                                    deleted: false,
                                    idUser: idUser,
                                    token : resultDeleteCardConekta.id,
                                },
                            });
                    
                            if (!cardToDelete2) {
                                return new ServerMessages(true, 'La tarjeta no esta disponible', {});
                            }else{
                                cardToDelete2.deleted = true;
                                await cardToDelete2.save();
    
                                return new ServerMessages(false, 'Tarjeta eliminada con éxito', cardToDelete);
                            }
                        } catch (error) {
                            return new ServerMessages(false, 'Error eliminando tarjeta del cliente', error);
                        }
                    }
                } catch (error) {
                    return new ServerMessages(false, 'Error eliminando la tarjeta del cliente', error);
                }
            }
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error eliminando la tarjeta del usuario', error);
        }
    }
}
