import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { CustomerEdit } from '../../models/customer-edit.model';
import { Utilities } from '../../services/utilities';

@Component({
    selector: 'customer-info',
    templateUrl: './customers-info.component.html',
    styleUrls: ['./customers-info.component.css']
})
export class CustomerInfoComponent implements OnInit {

    @Input()
    isGeneralEditor = false;

    @Input()
    isViewOnly: boolean;

    @ViewChild('f')
    private form;

    @ViewChild('name')
    private name;

    @ViewChild('address')
    private address;

    @ViewChild('city')
    private city;

    @ViewChild('state')
    private state;

    @ViewChild('country')
    private country;
    
    public formResetToggle = true;
    private isEditMode = false;
    private isNewCustomer = false;
    private editingCustomerName: string;
    private isSaving = false;
    private customer: Customer = new Customer();
    private customerEdit: CustomerEdit;
    private isEditingSelf = false;
    private showValidationErrors = false;
    private uniqueId: string = Utilities.uniqueId();

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    constructor(private alertService: AlertService, private accountService: AccountService, private customerService: CustomerService) {

    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadCurrentCustomerData();
        }
    }

    private loadCurrentCustomerData() {
        this.alertService.startLoadingMessage();

        let customerId = this.customer.id;
        this.customerService.getCustomerById(customerId)
            .subscribe(_ => this.onCurrentCustomerDataLoadSuccessful(_), error => this.onCurrentCustomerDataLoadFailed(error));
    }

    private onCurrentCustomerDataLoadSuccessful(customer: Customer) {
        this.alertService.stopLoadingMessage();
        this.customer = customer;        
    }   

    private onCurrentCustomerDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);

        this.customer = new Customer();
    }

    editCustomer(customer: Customer) {
        if (customer) {
            this.isGeneralEditor = false;
            this.isNewCustomer = false;

            this.editingCustomerName = customer.name;
            this.customer = new Customer();
            this.customerEdit = new CustomerEdit();
            Object.assign(this.customer, customer);
            Object.assign(this.customerEdit, customer);
            this.edit();

            return this.customerEdit;
        }
        else {
            return this.newCustomer();
        }
    }

    newCustomer() {
        this.isGeneralEditor = true;
        this.isNewCustomer = true;
        this.editingCustomerName = null;
        this.customer = this.customerEdit = new CustomerEdit();
        this.edit();

        return this.customerEdit;
    }

    private edit() {
        if (!this.isGeneralEditor) {
            this.isEditingSelf = true;
            this.customerEdit = new CustomerEdit();
            Object.assign(this.customerEdit, this.customer);
        }
        else {
            if (!this.customerEdit)
                this.customerEdit = new CustomerEdit();
            
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Guardando cambios");

        if (this.isNewCustomer) {
            this.customerService.newCustomer(this.customerEdit).subscribe(customer => this.saveSuccessHelper(customer), error => this.saveFailedHelper(error));
        } else {
            this.customerService.updateCustomer(this.customerEdit).subscribe(customer => this.saveSuccessHelper(customer), error => this.saveFailedHelper(error));
        }
    }

    private saveSuccessHelper(customer: Customer) {
        
        if (customer)
            Object.assign(this.customerEdit, customer);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();        
        this.showValidationErrors = false;

        
        Object.assign(this.customer, this.customerEdit);
        this.customerEdit = new CustomerEdit();
        this.resetForm();


        if (this.isGeneralEditor) {
            if (this.isNewCustomer)
                this.alertService.showMessage("Success", `User \"${this.customer.name}\" was created successfully`, MessageSeverity.success);
            else if (!this.isEditingSelf)
                this.alertService.showMessage("Success", `Changes to user \"${this.customer.name}\" was saved successfully`, MessageSeverity.success);
        }

        if (this.isEditingSelf) {
            this.alertService.showMessage("Success", "Changes to your User Profile was saved successfully", MessageSeverity.success);
            
        }

        this.isEditMode = false;


        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    resetForm(replace = false) {
        
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    private cancel() {
        if (this.isGeneralEditor)
            this.customerEdit = this.customer = new CustomerEdit();
        else
            this.customerEdit = new CustomerEdit();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private close() {
        this.customerEdit = this.customer = new CustomerEdit();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
}