﻿import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { CustomersComponent } from "./components/customers/customers.component";
import { SettingsComponent } from "./components/settings/settings.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Home" } },
            { path: "login", component: LoginComponent, data: { title: "Login" } },
            { path: "customers", component: CustomersComponent, canActivate: [AuthGuard], data: { title: "Customers" } },
            { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Settings" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } },         
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule { }