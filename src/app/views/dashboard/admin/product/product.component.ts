import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Component,OnInit , ViewEncapsulation  } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';

import { dataStikers } from './stikers';

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

  constructor(private dragulaService: DragulaService,private _location: Location) {
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
  
  deleteImage(id){
    this.images = this.images.filter((image)=>{ return image.id != id; });
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
