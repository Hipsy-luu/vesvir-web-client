import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { dataOrders } from './orders';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  dataOrders = [];
  dataOrdersFiltered = [];

  searchValue: String = "";
  statusSelected : number = -1;
  payMethodSelected : number = -1;
  page = 1;
  pageSize = 10;

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService) { 
    this.dataOrders = [...dataOrders];
    this.dataOrdersFiltered = Array.from(this.dataOrders);
  }

  ngOnInit(): void {
    for (let index = 0; index < this.dataOrders.length; index++) {
      this.dataOrders[index].paymentMethod = this.genPay();
      this.dataOrders[index].status = this.genStatus();
    }
  }

  filterByProviderName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.dataOrdersFiltered = Array.from(this.dataOrders);
    } else {
      this.dataOrdersFiltered = this.dataOrders.filter(function (order) {
        let fixed = order.nameClient.charAt(0).toUpperCase() + event.slice(1);
        return order.nameClient.toLowerCase().includes(ssearchValue);
      });
    }
  }

  changePayMethodSelected(opc : number){
    this.payMethodSelected = opc;
    this.statusSelected = -1;
    this.dataOrdersFiltered = Array.from(this.dataOrders);
      if (this.payMethodSelected == -1) {
        this.dataOrdersFiltered = Array.from(this.dataOrders);
      }else{
        this.dataOrdersFiltered = this.dataOrders.filter((dataProduct) => {
          return dataProduct.paymentMethod == this.payMethodSelected;
        });
      }
  }

  changeStateSelected(opc : number){
    this.statusSelected = opc;
      if (this.statusSelected == -1) {
        this.dataOrdersFiltered = Array.from(this.dataOrders);
      } else if( this.payMethodSelected == -1 ){
        this.dataOrdersFiltered = this.dataOrders.filter((dataProduct) => {
          return dataProduct.status == this.statusSelected ;
        });
      }else{
        this.dataOrdersFiltered = this.dataOrders.filter((dataProduct) => {
          return dataProduct.status == this.statusSelected && dataProduct.paymentMethod == this.payMethodSelected;
        });
      }
  }

  openOrder(idOrder){
    this.dataSessionService.navigateByUrl("/dashboard/admin/order/"+idOrder);
  }

  genStatus(){
    return Math.round(Math.random() * 8);
  }

  genPay(){
    return Math.round(Math.random() * 2);
  }
}
