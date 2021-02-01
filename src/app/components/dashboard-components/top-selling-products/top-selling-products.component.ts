import { Component, OnInit, Input } from '@angular/core';
import { ApiDataService } from '../../../services/apiData/api-data.service';

@Component({
  selector: 'app-top-selling-products',
  templateUrl: './top-selling-products.component.html',
  styleUrls: ['./top-selling-products.component.css']
})
export class TopSellingProductsComponent implements OnInit {

  @Input() top10SoldProducts : any[];

  constructor(public apiDataService : ApiDataService) { 
    this.top10SoldProducts = [];
  }

  ngOnInit(): void {
  }

}
