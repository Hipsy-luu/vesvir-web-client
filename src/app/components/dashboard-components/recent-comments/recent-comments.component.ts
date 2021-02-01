import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { Component, OnInit, Input } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-recent-comments',
  templateUrl: './recent-comments.component.html',
  styleUrls: ['./recent-comments.component.css']
})
export class RecentCommentsComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  @Input()
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
  


  constructor(public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
