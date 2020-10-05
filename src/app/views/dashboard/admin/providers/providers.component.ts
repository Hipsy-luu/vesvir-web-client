import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { dataProviders } from './providers';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';

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

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService) { 
    this.dataProviders = [...dataProviders];
    this.dataProvidersFiltered = Array.from(this.dataProviders);
  }

  ngOnInit(): void {
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
    this.dataSessionService.navigateByUrl("/dashboard/admin/provider/"+idProvider);
  }
}
