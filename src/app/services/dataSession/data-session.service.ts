import { UtilitiesService } from './../utilities/utilities.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../classes/user.class';
import { ApiDataService } from '../apiData/api-data.service';
import { ServerMessage } from '../../classes/serverMessage.class';
import { LoggedResponse } from '../../classes/loggedResponse.class';

//MENUS
import { ADMINMENU } from './menu-items';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {

  token: String;
  alreadyLoged: Boolean = false;

  user: User;
  baseURL: String;

  public sidebarNavItemsAdmin: any[];

  constructor(private apiDataService: ApiDataService, private route: Router,private utilitiesService : UtilitiesService) {
    this.token = "";
    this.user = new User();
    this.baseURL = apiDataService.baseURL;
    //localStorage.setItem('token', JSON.stringify(this.token));
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
      this.apiDataService.setToken(this.token);
      //Acciones a realizar cuando el token estaba ya guardado pero la data para la interfaz no esta disponible
      //Se sabe que no esta disponible porque apenas se mando llamar el contructor
      if (this.token.length > 0) {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            console.log(response);
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
          } else {
            this.setUserData(response.data.user);
            
            if (this.user.userType != 0 && this.user.userType != 1 && this.user.userType != 2) {
              this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
              this.logOut();
            } else if (this.user.userType == 0 ) {
              console.log("es admin");
              this.getAdminMenu();
            } else if (this.user.userType == 1 ) {
              console.log("es provedor");

            }else if (this.user.userType == 2) {
              this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
              this.logOut();
            }
            /* console.log(this.user); */
          }
        }, (error) => {
          console.log(error);
        });

      };
    }
  }

  navigateByUrl(url: String) {
    this.route.navigateByUrl(url.toString());
  }

  checkLogin(successCallBack, errorCallBack) {
    //console.log(this.token);
    if (this.token == "") {
      errorCallBack(new LoggedResponse(true, "Sin token"))
    } else {
      this.apiDataService.setToken(this.token);
      //console.log(this.user);
      if (this.user.email == "") {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            this.navigateByUrl("/login");
            errorCallBack(new LoggedResponse(false, response.message))
          } else {
            //Obtain user sesión data
            this.setUserData(response.data.user);
            //this.getUserImage();
            successCallBack(new LoggedResponse(false, "Con token y usuario actualizado"));
            //console.log(this.user);
          }
        }, (error) => {
          console.log(error);
          errorCallBack(new LoggedResponse(true, "A ocurrido un error"));
        });
      } else {
        //Obtain user sesión data
        //this.getUserImage();
        if (this.user.userType == 0 ) {
          this.getAdminMenu();
        } else if (this.user.userType == 1 ) {
          //console.log("es provedor");
        }
        successCallBack(new LoggedResponse(false, "Sesión Con token e información de usuario"));
      }
    }
  }

  loginUser(email: String, password: String) {
    return new Promise((resolve, reject) => {
      this.apiDataService.doLogin(email, password).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          //Lógica con la que guardamos los datos del inicio de sesión
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.token = response.data.token;
          this.apiDataService.setToken(this.token);
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  setUserData(updatedData: any) {
    this.user.idUser = updatedData.idUser;
    this.user.name = updatedData.name;
    this.user.surnames = updatedData.surnames;
    this.user.email = updatedData.email;
    /* this.user.birthDay = updatedData.idUser; */
    this.user.phone = updatedData.phone;
    this.user.gender = updatedData.gender;
    this.user.actualPreference = updatedData.actualPreference;
    this.user.userType = updatedData.userType;
    /* this.user.createDate = updatedData.idUser; */
    /* this.user.lastLogin = updatedData.idUser; */
    this.user.deleted = updatedData.deleted;
    this.user.active = updatedData.active;
    this.user.conektaClientId = updatedData.conektaClientId;
    this.user.userFacebookImage = updatedData.userFacebookImage;

    //Date  fixes
    this.user.birthDay = new Date(updatedData.birthDay);
    this.user.createDate = new Date(updatedData.createDate);
    this.user.lastLogin = new Date(updatedData.lastLogin);

    //Data billing fixes
    this.user.billingInformation.businessName = updatedData.businessName;
    this.user.billingInformation.rfc = updatedData.rfc;
    this.user.billingInformation.phoneBilling = updatedData.phoneBilling;
    this.user.billingInformation.emailBilling = updatedData.emailBilling;
    this.user.billingInformation.state = updatedData.state;
    this.user.billingInformation.city = updatedData.city;
    this.user.billingInformation.postalCode = updatedData.postalCode;
    this.user.billingInformation.colony = updatedData.colony;
    this.user.billingInformation.street = updatedData.street;
    this.user.billingInformation.number = updatedData.number;

    this.user.directions = updatedData.directions;


    if (this.user.userType == 0 ) {
      this.getAdminMenu();
    } else if (this.user.userType == 1 ) {
      //console.log("es provedor");
    }
  }

  getUserImage() {
    //En caso de tener imagen
    //if (this.user.haveImage == true) {
    //  /* this.apiDataService.getImage(this.baseURL.toString() +
    //    'uploads/user-image/' + this.user.idUser.toString()).then((image : string) => {
    //      this.user.imageBlob = image;
    //      succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
    //    }, (error) => {
    //      console.log(error);
    //      this.user.imageBlob = "";
    //      errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
    //    }); */
    //    succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
    //} else {
    //  succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
    //}
  }

  logOut() {
    this.user = new User();
    localStorage.setItem('token', "");
    this.token = localStorage.getItem('token');
    this.route.navigateByUrl('/');
  }

  //MENUS
  getAdminMenu() {
    this.sidebarNavItemsAdmin = ADMINMENU/* .filter(sidebarnavItem => sidebarnavItem) */;
    this.apiDataService.getCategoriesMenuAdminData().then((response: ServerMessage) => {
      this.sidebarNavItemsAdmin[2].submenu = response.data;
      //console.log(this.sidebarNavItemsAdmin[2].submenu);
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }
}
