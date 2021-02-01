import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { dataOrders } from './orders';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';
import { ApiDataService } from '../../../../services/apiData/api-data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  dataOrders : {
    idOrder : number,
    nameClient: string,
    destinationCity : string,
    total : number,
    paymentMethod: string,
    lastStatus : string,
    date : Date,
    noPackage : number,
    status : string
  }[] = [];
  dataOrdersFiltered = [];

  searchValue: String = "";
  statusSelected : string = "";
  payMethodSelected : string = "";
  page = 1;
  pageSize = 10;

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService, private apiDataService : ApiDataService) { 
    this.dataOrders = [];
    this.dataOrdersFiltered = Array.from(this.dataOrders);
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0 ) {
        //Cosas para hacer si es admin
        console.log("es admin");
        this.apiDataService.getAdminOrdersListData().then((response : ServerMessage)=>{
          //console.log("éxito")
          //console.log(response);
         /*  for (let index = 0; index < response.data.length; index++) {
            response.data[index].createDate = new Date(response.data[index].createDate);
            response.data[index].lastLogin = new Date(response.data[index].lastLogin);
          } */
          if(response.error == true){
            this.utilitiesService.showErrorToast(response.message,"Error");
          }else if(response.error == false){
            
            for (let index = 0; index < response.data.length; index++) {
              response.data[index].date = new Date(response.data[index].date);
            }

            this.dataOrders = [...response.data];
            this.dataOrdersFiltered = Array.from(this.dataOrders);
          }
          
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

  changePayMethodSelected(opc : string){
    this.payMethodSelected = opc;
    this.statusSelected = "";
    this.dataOrdersFiltered = Array.from(this.dataOrders);
      if (this.payMethodSelected.length == 0) {
        this.dataOrdersFiltered = Array.from(this.dataOrders);
      }else{
        this.dataOrdersFiltered = this.dataOrders.filter((dataProduct) => {
          return dataProduct.paymentMethod == this.payMethodSelected;
        });
      }
  }

  changeStateSelected(opc : string){
    this.statusSelected = opc;
      if (this.statusSelected.length == 0) {
        this.dataOrdersFiltered = Array.from(this.dataOrders);
      } else if( this.payMethodSelected.length == 0 ){
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
    this.dataSessionService.navigateByUrl("/dashboard-admin/order/"+idOrder);
  }

  genStatus(){
    return Math.round(Math.random() * 8);
  }

  genPay(){
    return Math.round(Math.random() * 2);
  }
}
