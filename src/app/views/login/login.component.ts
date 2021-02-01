import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { LoggedResponse } from '../../classes/loggedResponse.class';
import { ServerMessage } from '../../classes/serverMessage.class';
import { Validators } from '@angular/forms';
import { User } from '../../classes/user.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  email: string;
  password: string;

  loginform = true;
  recoverform = false;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.clearData();
    // this.dataSessionService.logOut();
    // console.log(this.dataSessionService.user);
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0 ) {
        console.log("es admin");
        //this.utilitiesService.showSuccessToast( logedResponse.message,"Exito!");
        this.dataSessionService.navigateByUrl("/dashboard-admin/home");
      } else if (this.dataSessionService.user.userType == 1 ) {
        console.log("es provedor");
        //this.utilitiesService.showSuccessToast( logedResponse.message,"Exito!");
        this.dataSessionService.navigateByUrl("/dashboard-provider/home");
      }else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      }else{
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      //console.log(noLoginResponse);
    });
  }

  clearData() {
    this.email = "luismi.luu@gmail.com";
    this.password = "qwertyuiop";
  }

  validateLoginData(): Boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(this.email).toLowerCase()) ) {
      this.utilitiesService.showInfoToast( "Correo invalido.");
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.showInfoToast("Contraseña invalida.");
      return false;
    } else {
      return true;
    }
  }

  loginUser() {
    if (this.validateLoginData()) {
      this.dataSessionService.loginUser(this.email, this.password).then((response: ServerMessage) => {
        //console.log(response);
        if(response.error == true){
          this.utilitiesService.showErrorToast( response.message,"Error!");
        }else if(response.error == false){
          //load user data
          this.clearData();
          this.dataSessionService.setUserData(response.data.user);
          if (this.dataSessionService.user.userType != 0 && this.dataSessionService.user.userType != 1 && this.dataSessionService.user.userType != 2) {
            this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
            this.dataSessionService.logOut();
          } else if (this.dataSessionService.user.userType == 0 ) {
            console.log("es admin");
            this.utilitiesService.showSuccessToast( response.message,"Exito!");
            this.dataSessionService.navigateByUrl("/dashboard-admin/home");
          } else if (this.dataSessionService.user.userType == 1 ) {
            console.log("es provedor");
            this.utilitiesService.showSuccessToast( response.message,"Exito!");
            this.dataSessionService.navigateByUrl("/dashboard-provider/home");
          }else if (this.dataSessionService.user.userType == 2) {
            this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
            this.dataSessionService.logOut();
          }
        }
        
      }, (error) => {
        //console.log(error);
        this.utilitiesService.showErrorToast( error.message, "Error!");
      });
    }
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
}
