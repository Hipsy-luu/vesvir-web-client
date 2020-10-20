import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { dataProducts } from './products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  dataProducts = [];
  dataProductsFiltered = [];

  searchValue: String = "";
  statusSelected : string = "all";
  page = 1;
  pageSize = 10;

  @ViewChild(ProductsComponent, { static: false }) table: any;

  constructor(private dataSessionService : DataSessionService) {
    this.dataProducts = [...dataProducts];
    this.dataProductsFiltered = Array.from(this.dataProducts);
  }

  ngOnInit(): void {
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.dataProductsFiltered = Array.from(this.dataProducts);
    } else {
      this.dataProductsFiltered = this.dataProducts.filter(function (product) {
        let fixed = product.name.charAt(0).toUpperCase() + event.slice(1);
        return product.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  changeStateSelected(opc : string){
    this.statusSelected = opc;
      if (this.statusSelected == "all") {
        this.dataProductsFiltered = Array.from(this.dataProducts);
      } else {
        this.dataProductsFiltered = this.dataProducts.filter((dataProduct) => {
          return dataProduct.status == this.statusSelected ;
        });
      }
  }

  onSelect( idProduct ) {
    console.log('Select Event', idProduct);
    this.dataSessionService.navigateByUrl("/dashboard-provider/product/"+idProduct);
  }
}
