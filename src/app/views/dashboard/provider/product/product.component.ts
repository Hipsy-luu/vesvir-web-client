import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

//import { dataProduct } from './product';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { Product, ProductImage, Quantity } from '../../../../classes/product.class';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';
import { ActivatedRoute } from '@angular/router';
import { User, Direction } from '../../../../classes/user.class';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  actualProduct: Product;
  imagesFiltered: ProductImage[];

  newQuantity: Quantity;
  //Variables for upload new image
  newImage: ProductImage;
  //searchValue: String = "";

  public config: PerfectScrollbarConfigInterface = {};
  //Variable de apoyo para mantener las subscripciones abiertas
  subs = new Subscription();


  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  //haveNewImage : boolean = false;
  active = 1;

  categoriesGenre = {
    mens: [],
    womens: [],
    boys: [],
    girls: []
  }

  activeBrands: [];

  searchSatType : string;
  searchSat : string;
  codesResultSat : { 
    description: string,
    key: string,
    score: number 
  }[];

  @ViewChild("modalQuantity") modalQuantity;
  @ViewChild("modalConfirmQuantityDelete") modalConfirmQuantityDelete;
  @ViewChild("modalConfirmUserDelete") modalConfirmUserDelete;
  @ViewChild("modalConfirmProductDelete") modalConfirmProductDelete;
  @ViewChild("modalSeeSATProductCatalogCodes") modalSeeSATProductCatalogCodes;

  constructor(private dragulaService: DragulaService, private activatedRoute: ActivatedRoute, private utilitiesService: UtilitiesService,
    public dataSessionService: DataSessionService, private _location: Location, private apiDataService: ApiDataService,
    private modalService: NgbModal) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.actualProduct = new Product();
      this.imagesFiltered = Array.from(this.actualProduct.images);
      this.newQuantity = new Quantity();
      this.newImage = new ProductImage();
      this.activeBrands = [];
      this.searchSatType = "product";
      this.searchSat = "";
      this.codesResultSat = [];

      this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
        if (this.dataSessionService.user.userType == 0) {
          console.log("es admin");
          this.dataSessionService.navigateByUrl("/dashboard-admin/home");
        } else if (this.dataSessionService.user.userType == 1) {
          console.log("es provedor");

          let idProduct: number = parseInt(params.get('idProduct'));

          if (idProduct == null || idProduct == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard-provider/products");
          } else {
            this.getDataView(idProduct);
          }

          //Con esta subscription se mandan llamar los eventos para cuando se arrastra y suelta un item
          this.subs.add(this.dragulaService.out("images-list")
            .subscribe(({ el, container }) => {
              this.setIndexImages();
            })
          );
        } else if (this.dataSessionService.user.userType == 2) {
          this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
          this.dataSessionService.logOut();
        } else {
          this.utilitiesService.showErrorToast("Usuario desconocido.", "Error!");
          this.dataSessionService.logOut();
        }
      }, (noLoginResponse: LoggedResponse) => {
        console.log(noLoginResponse);
      });
    });
  }

  ngOnInit(): void {

  }

  openModalNewQuantity() {
    this.newQuantity = new Quantity();
    this.newQuantity.idProduct = this.actualProduct.idProduct;
    this.modalService.open(this.modalQuantity, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalEditQuantity(quantity: Quantity) {
    this.newQuantity = new Quantity();
    this.newQuantity = JSON.parse(JSON.stringify(quantity));
    this.modalService.open(this.modalQuantity, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteQuantityById(quantity: Quantity) {
    this.newQuantity = new Quantity();
    this.newQuantity = JSON.parse(JSON.stringify(quantity));
    this.modalService.open(this.modalConfirmQuantityDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteQuantity() {
    this.modalService.open(this.modalConfirmProductDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteProduct() {
    this.modalService.open(this.modalConfirmQuantityDelete, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteProduct(){
    this.apiDataService.deleteProduct(this.actualProduct.idProduct).then(async (response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
        this.getDataView(this.actualProduct.idProduct);
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.modalService.dismissAll();
        this.dataSessionService.navigateByUrl('/dashboard-provider/products')
      }
    }).catch(error => {
      console.log("error");
      console.log(error);
      this.getDataView(this.actualProduct.idProduct);
      this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
    });
  }


  showInvalidSave() {
    if (this.actualProduct.name.length == 0 ||
      this.actualProduct.referenceCode.length == 0 ||
      this.actualProduct.unitKey.length == 0 ||
      this.actualProduct.gender == -1 ||
      this.actualProduct.idCategory == -1 ||
      this.actualProduct.material.length == 0 ||
      this.actualProduct.shortDescription.length == 0 ||
      this.actualProduct.description.length == 0 ||
      this.actualProduct.specs.length == 0 ||
      this.actualProduct.price == 0) {
      this.active = 1;
      this.utilitiesService.showWarningToast("Complete los campos obligatorios - Información", "Error");
    } else if (this.actualProduct.width == 0 ||
      this.actualProduct.height == 0 ||
      this.actualProduct.depth == 0 ||
      this.actualProduct.weight == 0) {
      this.active = 2;
      this.utilitiesService.showWarningToast("Complete los campos obligatorios - Dimensiones", "Error");
    } else if (this.actualProduct.quantities.length == 0) {
      this.active = 3;
      this.utilitiesService.showWarningToast("Ingrese por lo menos una cantidad - Cantidades", "Error");
    }
  }

  setIndexImages() {

    for (let index = 0; index < this.actualProduct.images.length; index++) {
      this.actualProduct.images[index].position = index;
      //this.imagesFiltered[index].position = index;
    }

    this.apiDataService.editProductImages(this.actualProduct.images).then(async (response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);
      if (response.error == true) {
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

  selectGenre(opc: number) {
    this.actualProduct.gender = opc;
    this.actualProduct.idCategory = -1
  }

  getDataView(idProduct) {
    //console.log(idProduct);
    this.actualProduct = new Product();
    this.imagesFiltered = Array.from(this.actualProduct.images);
    this.newQuantity = new Quantity();
    this.newImage = new ProductImage();
    this.activeBrands = [];

    this.apiDataService.getProductData(idProduct).then(async (response: ServerMessage) => {
      //console.log("ok");
      //console.log(response);

      if (response.error == true) {
        this.utilitiesService.showErrorToast(response.message, "Error");
        //console.log(response);
        this.dataSessionService.navigateByUrl("/dashboard-provider/products");
      } else if (response.error == false) {
        //this.categoriesGenre = response.data;
        this.actualProduct = response.data;
        for (let index = 0; index < this.actualProduct.images.length; index++) {
          this.actualProduct.images[index].imageBlob = await this.apiDataService.getImage(this.apiDataService.baseURL +
            "uploads/product-image/" + this.actualProduct.idProduct + "/" + this.actualProduct.images[index].idProductImage
          );
        }
        this.imagesFiltered = Array.from(this.actualProduct.images);
        this.newQuantity.idProduct = this.actualProduct.idProduct;
        //console.log(this.actualProduct.images);
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
    });

    //carga de los catalogos para las opciones
    this.apiDataService.getBrandsProduct().then((response: ServerMessage) => {
      //console.log("ok");
      if (response.error == true) {
        this.utilitiesService.showErrorToast(response.message, "Error");
        //console.log(response);
      } else if (response.error == false) {
        this.activeBrands = response.data;
        //console.log(response.data);
        this.apiDataService.getCategoriesGenre().then((response: ServerMessage) => {
          //console.log("ok");
          if (response.error == true) {
            this.utilitiesService.showErrorToast(response.message, "Error");
            //console.log(response);
          } else if (response.error == false) {
            this.categoriesGenre = response.data;
          }
        }).catch((error) => {
          console.log("error");
          console.log(error);
        });
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
      this.newImage.source = e.target.result;
      this.onChange.emit(file);
      this.newImage.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.newImage.source = "";
    //this.haveNewImage = false;
    /*  */
  }

  addImage() {
    if (this.newImage.source.length == 0) {
      this.utilitiesService.showWarningToast("Seleccione una imagen", "Error");
    }
    if (this.newImage.name.length == 0) {
      this.utilitiesService.showWarningToast("Nombre invalido", "Error");
    } else {
      let fixedImageData = new ProductImage();
      fixedImageData.name = this.newImage.name;
      fixedImageData.idProduct = this.actualProduct.idProduct;
      fixedImageData.position = this.actualProduct.images.length;
      //console.log(fixedImageData);


      this.apiDataService.addProductImage(fixedImageData).then(async (response: ServerMessage) => {
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

          this.newImage.idProductImage = response.data.idProductImage;
          this.newImage.idProduct = response.data.idProduct;
          this.newImage.name = response.data.name;
          this.newImage.position = response.data.position;

          let resultUpload = await this.uploadImage(this.newImage);

          if (resultUpload.error == true) {
            this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
          } else if (resultUpload.error == false) {
            this.utilitiesService.showSuccessToast(resultUpload.message, "Éxito");
            //console.log("termino");
            this.newImage = new ProductImage();
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


  uploadImage(imageForUpload: ProductImage): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      var newFileName = imageForUpload.idProduct + "-" + imageForUpload.idProductImage + ".jpg";
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
          this.apiDataService.uploadImageProduct(formData).then((result: ServerMessage) => {

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

  deleteImageProductByID(idProductImage: number) {
    this.apiDataService.deleteProductImage(idProductImage).then(async (response: ServerMessage) => {
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

  addQuantity() {
    if (this.newQuantity.size.length == 0) {
      this.utilitiesService.showWarningToast("Talla invalida", "Error")
    } if (this.newQuantity.color.length == 0) {
      this.utilitiesService.showWarningToast("Color invalido", "Error")
    } else {
      //this.actualProduct.quantities.push(JSON.parse(JSON.stringify(this.newQuantity)));
      this.apiDataService.addProductQuantity(this.newQuantity).then(async (response: ServerMessage) => {
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
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
          //console.log("termino");
          this.modalService.dismissAll();
          this.newQuantity = new Quantity();
          this.getDataView(this.actualProduct.idProduct);
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  updateQuantity() {
    if (this.newQuantity.size.length == 0) {
      this.utilitiesService.showWarningToast("Talla invalida", "Error")
    } if (this.newQuantity.color.length == 0) {
      this.utilitiesService.showWarningToast("Color invalido", "Error")
    } else {
      //this.actualProduct.quantities.push(JSON.parse(JSON.stringify(this.newQuantity)));
      this.apiDataService.updateProductQuantity(this.newQuantity).then(async (response: ServerMessage) => {
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
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
          //console.log("termino");
          this.modalService.dismissAll();
          this.newQuantity = new Quantity();
          this.getDataView(this.actualProduct.idProduct);
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  deleteQuantity() {
    if (this.actualProduct.quantities.length == 1) {
      this.utilitiesService.showWarningToast("Se debe tener por lo menos una cantidad", "Advertencia")
    } else {
      this.apiDataService.deleteQuantity(this.newQuantity.idQuantity).then(async (response: ServerMessage) => {
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
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
          console.log("termino");
          this.modalService.dismissAll();
          this.newQuantity = new Quantity();
          this.getDataView(this.actualProduct.idProduct);
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  /* filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.imagesFiltered = Array.from(this.images);
    } else {
      this.imagesFiltered = this.images.filter(function (member) {
        let fixed = member.name.charAt(0).toUpperCase() + event.slice(1);
        return member.name.toLowerCase().includes(ssearchValue);
      });
    }
  } */

  async save() {
    let fixedProduct = JSON.parse(JSON.stringify(this.actualProduct))

    let fixedImages = [];
    this.actualProduct.images.forEach(imageData => {
      fixedImages.push({
        idProductImage: -1,
        idProduct: -1,
        name: imageData.name,
        position: imageData.position,
      })
    });
    fixedProduct.images = fixedImages;
    fixedProduct.idProvider = this.dataSessionService.user.idUser;

    this.apiDataService.editProduct(fixedProduct).then(async (response: ServerMessage) => {
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

  //FUNCIONES MODAL SAT
  openModalSearchSATCodes() {
    this.codesResultSat = [];

    this.modalService.open(this.modalSeeSATProductCatalogCodes, { ariaLabelledBy: 'modal-basic-title', centered: true , size : 'lg'  }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  searchSAT(){
    if(this.searchSat.length != 0){
      this.apiDataService.getSatCodes( this.searchSat, this.searchSatType ).then(async (response: ServerMessage) => {
        //console.log("exito");
        //console.log(response);
        if (response.error == true) {
          console.log("Error");
          console.log(response);
          
          this.utilitiesService.showWarningToast(response.message, "Error");
        } else if (response.error == false) {
          //this.utilitiesService.showSuccessToast(response.message, "Éxito");
          
          this.codesResultSat = response.data.data;
          //this.getDataView(this.actualProduct.idProduct);
          if(this.codesResultSat.length == 0){
            this.utilitiesService.showWarningToast("Sin coincidencias", "Sin resultados");
          }
        }
      }).catch(error => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("Ups a ocurrido un error", "Error")
      });
    }
  }

  selectSatCode( code : string ){
    if ( this.searchSatType == 'product' ) {
      this.actualProduct.referenceCode = code.toString();
    } else if ( this.searchSatType == 'unit' ){
      this.actualProduct.unitKey = code;
    }

    this.modalService.dismissAll();
  }

  backClicked() {
    //this._location.back();
    this.dataSessionService.navigateByUrl("/dashboard-provider/products");
  }
}
