import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DragulaModule } from 'ng2-dragula';
import { DashboardProviderRoutes } from './dashboard-provider.routing';

//Views - Provider Dashboard
import { HomeComponent } from './home/home.component';

import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';

import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { NewProductComponent } from './new-product/new-product.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
        RouterModule.forChild(DashboardProviderRoutes),
        PerfectScrollbarModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgxChartsModule,
        NgxDatatableModule,
        DragulaModule.forRoot(),
    ],
    declarations: [
        //Views - Administrator Dashboard
        HomeComponent,
        ProductsComponent,
        OrdersComponent,
        OrderComponent,
        AccountSettingsComponent,
        ProductComponent,
        NewProductComponent,
        
        //Componentes del dashboard
        
       
        
    ]
})
export class DashboardProviderModule { }
