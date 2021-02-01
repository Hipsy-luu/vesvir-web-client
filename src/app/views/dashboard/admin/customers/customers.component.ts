import { ServerMessage } from './../../../../classes/serverMessage.class';
import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ApiDataService } from '../../../../services/apiData/api-data.service';

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

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiDataService : ApiDataService) { 
      this.dataCustomers = [];
      this.dataCustomersFiltered = Array.from(this.dataCustomers);
    }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0 ) {
        //Cosas para hacer si es admin
        console.log("es admin");
        this.apiDataService.getCustomerListData().then((response : ServerMessage)=>{
          //console.log(response);
          for (let index = 0; index < response.data.length; index++) {
            response.data[index].createDate = new Date(response.data[index].createDate);
            response.data[index].lastLogin = new Date(response.data[index].lastLogin);
          }
          this.dataCustomers = [...response.data];
          this.dataCustomersFiltered = Array.from(this.dataCustomers);
        }).catch((error)=>{
          console.log("error");
          console.log(error);
          this.utilitiesService.showErrorToast("A ocurrido un error","Error");
          
        });

      } else if (this.dataSessionService.user.userType == 1 ) {
        console.log("es provedor");
        this.dataSessionService.navigateByUrl("/dashboard-provider/home");
      }else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      }else{
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  filterByCustomerEmail(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.dataCustomersFiltered = Array.from(this.dataCustomers);
    } else {
      this.dataCustomersFiltered = this.dataCustomers.filter(function (customer) {
        let fixed = customer.email.charAt(0).toUpperCase() + event.slice(1);
        return customer.email.toLowerCase().includes(ssearchValue);
      });
    }
  }

  openCustomer(idCustomer){
    this.dataSessionService.navigateByUrl("/dashboard-admin/customers/customer/"+idCustomer);
  }

}
