import { Component, OnInit } from '@angular/core';
import { dataReviews } from './reviews';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  dataReviews = [];
  dataReviewsFiltered = [];

  searchValue: String = "";
  statusSelected : string = "all";
  page = 1;
  pageSize = 10;

  positiveReviews : number = 0;
  neutralReviews : number = 0;
  negativeReviews : number = 0;

  //TO DO : falta hacer que cada que cambian los filtros se reinicien los demas que no se cambiaron 

  constructor(public utilitiesService : UtilitiesService) { 
    this.dataReviews = [...dataReviews];
    this.dataReviewsFiltered = Array.from(this.dataReviews);
  }

  ngOnInit(): void {
    this.positiveReviews = 0 ;
    this.neutralReviews = 0 ;
    this.negativeReviews = 0 ;

    this.dataReviews.forEach((review)=>{
      if(review.qualification == 1){
        this.negativeReviews++;
      } else if(review.qualification >1 && review.qualification < 4){
        this.neutralReviews++;
      } else if(review.qualification >= 4 && review.qualification <=5){
        this.positiveReviews++;
      }
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

  changeStateSelected(opc : string){
    this.statusSelected = opc;
      if (this.statusSelected == "all") {
        this.dataReviewsFiltered = Array.from(this.dataReviews);
      } else {
        this.dataReviewsFiltered = this.dataReviews.filter((dataProduct) => {
          return dataProduct.status == this.statusSelected ;
        });
      }
  }

}
