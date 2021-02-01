import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reviews-stats',
  templateUrl: './reviews-stats.component.html',
  styleUrls: ['./reviews-stats.component.css']
})
export class ReviewsStatsComponent implements OnInit {
  @Input() negativeReviews : number;
  @Input() neutralReviews : number;
  @Input() positiveReviews : number;
  @Input() totalProd : number;
  constructor() { }

  ngOnInit(): void {
  }

}
