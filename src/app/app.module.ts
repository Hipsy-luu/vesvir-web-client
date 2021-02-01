import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    CommonModule,
    LocationStrategy,
    HashLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ToastrModule } from 'ngx-toastr';

/* import { NgxMaskModule, IConfig } from 'ngx-mask'; 
const maskConfig: Partial<IConfig> = {
    validation: false,
  }; */
//Layouts
import { FullAdminComponent } from './layouts/full-admin/full-admin.component';
import { FullProviderComponent } from './layouts/full-provider/full-provider.component';

import { BlankComponent } from './layouts/blank/blank.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//Components
import { NavigationAdminComponent } from './components/admin/header-navigation-admin/navigation-admin.component';
import { NavigationProviderComponent } from './components/provider/header-navigation-provider/navigation-provider.component';

import { SidebarAdminComponent } from './components/admin/sidebar-admin/sidebar-admin.component';
import { SidebarProviderComponent } from './components/provider/sidebar-provider/sidebar-provider.component';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './components/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoginComponent } from './views/login/login.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 1,
    wheelPropagation: true,
    minScrollbarLength: 20
};

import { deployConf } from './utils/config';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { TermsConditionsComponent } from './views/terms-conditions/terms-conditions.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { FaqComponent } from './views/faq/faq.component';

const config: SocketIoConfig = { url: deployConf.apiUrl, options: {}};


@NgModule({
    declarations: [
        AppComponent,
        //Layouts
        BlankComponent,
        FullAdminComponent,
        FullProviderComponent,
        //Components
        NavigationAdminComponent,
        NavigationProviderComponent,
        BreadcrumbComponent,
        SidebarAdminComponent,
        SidebarProviderComponent,
        SpinnerComponent,
        //Pages
        LoginComponent,
        LandingPageComponent,
        TermsConditionsComponent,
        AboutUsComponent,
        FaqComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        ToastrModule.forRoot(),
        SlimLoadingBarModule.forRoot(),
        RouterModule.forRoot(Approutes, { useHash: false }),
        PerfectScrollbarModule,
        Ng2SearchPipeModule,
        NgMultiSelectDropDownModule.forRoot(),
        /* NgxMaskModule.forRoot(maskConfig), */
        SocketIoModule.forRoot(config)
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
