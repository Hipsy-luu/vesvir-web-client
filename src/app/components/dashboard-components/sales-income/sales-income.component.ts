import { Component, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-sales-income',
  templateUrl: './sales-income.component.html',
  styleUrls: ['./sales-income.component.css']
})
export class SalesIncomeComponent implements AfterViewInit {

  public radarChartData: any = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Ventas' },
    /* { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' } */
  ];
  // Radar
  public radarChartLabels: string[] = [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running'
  ];
  public radarChartType = 'radar';
  public radarChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(54,190,166,.5)',
      borderColor: 'rgba(54,190,166,1)'
    },
    { backgroundColor: 'rgb(41,98,255,.5)', borderColor: 'rgb(41,98,255,1)' }
  ];
  
  constructor() { }

  ngAfterViewInit() {
    const chart = c3.generate({
      bindto: '#income',
      data: {
        columns: [
          ['Mujeres', 100, 200, 300, 300, 400, 200],
          ['Hombres', 130, 100, 440, 200, 320, 100]
        ],
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

    const chart2 = c3.generate({
      bindto: '#sales',
      data: {
        columns: [['One+', 50], ['T', 60]/* , ['Samsung', 10] */],

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
    // ==============================================================
    // Sales Prediction
    // ==============================================================

    const chart3 = c3.generate({
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
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }
  public chartHovered(e: any): void {
    // console.log(e);
  }
}
