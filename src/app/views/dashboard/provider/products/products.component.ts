import { ServerMessage } from './../../../../classes/serverMessage.class';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';

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

  constructor( private utilitiesService: UtilitiesService, public dataSessionService: DataSessionService, private apiDataService: ApiDataService) {
    this.dataProducts = [];
    this.dataProductsFiltered = Array.from(this.dataProducts);
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      if (this.dataSessionService.user.userType == 0) {
        console.log("es admin");
        this.dataSessionService.navigateByUrl("/dashboard-admin/home");
      } else if (this.dataSessionService.user.userType == 1) {
        console.log("es provedor");
        this.apiDataService.getProductsListData().then((response : ServerMessage)=>{
          //console.log("OK");
          //console.log(response.data);
          this.dataProducts = [...response.data];
          this.dataProductsFiltered = Array.from(this.dataProducts);
        }).catch((error)=>{
          console.log("error");
          console.log(error);
          
        });
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
