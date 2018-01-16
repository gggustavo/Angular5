import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { LoginComponent } from "./components/login/login.component";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AppTranslationService, TranslateLanguageLoader } from '../services/app-translation.service';
import { ToastyModule } from 'ng2-toasty';
import { ConfigurationService } from '../services/configuration.service';
import { AlertService } from '../services/alert.service';
import { AccountService } from '../services/account.service';
import { AccountEndpoint } from '../services/account-endpoint.service';
import { LocalStoreManager } from '../services/local-store-manager.service';
import { EndpointFactory } from '../services/endpoint-factory.service';
import { AppErrorHandler } from '../app-error.handler';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: "login", component: LoginComponent, data: { title: "Login" } },
            { path: '**', redirectTo: 'home' }
        ]),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        ToastyModule.forRoot(),
    ],
    providers: [
        AlertService,
        ConfigurationService,
        AppTranslationService,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        EndpointFactory
    ]
})
export class AppModuleShared {
}
