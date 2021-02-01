import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LoggedResponse } from '../../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../../classes/serverMessage.class';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../../services/apiData/api-data.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, AfterViewInit {
  dataReviews: {
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
  dataReviewsFiltered: {
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

  searchValue: String = "";
  statusSelected: string = "all";
  page = 1;
  pageSize = 10;

  positiveReviews: number = 0;
  neutralReviews: number = 0;
  negativeReviews: number = 0;

  //TO DO : falta hacer que cada que cambian los filtros se reinicien los demas que no se cambiaron 

  constructor(public utilitiesService: UtilitiesService, public dataSessionService: DataSessionService, public apiDataService: ApiDataService) {
    this.dataReviews = [/* ...dataReviews */];
    this.dataReviewsFiltered = Array.from(this.dataReviews);
  }

  ngOnInit(): void {
    this.positiveReviews = 0;
    this.neutralReviews = 0;
    this.negativeReviews = 0;

    this.dataSessionService.checkLogin((logedResponse: LoggedResponse) => {
      //console.log(logedResponse);
      if (this.dataSessionService.user.userType == 0) {
        //Cosas para hacer si es admin
        console.log("es admin");
        this.loadData();

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

  ngAfterViewInit() {

  }

  loadData(){
    this.searchValue = "";
    this.statusSelected = "all";
    this.apiDataService.getCommentsListData().then((response: ServerMessage) => {
      //console.log("exito");
      //console.log(response);

      if (response.error == true) {
        this.utilitiesService.showErrorToast(response.message, "Error");
      } else if (response.error == false) {
        //console.log("paso");

        for (let index = 0; index < response.data.reviewsDataFixed.length; index++) {
          response.data.reviewsDataFixed[index].date = new Date(response.data.reviewsDataFixed[index].date);
          //response.data[index].lastLogin = new Date(response.data[index].lastLogin);
        }

        this.dataReviews = [...response.data.reviewsDataFixed];
        this.dataReviewsFiltered = Array.from(this.dataReviews);

        this.positiveReviews = response.data.positiveReviews;
        this.neutralReviews = response.data.neutralReviews;
        this.negativeReviews = response.data.negativeReviews;
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");

    });
  }

  filterByProductName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.dataReviewsFiltered = Array.from(this.dataReviews);
    } else {
      this.dataReviewsFiltered = this.dataReviews.filter(function (review) {
        let fixed = review.nameProduct.charAt(0).toUpperCase() + event.slice(1);
        return review.nameProduct.toLowerCase().includes(ssearchValue);
      });
    }
  }

  changeStateSelected(opc: string) {
    this.statusSelected = opc;
    if (this.statusSelected == "all") {
      this.dataReviewsFiltered = Array.from(this.dataReviews);
    } else {
      this.dataReviewsFiltered = this.dataReviews.filter((dataProduct) => {
        return dataProduct.status == this.statusSelected;
      });
    }
  }

  approveDisapproveReview(idReview : string){
    this.apiDataService.approveDisapproveReview( idReview ).then((response: ServerMessage) => {
      //console.log("exito");
      console.log(response);

      if (response.error == true) {
        this.utilitiesService.showErrorToast(response.message, "Error");
      } else if (response.error == false) {
        console.log("Actualizo");
        this.loadData();
        //let index = this.
      }

    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");

    });
  }

}
