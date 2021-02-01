import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { User, Direction } from '../../../../classes/user.class';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { ActivatedRoute } from '@angular/router';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @ViewChild("modalDirection") modalDirection;
  @ViewChild("modalConfirmDirectionDelete") modalConfirmDirectionDelete;
  @ViewChild("modalConfirmUserDelete") modalConfirmUserDelete;
  @ViewChild("modalResetPasswordUser") modalResetPasswordUser;

  customer: User = new User();
  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };
  selectedDirection: Direction = new Direction();

  constructor(public dataSessionService: DataSessionService, private _location: Location, private modalService: NgbModal,
    private utilitiesService: UtilitiesService, private activatedRoute: ActivatedRoute, private apiDataService: ApiDataService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.customer = new User();
      this.selectedDirection = new Direction();
      this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
        //console.log(logedResponse);
        if (this.dataSessionService.user.userType == 0) {
          //Cosas para hacer si es admin
          console.log("es admin");
          let idCustomer: number = parseInt(params.get('idCustomer'));

          if (idCustomer == null || idCustomer == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard-admin/customers/customers");
          } else {
            this.loadData(idCustomer);
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

  loadData(idCustomer: number) {
    this.customer = new User();
    this.selectedDirection = new Direction();
    this.apiDataService.getCustomerData(idCustomer).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == true) {
        //this.utilitiesService.showWarningToast(response.message, "Error");
        this.dataSessionService.navigateByUrl("/dashboard-admin/customers/customers");
      } else if (response.error == false) {
        response.data.birthDay = new Date(response.data.birthDay);
        response.data.createDate = new Date(response.data.createDate);
        response.data.lastLogin = new Date(response.data.lastLogin);
        this.customer = response.data;
        this.modelCustomerBirthDay = {
          year: this.customer.birthDay.getFullYear(),
          month: parseInt(this.customer.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
          day: parseInt(this.customer.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
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

  openModalConfirmDeleteUser() {
    this.modalService.open(this.modalConfirmUserDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
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
    this.customer.directions = this.customer.directions.filter((direction) => {
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
    for (let index = 0; index < this.customer.directions.length; index++) {
      this.customer.directions[index].default = false;

      if (this.customer.directions[index].idDirection == this.selectedDirection.idDirection) {
        this.customer.directions[index].default = this.selectedDirection.default;
      }

      if (this.customer.directions[index].default == true) {
        haveDefault = true;
      }
    }

    if (this.customer.directions.length != 0 && haveDefault == false) {
      this.customer.directions[0].default = true;
    }
  }

  backClicked() {
    this._location.back();
  }

  saveCustomerInformation() {
    //BirthDay Fix
    this.customer.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    //console.log(this.customer);

    if(this.customer.userType == 2){
      this.apiDataService.updateCustomerAccountData(this.customer).then((response: ServerMessage) => {
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
          this.loadData(this.customer.idUser);
  
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }else{
      this.apiDataService.updateCustomerBillingData(this.customer).then((response: ServerMessage) => {
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
          this.apiDataService.updateCustomerAccountData(this.customer).then((response: ServerMessage) => {
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
              this.loadData(this.customer.idUser);
      
            }
          }).catch(error => {
            console.log("error");
            console.log(error);
            this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
          });
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
    
  }

  saveCustomerBilling() {
    //BirthDay Fix
    this.customer.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    //console.log(this.customer);

    this.apiDataService.updateCustomerBillingData(this.customer).then((response: ServerMessage) => {
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
        this.loadData(this.customer.idUser);

      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  addDirection() {
    this.selectedDirection.idUser = this.customer.idUser;

    this.apiDataService.addDirectionCustomer(this.selectedDirection).then((response: ServerMessage) => {
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
        this.loadData(this.customer.idUser);
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

    let indexUpdate = this.customer.directions.findIndex((direction: Direction) => {
      return direction.idDirection == this.selectedDirection.idDirection;
    });
    let tempDirections: Direction[] = [...this.customer.directions]
    tempDirections[indexUpdate] = JSON.parse(JSON.stringify(this.selectedDirection));

    this.apiDataService.saveDirectionsCustomer(tempDirections).then((response: ServerMessage) => {
      console.log("exito");
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
        this.loadData(this.customer.idUser);
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
    this.apiDataService.changePasswordCustomer(this.customer.idUser).then((response: ServerMessage) => {
      console.log(response);

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

  deleteCustomer() {
    this.apiDataService.deleteCustomer(this.customer.idUser).then((response: ServerMessage) => {
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.modalService.dismissAll();
        this.loadData(this.customer.idUser);
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }
}
