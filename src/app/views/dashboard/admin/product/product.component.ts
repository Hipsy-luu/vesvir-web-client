import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { dataStikers } from './stikers';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  images = [];
  imagesFiltered = [];
  //Variable de apoyo para mantener las subscripciones abiertas
  subs = new Subscription();

  searchValue: String = "";

  //Variables for upload new image
  source: string = '';
  selectedFile: any;
  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  //haveNewImage : boolean = false;

  constructor(private dragulaService: DragulaService, private _location: Location, public utilitiesService: UtilitiesService) {
    this.images = [...dataStikers];
    this.imagesFiltered = Array.from(this.images);

    //Con esta subscription se mandan llamar los eventos para cuando se arrastra y suelta un item
    this.subs.add(dragulaService.out("images-list")
      .subscribe(({ el, container }) => {
        if (this.images.length == this.imagesFiltered.length) {
          this.images = Array.from(this.imagesFiltered);
          for (let index = 0; index < this.images.length; index++) {
            this.images[index].position = index;
            this.imagesFiltered[index].position = index;
          }
        } else {
          this.imagesFiltered = Array.from(this.images);
        }

      })
    );
  }

  ngOnInit(): void {
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
    //this.haveNewImage = false;
  }

  uploadImage() {
    var newFileName = "nombre del archivo" + ".jpg";
    let reader = new FileReader;

    try {
      // TODO: Define type of 'e'
      reader.onload = (e: any) => {
        this.onChange.emit(this.selectedFile);
        const formData = new FormData();
        let image: Blob = new Blob([reader.result], {
          type: this.selectedFile.type
        });
        formData.append('files[]', image, newFileName);
        //Loading de carga
        /* this.apiDataService.uploadImageUser(formData).then((result: ServerMessage) => {

          if (result.error == false) {
            this.utilitiesService.showSuccessToast(result.message, "Éxito");
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
        }); */
        this.utilitiesService.showSuccessToast("Imagen subida con éxito", "Éxito");
        this.cancelImage();


      };
      // This will process our file and get it's attributes/data
      reader.readAsArrayBuffer(this.selectedFile);
    } catch (error) {
      console.log("sin imagen seleccionada");
    }
  }

  deleteImage(id) {
    this.images = this.images.filter((image) => { return image.id != id; });
    this.imagesFiltered = Array.from(this.images);
    for (let index = 0; index < this.images.length; index++) {
      this.images[index].position = index;
      this.imagesFiltered[index].position = index;
    }
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.imagesFiltered = Array.from(this.images);
    } else {
      this.imagesFiltered = this.images.filter(function (member) {
        let fixed = member.name.charAt(0).toUpperCase() + event.slice(1);
        return member.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  backClicked() {
    this._location.back();
  }

}
