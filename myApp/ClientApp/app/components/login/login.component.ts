import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { AlertService, MessageSeverity, DialogType } from '../../../services/alert.service';
import { UserLogin } from '../../../models/user-login.model';
import { AuthService } from "../../../services/auth.service";
import { ConfigurationService } from '../../../services/configuration.service';
import { Utilities } from '../../../services/utilities';

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    userLogin = new UserLogin();
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;

    @Input()
    isModal = false;

    constructor(private alertService: AlertService, private authService: AuthService, private configurations: ConfigurationService) {

    }

    ngOnInit() {
        this.userLogin.rememberMe = this.authService.rememberMe;

        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                    this.authService.redirectLoginUser();
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.loginStatusSubscription)
            this.loginStatusSubscription.unsubscribe();
    }

    getShouldRedirect() {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }

    login() {
        this.isLoading = true;
        this.alertService.startLoadingMessage("", "Attempting login...");

        this.authService.login(this.userLogin.email, this.userLogin.password, this.userLogin.rememberMe)
            .subscribe(
            user => {
                setTimeout(() => {
                    this.alertService.stopLoadingMessage();
                    this.isLoading = false;
                    this.reset();

                    if (!this.isModal) {
                        this.alertService.showMessage("Login", `Welcome ${user.userName}!`, MessageSeverity.success);
                    }
                    else {
                        this.alertService.showMessage("Login", `Session for ${user.userName} restored!`, MessageSeverity.success);
                        setTimeout(() => {
                            this.alertService.showStickyMessage("Session Restored", "Please try your last operation again", MessageSeverity.default);
                        }, 500);

                        this.closeModal();
                    }
                }, 500);
            },
            error => {

                this.alertService.stopLoadingMessage();

                if (Utilities.checkNoNetwork(error)) {
                    this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                    this.offerAlternateHost();
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

                    if (errorMessage)
                        this.alertService.showStickyMessage("Unable to login", errorMessage, MessageSeverity.error, error);
                    else
                        this.alertService.showStickyMessage("Unable to login", "An error occured whilst logging in, please try again later.\nError: " + error.statusText || error.status, MessageSeverity.error, error);
                }

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }

    showErrorAlert(caption: string, message: string) {

    }
    closeModal() {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    }

    offerAlternateHost() {

        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
            this.alertService.showDialog("Dear Developer!\nIt appears your backend Web API service is not running...\n" +
                "Would you want to temporarily switch to the online Demo API below?(Or specify another)",
                DialogType.prompt,
                (value: string) => {
                    this.configurations.baseUrl = value;
                    this.alertService.showStickyMessage("API Changed!", "The target Web API has been changed to: " + value, MessageSeverity.warn);
                },
                undefined,
                undefined,
                undefined,
                this.configurations.fallbackBaseUrl);
        }
    }

    reset() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;
        });
    }
}