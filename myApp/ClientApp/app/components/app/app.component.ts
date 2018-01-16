import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, ElementRef } from "@angular/core";
import { Router, NavigationStart } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { AccountService } from '../../../services/account.service';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { AuthService } from '../../../services/auth.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { Permission } from '../../../models/permission.model';
import { LoginComponent } from "../../components/login/login.component";

//var alertify: any = require('../assets/scripts/alertify.js');

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    isAppLoaded: boolean;
    isUserLoggedIn: boolean;
    shouldShowLoginModal: boolean;
    removePrebootScreen: boolean;
    newNotificationCount = 0;
    appTitle = "myApp";    

    stickyToasties: number[] = [];

    dataLoadingConsecutiveFailurs = 0;
    notificationsLoadingSubscription: any;

    @ViewChildren('loginModal,loginControl')
    modalLoginControls: QueryList<any>;

    loginModal: ModalDirective;
    loginControl: LoginComponent;


    constructor(private authService: AuthService) {

    }
        


}
