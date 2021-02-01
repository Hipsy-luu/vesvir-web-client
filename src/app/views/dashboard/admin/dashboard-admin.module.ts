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
import { DashboardAdminRoutes } from './dashboard-admin.routing';
import { NgxMaskModule, IConfig } from 'ngx-mask';

//Views - Administrator Dashboard
import { HomeComponent } from './home/home.component';

import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';

import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';

import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';

import { ProvidersComponent } from './providers/providers.component';
import { ProviderComponent } from './provider/provider.component';

import { ReviewsComponent } from './reviews/reviews.component';
import { CategorysComponent } from './categorys/categorys.component';
import { BrandsComponent } from './brands/brands.component'; 
import { AccountSettingsComponent } from './account-settings/account-settings.component';

//Components
import {InfocardComponent} from '../../../components/dashboard-components/info-card/info-card.component';
import {SalesIncomeComponent} from '../../../components/dashboard-components/sales-income/sales-income.component';
import {TopSellingProductsComponent} from '../../../components/dashboard-components/top-selling-products/top-selling-products.component';
import { RecentCommentsComponent } from '../../../components/dashboard-components/recent-comments/recent-comments.component';
import { ReviewsStatsComponent } from '../../../components/dashboard-components/reviews-stats/reviews-stats.component';


const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
        RouterModule.forChild(DashboardAdminRoutes),
        PerfectScrollbarModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgxChartsModule,
        NgxDatatableModule,
        NgxMaskModule.forRoot(maskConfig),
        DragulaModule.forRoot(),
    ],
    declarations: [
        //Views - Administrator Dashboard
        HomeComponent,
        ProductsComponent,
        CustomersComponent,
        OrdersComponent,
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
        CustomerComponent,
        ProviderComponent,
        OrderComponent,
        BrandsComponent,
        
    ]
})
export class DashboardAdminModule { }
