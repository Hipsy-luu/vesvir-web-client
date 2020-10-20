import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { ApiLiveDataService } from '../../../../services/apiLiveData/api-live-data.service';
import { dataProducts } from './products';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import * as c3 from 'c3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit,OnInit {
  public users: number = 0;
  public usersToday: number = 0;

  public message: string = '';
  public messages: string[] = [];

  topTenProducts : any[] = [];

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiLiveDataService : ApiLiveDataService) { 
      //this.initPage();
      this.topTenProducts = [...dataProducts];
  }

  ngAfterViewInit() {
    //this.initPage();
  }

  ngOnInit(): void {
    //this.initPage();
    const chart2 = c3.generate({
      bindto: '#product-sales',
      data: {
          columns: [
              ['Ventas', 5, 6, 3, 7, 9, 10, 14, 12, 11, 9, 8, 7, 10, 6, 12, 10, 8],
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

  initPage(){
    //Inicializacion de los sokets de la vista
    this.apiLiveDataService.receiveChat().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.apiLiveDataService.getUsersOnline().subscribe((users: number) => {
      this.users = users;
    });

    this.apiLiveDataService.getUsersToday().subscribe((usersToday: number) => {
      this.usersToday = usersToday;
    });
    //this.dataSessionService.logOut();
    //console.log(this.dataSessionService.user);
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 && this.dataSessionService.user.role != 2) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
      } else if (this.dataSessionService.user.role == 0 ) {
        //console.log("es admin");
        
      } else if (this.dataSessionService.user.role == 2 || this.dataSessionService.user.role == 0) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.navigateByUrl("/");
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }
}
