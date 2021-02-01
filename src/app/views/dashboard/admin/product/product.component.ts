import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { ActivatedRoute } from '@angular/router';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';
import { ProductImage, Product, ProductStickers } from '../../../../classes/product.class';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {

  actualProduct: Product;
  totalQuantities : number;
  statusText : string;

  //Variables for upload new image
  newSticker: ProductStickers;
  
  stickers: ProductStickers[];
  stickersFiltered: ProductStickers[];
  //Variable de apoyo para mantener las subscripciones abiertas
  subs = new Subscription();

  searchValue: String = "";

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  //haveNewImage : boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(private dragulaService: DragulaService, private utilitiesService: UtilitiesService, public dataSessionService: DataSessionService, private _location: Location,
    private apiDataService: ApiDataService, private activatedRoute: ActivatedRoute,) {
    this.actualProduct = new Product();
    this.totalQuantities = 0;
    this.newSticker = new ProductStickers();
    this.stickers = [];
    this.stickersFiltered = Array.from(this.stickers);

    this.activatedRoute.paramMap.subscribe(params => {
      this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
        //console.log(logedResponse);
        if (this.dataSessionService.user.userType == 0) {
          //Cosas para hacer si es admin
          console.log("es admin");
          let idProduct: number = parseInt(params.get('idProduct'));

          if (idProduct == null || idProduct == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard-provider/products");
          } else {
            this.getDataView(idProduct);

            //Con esta subscription se mandan llamar los eventos para cuando se arrastra y suelta un item
            this.subs.add(dragulaService.out("images-list")
              .subscribe(({ el, container }) => {
                this.setIndexStickers();
              })
            );
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

  ngOnInit(): void {
  }

  setIndexStickers() {
    for (let index = 0; index < this.stickers.length; index++) {
      this.stickers[index].position = index;
      //this.stickersFiltered[index].position = index;
    }

    this.apiDataService.editProductStickers(this.stickers).then(async (response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
        console.log(response);
        
        this.utilitiesService.showWarningToast(response.message, "Error");
        this.getDataView(this.actualProduct.idProduct);
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        //console.log("termino");
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.getDataView(this.actualProduct.idProduct);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  getDataView(idProduct: number) {
    //this.actualProduct = new Product();
    this.apiDataService.getProductAdminData(idProduct).then(async (response: ServerMessage) => {
      //console.log("ok");
      //console.log(response);

      if (response.error == true) {
        console.log("error");
        //console.log(response);
        this.utilitiesService.showErrorToast(response.message, "Error");
        this._location.back();
      } else if (response.error == false) {
        //console.log(response.data);

        //this.categoriesGenre = response.data;
        this.actualProduct.images = [...response.data.images];
        for (let index = 0; index < this.actualProduct.images.length; index++) {
          this.actualProduct.images[index].imageBlob = await this.apiDataService.getImage(this.apiDataService.baseURL +
            "uploads/product-image/" + this.actualProduct.images[index].idProduct + "/" + this.actualProduct.images[index].idProductImage
          );
        }
        this.actualProduct = response.data;
        this.actualProduct.createDate = new Date(this.actualProduct.createDate);
        this.stickers = [...response.data.stickers];
        for (let index = 0; index < this.stickers.length; index++) {
          this.stickers[index].imageBlob = await this.apiDataService.getImage(this.apiDataService.baseURL +
            "uploads/product-sticker/" + this.stickers[index].idProduct + "/" + this.stickers[index].idProductSticker
          );
        }
        /* this.stickersFiltered = Array.from(this.actualProduct.images);
        this.newQuantity.idProduct = this.actualProduct.idProduct; */

        this.stickersFiltered = Array.from(this.stickers);

        this.totalQuantities = 0;
        for (let index = 0; index < this.actualProduct.quantities.length; index++) {
          const element = this.actualProduct.quantities[index];
          this.totalQuantities = this.totalQuantities + element.quantity;
        }
        this.statusText = "";
        if (this.actualProduct.activated == true && this.totalQuantities != 0) {
          this.statusText = "activado";
        }
        if (this.actualProduct.activated == true && this.totalQuantities == 0) {
          this.statusText = "agotado";
        }
        if (this.actualProduct.activated == false) {
          this.statusText = "pausado";
        }
        //console.log(this.actualProduct.images);
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
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
      this.newSticker.source = e.target.result;
      this.onChange.emit(file);
      this.newSticker.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.newSticker.source = "";
    //this.haveNewImage = false;
    /*  */
  }

  addImage() {
    if (this.newSticker.source.length == 0) {
      this.utilitiesService.showWarningToast("Seleccione una imagen", "Error");
    }
    if (this.newSticker.name.length == 0) {
      this.utilitiesService.showWarningToast("Nombre invalido", "Error");
    } else {
      let fixedStickerData = new ProductStickers();
      fixedStickerData.name = this.newSticker.name;
      fixedStickerData.idProduct = this.actualProduct.idProduct;
      fixedStickerData.position = this.actualProduct.stickers.length;
      //console.log(fixedStickerData);


      this.apiDataService.addProductSticker(fixedStickerData).then(async (response: ServerMessage) => {
        //console.log("exito");
        //console.log(response);
        if (response.error == true) {
          if (response.message.includes("Campos de") == true) {
            for (let index = 0; index < response.data.length; index++) {
              this.utilitiesService.showWarningToast(response.data[index].message, "Error");
            }
          } else {
            this.utilitiesService.showWarningToast(response.message, "Error");
          }
        } else if (response.error == false) {

          this.newSticker.idProductSticker = response.data.idProductSticker;
          this.newSticker.idProduct = response.data.idProduct;
          this.newSticker.name = response.data.name;
          this.newSticker.position = response.data.position;

          let resultUpload = await this.uploadImage(this.newSticker);

          if (resultUpload.error == true) {
            this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
          } else if (resultUpload.error == false) {
            this.utilitiesService.showSuccessToast(resultUpload.message, "Éxito");
            //console.log("termino");
            //console.log(resultUpload);
            
            this.newSticker = new ProductStickers();
            this.getDataView(this.actualProduct.idProduct);
          }
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  uploadImage(imageForUpload: ProductStickers): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      var newFileName = imageForUpload.idProduct + "-" + imageForUpload.idProductSticker + ".jpg";
      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(imageForUpload.selectedFile);
          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: imageForUpload.selectedFile.type
          });
          formData.append('files[]', image, newFileName);
          //Loading de carga
          this.apiDataService.uploadStickerProduct(formData).then((result: ServerMessage) => {

            if (result.error == false) {
              //this.utilitiesService.showSuccessToast(result.message, "Éxito");
              resolve(new ServerMessage(false, result.message, result.data));
            } else if (result.error == true) {
              this.utilitiesService.showErrorToast(result.message, "Error");
              resolve(new ServerMessage(true, result.message, result.data));
            }
          }, (error) => {
            //this.utilitiesService.showNotification(0, "A ocurrido un error.", 5000, () => { });
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
            //this.utilitiesService.closeLoadingMsg();
            resolve(new ServerMessage(true, "A ocurrido un error", error));
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(imageForUpload.selectedFile);
      } catch (error) {
        console.log("sin imagen seleccionada");
        resolve(new ServerMessage(true, "sin imagen seleccionada", error));
      }
    })
  }

  deleteStickerProductByID(idProductSticker: number) {
    this.apiDataService.deleteProductSticker(idProductSticker).then(async (response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        //console.log("termino");
        this.getDataView(this.actualProduct.idProduct);
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.stickersFiltered = Array.from(this.stickers);
    } else {
      this.stickersFiltered = this.stickers.filter(function (member) {
        let fixed = member.name.charAt(0).toUpperCase() + event.slice(1);
        return member.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  backClicked() {
    this._location.back();
  }

}
