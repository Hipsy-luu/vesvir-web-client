import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { User , Direction} from '../../../../classes/user.class';
import { dataCustomer } from './provider';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ApiLiveDataService } from '../../../../services/apiLiveData/api-live-data.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  userData: User = new User();
  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };

  newPassword : string = "";
  confirmPassword : string = "";

  constructor(private _location: Location,private utilitiesService:UtilitiesService,public dataSessionService: DataSessionService,
    private apiDataService : ApiDataService) { 
      this.userData = new User();
      this.userData.directions.push(new Direction());
  }

  async ngOnInit() {
    this.userData = new User();
    this.userData.directions.push(new Direction());
    this.newPassword = "";
    this.confirmPassword = "";

    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      if (this.dataSessionService.user.userType == 0 ) {
        console.log("es admin");
        this.dataSessionService.navigateByUrl("/dashboard-admin/home");
      } else if (this.dataSessionService.user.userType == 1 ) {
        console.log("es provedor");
        this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user));

        //Date  fixes
        this.userData.birthDay = new Date(this.userData.birthDay);
        this.userData.createDate = new Date(this.userData.createDate);
        this.userData.lastLogin = new Date(this.userData.lastLogin);

        this.modelCustomerBirthDay = {
          year: this.userData.birthDay.getFullYear(),
          month: parseInt(this.userData.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
          day: parseInt(this.userData.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
        }
      }else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      }else{
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      console.log(noLoginResponse);
    });
  }

  save(){
    //BirthDay Fix
    this.userData.birthDay = new Date(this.modelCustomerBirthDay.year+"-"+this.modelCustomerBirthDay.month+"-"+this.modelCustomerBirthDay.day);

    this.apiDataService.updateUser(this.userData).then((response : ServerMessage)=>{
      console.log("exito");
      //console.log(response);
      if(response.error == true){
        if(response.message.includes("Campos de") == true){
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message,"Error");
          }
        }else{
          this.utilitiesService.showWarningToast(response.message,"Error");
        }
      }else if(response.error == false){
        this.utilitiesService.showSuccessToast(response.message,"Éxito");
        /* this.userData = JSON.parse(JSON.stringify(response.data));
        this.userData = JSON.parse(JSON.stringify(response.data)); */
        this.dataSessionService.user = response.data;
      }
    }).catch(error =>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error","Error")
    });
  }

  changePassword(){
    if(this.newPassword.length < 8){
      this.utilitiesService.showWarningToast("La contraseña no puede ser menor de 8 caracteres", "Contraseña invalida");
    }else if(this.newPassword != this.confirmPassword){
      this.utilitiesService.showWarningToast("La contraseña no coincide", "Contraseña invalida");
    }else{
      this.apiDataService.changePasswordUser(this.userData.idUser,this.newPassword).then((response : ServerMessage)=>{
      if(response.error == true){
        this.utilitiesService.showWarningToast(response.message,"Error");
      }else if(response.error == false){
        this.utilitiesService.showSuccessToast(response.message,"Éxito");
        this.newPassword = "";
        this.confirmPassword = "";
      }
    }).catch(error =>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error","Error")
    });
    }
  }
  
  backClicked() {
    this._location.back();
  }

}
