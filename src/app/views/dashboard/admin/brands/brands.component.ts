import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';
import { Brand } from '../../../../classes/brand.class';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};

  searchValue: String = "";

  brandsList: Brand[];
  brandsFiltered: Brand[];

  selectedBrand: Brand;

  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild("modalAddBrand") modalAddBrand;
  @ViewChild("modalConfirmDeleteCategory") modalConfirmDeleteCategory;

  constructor(private modalService: NgbModal, private apiDataService: ApiDataService, public dataSessionService: DataSessionService,
    private utilitiesService: UtilitiesService) {
    this.brandsList = [];
    this.brandsFiltered = Array.from(this.brandsList);
    this.selectedBrand = new Brand();
  }

  async ngOnInit() {
    this.dataSessionService.checkLogin(async (logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0) {
        //Cosas para hacer si es admin
        console.log("es admin");
        /* await this.utilitiesService.sleep(1000);
        this.openModalAddCategory(); */
        this.loadData();
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
  }

  ////////Search and filter functions

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.brandsFiltered = Array.from(this.brandsList);
    } else {
      this.brandsFiltered = this.brandsList.filter(function (category) {
        let fixed = category.name.charAt(0).toUpperCase() + event.slice(1);
        return category.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  ////////////////
  openModalAddBrand() {
    this.cancelImage();
    this.selectedBrand = new Brand();
    this.modalService.open(this.modalAddBrand, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalEditBrand(brand: Brand) {
    this.cancelImage();
    this.selectedBrand = JSON.parse(JSON.stringify(brand));
    let indexFind = this.brandsList.findIndex((brand) => {
      return brand.idBrand == this.selectedBrand.idBrand;
    });

    this.selectedBrand.imageBlob = this.brandsList[indexFind].imageBlob;

    this.modalService.open(this.modalAddBrand, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteBrand(brand: Brand) {
    this.selectedBrand = JSON.parse(JSON.stringify(brand));

    this.modalService.open(this.modalConfirmDeleteCategory, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // If the input has changed(file picked) we project the file into the img previewer
  updateSource($event: Event) {
    // We access he file with $event.target['files'][0]
    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      this.source = e.target.result;
      this.onChange.emit(file);
      this.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.source = "";
    this.selectedBrand.haveImage = false;
  }


  async loadData() {
    this.brandsList = [];
    this.brandsFiltered = Array.from(this.brandsList);
    this.cancelImage();
    this.selectedBrand = new Brand();

    this.apiDataService.getBrandsListData().then(async (response: ServerMessage) => {
      //console.log(response);
      for (let index = 0; index < response.data.length; index++) {
        response.data[index].createDate = new Date(response.data[index].createDate);
      }
      this.brandsList = [...response.data];
      for (let index = 0; index < this.brandsList.length; index++) {
        if (this.brandsList[index].haveImage == true) {
          this.brandsList[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/brand-image/' + this.brandsList[index].idBrand.toString());
        }
      }

      //console.log(this.brandsList);

      this.brandsFiltered = Array.from(this.brandsList);
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }

  addBrand() {
    if (this.source.length > 0) {
      console.log("imagen diferente");
      this.apiDataService.createBrand(this.selectedBrand).then((response: ServerMessage) => {
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
          this.uploadImage(this.selectedFile, "" + response.data.idBrand).then((response: any) => {
            //console.log(response);
            //recargar la info del usuario
            this.utilitiesService.showSuccessToast(response.message, "Éxito");
            this.loadData();
            this.modalService.dismissAll();
          }).catch((error) => {
            console.log("error");
            console.log(error);
            this.utilitiesService.showErrorToast("A ocurrido un error", "Éxito");
          });
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
    //Si la imagen no se va a eliminar ni cambiar
    else {
      console.log("Sin cambios en la imagen");
      this.apiDataService.createBrand(this.selectedBrand).then((response: ServerMessage) => {
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
          this.loadData();
          this.modalService.dismissAll();
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  editBrand() {
    let indexFind = this.brandsList.findIndex((brand) => {
      return brand.idBrand == this.selectedBrand.idBrand;
    });


    //Se elimino la imagen
    if (!this.selectedBrand.haveImage && this.brandsList[indexFind].haveImage && this.source.length == 0 && this.selectedBrand.idBrand != -1) {
      console.log("Elimino imagen");
      this.apiDataService.editBrand(this.selectedBrand).then((response1: ServerMessage) => {
        //console.log(response1);
        if (response1.error == true) {
          if (response1.message.includes("Campos de") == true) {
            for (let index = 0; index < response1.data.length; index++) {
              this.utilitiesService.showWarningToast(response1.data[index].message, "Error");
            }
          } else {
            this.utilitiesService.showWarningToast(response1.message, "Error");
            console.log(response1);
          }
        } else if (response1.error == false) {
          this.apiDataService.deleteImageBrand(this.selectedBrand.idBrand).then((response: any) => {
            //console.log(response);
            if (response.error == true) {
              this.utilitiesService.showErrorToast(response1.message, "Éxito");
              console.log("error");
              console.log(response);
            } else if (response.error == false) {
              //recargar la info del usuario
              this.utilitiesService.showSuccessToast(response.message, "Éxito");
              this.loadData();
              this.modalService.dismissAll();
            }
  
          }).catch((error) => {
            console.log("error");
            console.log(error);
            this.utilitiesService.showErrorToast("A ocurrido un error", "Éxito");
          });
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
    //Si se selecciona una imagen
    else if (this.source.length > 0) {
      console.log("imagen diferente");
      this.apiDataService.editBrand(this.selectedBrand).then((response1: ServerMessage) => {
        //console.log(response1);
        if (response1.error == true) {
          if (response1.message.includes("Campos de") == true) {
            for (let index = 0; index < response1.data.length; index++) {
              this.utilitiesService.showWarningToast(response1.data[index].message, "Error");
            }
          } else {
            this.utilitiesService.showWarningToast(response1.message, "Error");
            console.log(response1);
          }
        } else if (response1.error == false) {
          this.uploadImage(this.selectedFile, "" + response1.data.idBrand).then((response: any) => {
            //console.log(response);
            //recargar la info del usuario
            this.utilitiesService.showSuccessToast(response1.message, "Éxito");
            this.loadData();
            this.modalService.dismissAll();
          }).catch((error) => {
            console.log("error");
            console.log(error);
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
          });
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
    //Si la imagen no se va a eliminar ni cambiar
    else {
      console.log("Sin cambios en la imagen");
      this.apiDataService.editBrand(this.selectedBrand).then((response: ServerMessage) => {
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
          this.loadData();
          this.modalService.dismissAll();
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  deleteBrand() {
    this.apiDataService.deleteBrand(this.selectedBrand.idBrand).then((response: ServerMessage) => {
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
        this.loadData();
        this.modalService.dismissAll();
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  uploadImage(file: any, id: String) {
    return new Promise((resolve, reject) => {
      var newFileName = id + ".jpg";
      let reader = new FileReader;

      try {
        // TO DO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(file);
          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);
          //Loading de carga
          this.apiDataService.uploadImageBrand(formData).then((result: ServerMessage) => {

            if (result.error == false) {
              //this.utilitiesService.showSuccessToast(result.message, "Éxito");
              resolve(result);
            } else {
              this.utilitiesService.showErrorToast(result.message, "Error");
              reject(result);
            }
          }, (error) => {
            //this.utilitiesService.showNotification(0, "A ocurrido un error.", 5000, () => { });
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
            //this.utilitiesService.closeLoadingMsg();
            reject(error);
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");
        resolve({ url: "" });
      }
    });
  }
}
