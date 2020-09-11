import { Component, OnInit } from '@angular/core';
import { DataCategorysGenres } from './catalogByGenres';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.css']
})
export class CategorysComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  searchValue: String = "";
  selectedGenre = -1;
  selectedStatus = -1;

  categorysGenres = []; // TO DO Falta tipearlo a una clase
  categorysFiltered = []; // TO DO Falta tipearlo a una clase

  actualCategory; // TO DO Falta tipearlo a una clase

  constructor() { 
    this.categorysGenres  = [...DataCategorysGenres];
    this.categorysFiltered = Array.from(this.categorysGenres);
    this.actualCategory = { 
      idCategory : 0,
      name : "",
      genre : 0,
      active : true
    };
  }

  ngOnInit(): void {
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    this.selectedGenre = -1;
    if (this.searchValue == "") {
      this.categorysFiltered = Array.from(this.categorysGenres);
    } else {
      this.categorysFiltered = this.categorysGenres.filter(function (category) {
        let fixed = category.name.charAt(0).toUpperCase() + event.slice(1);
        return category.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  changeGenreSelected(opc : number){
    this.selectedGenre = opc;
    this.searchValue = "";
    if(opc == -1){
      this.categorysFiltered = Array.from(this.categorysGenres);
    }else{
      this.categorysFiltered = this.categorysGenres.filter(function (category) {
        return category.genre == opc;
      });
    }
  }

  changeStatusSelected(opc : number){
    this.selectedGenre = opc;
    this.searchValue = "";
    this.selectedGenre = -1;
    if(opc == -1){
      this.categorysFiltered = Array.from(this.categorysGenres);
    }else{
      this.categorysFiltered = this.categorysGenres.filter(function (category) {
        return category.active == (opc == 0 ? true : false);
      });
    }
  }
}
