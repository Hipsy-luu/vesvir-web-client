import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ApiLiveDataService } from '../../../../services/apiLiveData/api-live-data.service';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import * as c3 from 'c3';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  totalSells : number;
  totalProductsSell : number;
  totalAmountSells : number;
  yearSales : [];
  top10Products : {
    idProduct: number, 
    count: number, 
    quantity,
    product: {
      idProduct : number,
      name : string,
      price : number,
      images : {
        idProduct : number,
        idProductImage : number,
        name : string,
        position : number
      }[]
    },
  }[];

  chart2 : any;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiLiveDataService: ApiLiveDataService,private apiDataService : ApiDataService) {
    this.totalSells = 0;
    this.totalProductsSell = 0;
    this.totalAmountSells = 0;
    this.yearSales = [];
    this.top10Products = [];
  }

/*   ngAfterViewInit() {
    this.initPage();
  } */

  ngOnInit(): void { 
    this.totalSells = 0;
    this.totalProductsSell = 0;
    this.totalAmountSells = 0;
    this.yearSales = [];
    this.top10Products = [];
  }

  ngAfterViewInit(){
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      if (this.dataSessionService.user.userType == 0 ) {
        console.log("es admin");
        //this.utilitiesService.showSuccessToast( logedResponse.message,"Exito!");
        this.dataSessionService.navigateByUrl("/dashboard-admin/home");
      } else if (this.dataSessionService.user.userType == 1 ) {
        console.log("es provedor");
        //this.utilitiesService.showSuccessToast( logedResponse.message,"Exito!");
        //this.dataSessionService.navigateByUrl("/dashboard-provider/home"); OK
        this.initPageData();
      }else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      }else{
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      console.log(noLoginResponse);
    });
    
  }

  initPageData() {
    //Inicializacion de los sokets de la vista
    /* this.apiLiveDataService.receiveChat().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.apiLiveDataService.getUsersOnline().subscribe((users: number) => {
      this.users = users;
    });

    this.apiLiveDataService.getUsersToday().subscribe((usersToday: number) => {
      this.usersToday = usersToday;
    }); */

    this.totalSells = 0;
    this.totalProductsSell = 0;
    this.totalAmountSells = 0;
    this.yearSales = [];
    this.top10Products = [];

    this.apiDataService.getProviderHomeData().then((response : ServerMessage)=>{
      //console.log("éxito")
      //console.log(response);
      
      if(response.error == true){
        this.utilitiesService.showErrorToast(response.message,"Error");
      }else if(response.error == false){
        
        console.log(response.data.top10Products);

        this.totalSells = response.data.totalSells;
        this.totalProductsSell = response.data.totalProductsSell;
        this.totalAmountSells = response.data.totalAmountSells;
        this.yearSales = response.data.yearSales;
        this.top10Products = response.data.top10Products;
        
        this.chart2 = c3.generate({
          bindto: '#product-sales',
          data: {
            columns: [
              this.yearSales,
              /* ['Ipad', 1, 2, 8, 3, 4, 5, 7, 6, 5, 6, 4, 3, 3, 12, 5, 6, 3] */
            ],
            type: 'spline'
          },
          axis: {
            y: {
              show: true,
              tick: {
                count: 0,
                outer: false
              }
            },
            x: {
              show: true
            }
          },
          padding: {
            top: 40,
            right: 10,
            bottom: 40,
            left: 20
          },
          point: {
            r: 0
          },
          legend: {
            hide: false
          },
          color: {
            pattern: ['#ccc', '#4798e8']
          }
        });
        
      }
      
    }).catch((error)=>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error","Error");
      
    });
  }
}
