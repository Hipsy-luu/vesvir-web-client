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
  statusSelected : string = "all";
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
