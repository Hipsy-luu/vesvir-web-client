import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { DataSessionService } from './../../../services/dataSession/data-session.service';
import { Component, AfterViewInit, Input } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-sales-income',
  templateUrl: './sales-income.component.html',
  styleUrls: ['./sales-income.component.css']
})
export class SalesIncomeComponent implements AfterViewInit {

  
  totalUsers : number;

  
  chartTopBrandSales: c3.ChartAPI;
  @Input()
  public radarChartData: any[]; // = [
    //{ data: [65, 59, 90, 81, 56, 55, 40], label: 'Ventas' },
    /* { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' } */
  //];
  @Input()
  public radarChartLabels: string[];/*  = [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running'
  ] ;*/
  public radarChartType = 'radar';
  public radarChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(54,190,166,.5)',
      borderColor: 'rgba(54,190,166,1)'
    },
    { backgroundColor: 'rgb(41,98,255,.5)', borderColor: 'rgb(41,98,255,1)' }
  ];

  chartGenresCount: c3.ChartAPI;
  @Input()
  chartGenresCountData: any[][];


  chartGenresByAges: c3.ChartAPI;
  @Input()
  chartSalesYearData: [];

  constructor(private utilitiesService: UtilitiesService) {
    this.totalUsers = 0;
    this.radarChartData = [];
    this.radarChartLabels = [];
    this.chartGenresCountData = [];
    this.chartSalesYearData = [];
  }

  async ngAfterViewInit() {
    try {
      while (this.chartGenresCountData.length == 0) {
        await this.utilitiesService.sleep(1000);
      }

      this.chartGenresCount = c3.generate({
        bindto: '#sales',
        data: {
          columns: this.chartGenresCountData,

          type: 'donut'
        },
        donut: {
          label: {
            show: false
          },
          title: '',
          width: 18
        },
        size: {
          height: 150
        },
        legend: {
          hide: true
          // or hide: 'data1'
          // or hide: ['data1', 'data2']
        },
        color: {
          pattern: ['#ffffff', '#4798e8', '#24d2b5', '#20aee3']
        }
      });

      this.totalUsers = this.chartGenresCountData[0][1] + this.chartGenresCountData[1][1] + this.chartGenresCountData[2][1];


      // ==============================================================
      // Sales Prediction
      // ==============================================================

      this.chartGenresByAges = c3.generate({
        bindto: '#income',
        data: {
          columns: this.chartSalesYearData,
          type: 'bar',
        },
        bar: {
          space: 0.2,
          // or
          width: 15 // this makes bar width 100px
        },
        axis: {
          y: {
            tick: {
              count: 3,
              outer: false
            }
          }
        },
        legend: {
          hide: false
          // or hide: 'data1'
          // or hide: ['data1', 'data2']
        },
        grid: {
          x: {
            show: false
          },
          y: {
            show: true
          }
        },
        size: {
          height: 270
        },
        color: {
          pattern: ['#4798e8', '#ccc']
        }
      });

      this.chartTopBrandSales = c3.generate({
        bindto: '#prediction',
        data: {
          columns: [['data', 91.4]],
          type: 'gauge'
        },

        color: {
          pattern: ['#20aee3', '#20aee3', '#20aee3', '#24d2b5'], // the three color levels for the percentage values.
          threshold: {
            //            unit: 'value', // percentage is default
            //            max: 200, // 100 is default
            values: [30, 60, 90, 100]
          }
        },
        gauge: {
          width: 22
        },
        size: {
          height: 120,
          width: 150
        }
      });
    } catch (error) {
      console.log("eerr");

    }


  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }
  public chartHovered(e: any): void {
    // console.log(e);
  }
}
