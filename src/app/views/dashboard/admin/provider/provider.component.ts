import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { User , Direction} from '../../../../classes/user.class';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ActivatedRoute } from '@angular/router';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {

  @ViewChild("modalDirection") modalDirection;
  @ViewChild("modalConfirmDirectionDelete") modalConfirmDirectionDelete;
  @ViewChild("modalResetPasswordUser") modalResetPasswordUser;
  @ViewChild("modalConfirmProviderDelete") modalConfirmProviderDelete;

  provider: User = new User();
  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };
  selectedDirection: Direction = new Direction();

  constructor(public dataSessionService: DataSessionService, private _location: Location, private modalService: NgbModal,
    private utilitiesService: UtilitiesService, private activatedRoute: ActivatedRoute, private apiDataService: ApiDataService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.provider = new User();
      this.provider.directions.push(new Direction());

      this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
        //console.log(logedResponse);
        if (this.dataSessionService.user.userType == 0) {
          //Cosas para hacer si es admin
          console.log("es admin");
          let idProvider: number = parseInt(params.get('idProvider'));

          if (idProvider == null || idProvider == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard-admin/providers");
          } else {
            this.loadData(idProvider);
          }
        } else if (this.dataSessionService.user.userType == 1) {
          console.log("es provedor");
          this.dataSessionService.navigateByUrl("/dashboard-provider/home");
        } else if (this.dataSessionService.user.userType == 2) {
          this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
          this.dataSessionService.logOut();
        } else {
          this.utilitiesService.showErrorToast("Usuario desconocido.", "Error!");
          this.dataSessionService.logOut();
        }
      }, (noLoginResponse: LoggedResponse) => {
        //console.log(noLoginResponse);
        this.dataSessionService.logOut();
      });
    });
  }

  async ngOnInit() {
  }

  loadData(idProvider: number) {
    this.provider = new User();
    this.provider.directions.push(new Direction());

    this.apiDataService.getProviderData(idProvider).then((response: ServerMessage) => {
      //console.log(response.data.directions);
      if (response.error == true) {
        //this.utilitiesService.showWarningToast(response.message, "Error");
        this.dataSessionService.navigateByUrl("/dashboard-admin/providers");
      } else if (response.error == false) {
        response.data.birthDay = new Date(response.data.birthDay);
        response.data.createDate = new Date(response.data.createDate);
        response.data.lastLogin = new Date(response.data.lastLogin);
        this.provider = response.data;
        this.modelCustomerBirthDay = {
          year: this.provider.birthDay.getFullYear(),
          month: parseInt(this.provider.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
          day: parseInt(this.provider.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
        }
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");

    });
  }

  openModalEditDirection(direction /* modalDirection */) {
    this.selectedDirection = JSON.parse(JSON.stringify(direction));

    this.modalService.open(this.modalDirection, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalAddDirection() {
    this.selectedDirection = new Direction();

    this.modalService.open(this.modalDirection, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalResetPassword( /* modalDirection */) {
    this.modalService.open(this.modalResetPasswordUser, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteProvider() {
    this.modalService.open(this.modalConfirmProviderDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteDirection() {
    this.modalService.open(this.modalConfirmDirectionDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDeleteDirection(directionId) {
    this.provider.directions = this.provider.directions.filter((direction) => {
      return direction.idDirection != directionId;
    });

    this.apiDataService.deleteDirectionsCustomer(this.selectedDirection.idDirection).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
        console.log(response);
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        //this.modalService.dismissAll();
        this.saveDirections(1);


      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });

  }

  setDefaultDirection() {
    let haveDefault = false;
    for (let index = 0; index < this.provider.directions.length; index++) {
      this.provider.directions[index].default = false;

      if (this.provider.directions[index].idDirection == this.selectedDirection.idDirection) {
        this.provider.directions[index].default = this.selectedDirection.default;
      }

      if (this.provider.directions[index].default == true) {
        haveDefault = true;
      }
    }

    if (this.provider.directions.length != 0 && haveDefault == false) {
      this.provider.directions[0].default = true;
    }
  }

  backClicked() {
    this._location.back();
  }

  saveProviderInformation() {
    //BirthDay Fix
    this.provider.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    //console.log(this.provider);

    this.apiDataService.updateProviderAccountData(this.provider).then((response: ServerMessage) => {
      console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData(this.provider.idUser);

      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }



  saveProviderBilling() {
    //BirthDay Fix
    this.provider.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    //console.log(this.provider);

    this.apiDataService.updateProviderBillingData(this.provider).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData(this.provider.idUser);

      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  addDirection() {
    this.selectedDirection.idUser = this.provider.idUser;

    this.apiDataService.addDirectionCustomer(this.selectedDirection).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.loadData(this.provider.idUser);
        this.selectedDirection = new Direction();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  saveDirections(opc: number) {
    this.setDefaultDirection();

    let indexUpdate = this.provider.directions.findIndex((direction: Direction) => {
      return direction.idDirection == this.selectedDirection.idDirection;
    });
    let tempDirections: Direction[] = [...this.provider.directions]
    tempDirections[indexUpdate] = JSON.parse(JSON.stringify(this.selectedDirection));

    console.log();
    
    this.apiDataService.saveDirectionsProvider(tempDirections).then((response: ServerMessage) => {
      console.log(response);
      if (response.error == true) {
        if (response.message.includes("Campos de") == true) {
          for (let index = 0; index < response.data.length; index++) {
            this.utilitiesService.showWarningToast(response.data[index].message, "Error");
          }
        } else {
          this.utilitiesService.showWarningToast(response.message, "Error");
          console.log(response);
        }
      } else if (response.error == false) {
        if (opc == 0) {
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
        }
        this.loadData(this.provider.idUser);
        this.selectedDirection = new Direction();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  changePassword() {
    this.apiDataService.changePasswordProvider(this.provider.idUser).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  desactiveProvider() {
    this.apiDataService.desactiveProvider(this.provider.idUser).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.modalService.dismissAll();
        this.loadData(this.provider.idUser);
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

}
