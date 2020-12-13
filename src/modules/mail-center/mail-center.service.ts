import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { ServerMessages } from '../../utils/serverMessages.util';

@Injectable()
export class MailCenterService {
    constructor(
        private readonly mailerService: MailerService,
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
    ) { }

    //EMAILS
  async sendWelcomeEmail(userName: string, newEmail: string, newPassword: string): Promise<ServerMessages> {
    return new Promise(async (resolve, reject) => {
      try {
        //toEmails = es una variable donde pasas los emails separados por coma

        this.mailerService.sendMail({
          to: 'api.test.beneficiarios@gmail.com,' + newEmail, // list of receivers string separado por comas
          from: 'api.test.beneficiarios@gmail.com', // sender address
          subject: "✔ Bienvenido a Vesvir " /* + userName */,// Subject line
          //text: 'welcome', // plaintext body
          //html: '<b>email : {{email}} . password : {{password}}</b>', /* welcomeEmail,  */ // HTML body content 
          template: "welcome", // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
          context: {  // Data to be sent to template engine.
            email: newEmail,
            password: newPassword,
          },
          // encoded string as an attachment
          /* attachments: [
            {   
              // encoded string as an attachment
              filename: 'acuse-' + data.idRespuestas + '.pdf',
              path: 'data:application/pdf;base64,'+data.pdfBase64
            },
          ] */
        })
          .then((success) => {
            resolve(new ServerMessages(false, "Email enviado con éxito", success));
          })
          .catch((error) => {
            /* console.log("ERROR ----------------------------------"); */
            /* console.log(error); */
            resolve(new ServerMessages(true, "Error enviando correo", error));
          });
      } catch (error) {
        resolve(new ServerMessages(true, "Error 2 enviando correo", error));
      }
    })
  }

    async sendChangePasswordEmail(userName: string, newEmail: string, newPassword: string): Promise<ServerMessages> {
        return new Promise(async (resolve, reject) => {
            try {
                //toEmails = es una variable donde pasas los emails separados por coma

                this.mailerService.sendMail({
                    to: 'api.test.beneficiarios@gmail.com,' + newEmail, // list of receivers string separado por comas
                    from: 'api.test.beneficiarios@gmail.com', // sender address
                    subject: "✔ Se a cambiado su contraseña" /* + userName */,// Subject line
                    //text: 'welcome', // plaintext body
                    //html: '<b>email : {{email}} . password : {{password}}</b>', /* welcomeEmail,  */ // HTML body content 
                    template: "recovery", // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
                    context: {  // Data to be sent to template engine.
                        nameUser: userName,
                        password: newPassword,
                    },
                    // encoded string as an attachment
                    /* attachments: [
                      {   
                        // encoded string as an attachment
                        filename: 'acuse-' + data.idRespuestas + '.pdf',
                        path: 'data:application/pdf;base64,'+data.pdfBase64
                      },
                    ] */
                })
                    .then((success) => {
                        resolve(new ServerMessages(false, "Email enviado con éxito", success));
                    })
                    .catch((error) => {
                        /* console.log("ERROR ----------------------------------"); */
                        /* console.log(error); */
                        resolve(new ServerMessages(true, "Error enviando correo", error));
                    });
            } catch (error) {
                resolve(new ServerMessages(true, "Error 2 enviando correo", error));
            }
        })
    }
}
