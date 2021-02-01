import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ApiLiveDataService } from '../../../../services/apiLiveData/api-live-data.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessage.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public users: number = 0;
  public usersToday: number = 0;

  public message: string = '';
  public messages: string[] = [];

  ///////
  bagActive : number;
  totalSales : number;

  radarChartData : [];
  radarChartLabels : string[];
  chartGenresCountData : [][];
  chartSalesYearData : [][];

  top10SoldProducts : any[];

  reviewsDataFixed : {
    idReview: number,
    idUser: number,
    imageUser: string,
    nameUser: string,
    idProduct: number,
    nameProduct: string,
    date: number,
    review: string,
    qualification: number,
    status: string //"approved" "new" "disapproved"
  }[] = [];
  negativeReviews : number;
  neutralReviews : number;
  positiveReviews : number;



  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiLiveDataService: ApiLiveDataService,private apiDataService : ApiDataService) {
      this.bagActive = 0;
      this.totalSales = 0;

      this.radarChartData = [];
      this.radarChartLabels = [];
      this.chartGenresCountData = [];
      this.chartSalesYearData = [];

      this.top10SoldProducts = [];

      this.reviewsDataFixed = [];
      this.positiveReviews = 0;
      this.neutralReviews = 0;
      this.negativeReviews = 0;

  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0) {
        //Cosas para hacer si es admin
        console.log("es admin");
        this.initData();
      } else if (this.dataSessionService.user.userType == 1) {
        console.log("es provedor");
        this.dataSessionService.navigateByUrl("/dashboard-provider/home");
      } else if (this.dataSessionService.user.userType == 2) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.logOut();
      } else {
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  initData() {
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

    this.apiDataService.getAdminHomeData().then((response : ServerMessage)=>{
      console.log("éxito")
      console.log(response);
      
      if(response.error == true){
        this.utilitiesService.showErrorToast(response.message,"Error");
      }else if(response.error == false){
        
        console.log(response.data);
        this.bagActive = response.data.bagActive ;
        this.totalSales = response.data.totalSales ;

        this.radarChartData = response.data.radarChartData ;
        this.radarChartLabels = response.data.radarChartLabels ;
        this.chartGenresCountData = response.data.chartGenresCountData ;
        this.chartSalesYearData = response.data.chartSalesYearData ;

        this.top10SoldProducts = response.data.top10SoldProducts;

        for (let index = 0; index < response.data.reviewsDataFixed.length; index++) {
          response.data.reviewsDataFixed[index].date = new Date(response.data.reviewsDataFixed[index].date);
        }
        
        this.reviewsDataFixed = response.data.reviewsDataFixed ;
        this.positiveReviews = response.data.positiveReviews ;
        this.neutralReviews = response.data.neutralReviews ;
        this.negativeReviews = response.data.negativeReviews ;
      }
    }).catch((error)=>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error","Error");
      
    });
  }
}
