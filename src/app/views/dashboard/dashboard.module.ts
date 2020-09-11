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
import { DashboardRoutes } from './dashboard.routing';

//Views - Administrator Dashboard
import { HomeComponent } from './admin/home/home.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { ProductsComponent } from './admin/products/products.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { CartsComponent } from './admin/carts/carts.component';
import { ProvidersComponent } from './admin/providers/providers.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { AccountSettingsComponent } from './admin/account-settings/account-settings.component';
import { ProductComponent } from './admin/product/product.component';

//Components
import {InfocardComponent} from '../../components/dashboard-components/info-card/info-card.component';
import {SalesIncomeComponent} from '../../components/dashboard-components/sales-income/sales-income.component';
import {TopSellingProductsComponent} from '../../components/dashboard-components/top-selling-products/top-selling-products.component';
import { RecentCommentsComponent } from '../../components/dashboard-components/recent-comments/recent-comments.component';
import { ReviewsStatsComponent } from '../../components/dashboard-components/reviews-stats/reviews-stats.component';
import { CategorysComponent } from './admin/categorys/categorys.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
        RouterModule.forChild(DashboardRoutes),
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
        MessagesComponent,
        ProductsComponent,
        CustomersComponent,
        OrdersComponent,
        CartsComponent,
        ProvidersComponent,
        ReviewsComponent,
        AccountSettingsComponent,
        ProductComponent,
        
        //Componentes del dashboard
        InfocardComponent,
        SalesIncomeComponent,
        TopSellingProductsComponent,
        RecentCommentsComponent,
        ReviewsStatsComponent,
        CategorysComponent,
        
    ]
})
export class DashboardModule { }
