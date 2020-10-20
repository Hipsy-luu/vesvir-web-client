import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { dataCustomers } from './customers';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  dataCustomers = [];
  dataCustomersFiltered = [];

  searchValue: String = "";
  statusSelected : string = "all";
  page = 1;
  pageSize = 10;

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService) { 
    this.dataCustomers = [...dataCustomers];
    this.dataCustomersFiltered = Array.from(this.dataCustomers);
  }

  ngOnInit(): void {
  }

  filterByCustomerName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.dataCustomersFiltered = Array.from(this.dataCustomers);
    } else {
      this.dataCustomersFiltered = this.dataCustomers.filter(function (customer) {
        let fixed = customer.name.charAt(0).toUpperCase() + event.slice(1);
        return customer.name.toLowerCase().includes(ssearchValue);
      });
    }
  }

  openCustomer(idCustomer){
    this.dataSessionService.navigateByUrl("/dashboard-admin/customers/customer/"+idCustomer);
  }

}
