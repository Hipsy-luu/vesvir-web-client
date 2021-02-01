import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  dataProviders = [];
  dataProvidersFiltered = [];

  searchValue: String = "";
  statusSelected : string = "all";
  page = 1;
  pageSize = 10;


  constructor(public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService : ApiDataService) { 
      this.dataProviders = [];
      this.dataProvidersFiltered = Array.from(this.dataProviders);
    }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0 ) {
        //Cosas para hacer si es admin
        console.log("es admin");
        this.apiDataService.getProvidersListData().then((response : ServerMessage)=>{
          //console.log(response);
          for (let index = 0; index < response.data.length; index++) {
            response.data[index].createDate = new Date(response.data[index].createDate);
            response.data[index].lastLogin = new Date(response.data[index].lastLogin);
          }
          this.dataProviders = [...response.data];
          this.dataProvidersFiltered = Array.from(this.dataProviders);
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
      this.dataProvidersFiltered = Array.from(this.dataProviders);
    } else {
      this.dataProvidersFiltered = this.dataProviders.filter(function (provider) {
        let fixed = provider.businessName.charAt(0).toUpperCase() + event.slice(1);
        return provider.businessName.toLowerCase().includes(ssearchValue);
      });
    }
  }

  openProvider(idProvider){
    this.dataSessionService.navigateByUrl("/dashboard-admin/provider/"+idProvider);
  }
}
