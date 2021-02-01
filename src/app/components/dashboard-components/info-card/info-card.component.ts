import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import * as c3 from 'c3';

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html'
})
export class InfocardComponent implements AfterViewInit {
    @Input('onlineUsers') onlineUsers : number;
    @Input('usersToday') usersToday : number;
    @Input('totalSales') totalSales : number;
    @Input('bagActive') bagActive : number;

    constructor() { }

    ngAfterViewInit() {
        
    }
}
