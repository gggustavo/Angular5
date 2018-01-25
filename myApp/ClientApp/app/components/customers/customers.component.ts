import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Utilities } from '../../services/utilities';
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { CustomerInfoComponent } from '../controls/customers-info.component';
import { CustomerEdit } from '../../models/customer-edit.model';

@Component({
    selector: 'customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css'],
    animations: [fadeInOut]
})

export class CustomersComponent implements OnInit, AfterViewInit {

    columns: any[] = [];
    rows: Customer[] = [];
    rowsCache: Customer[] = [];
    loadingIndicator: boolean;
    editedCustomer: CustomerEdit;
    editingCustomerName: { name: string };
    sourceCustomer: CustomerEdit;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('customerTemplate')
    customerTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('customerEditor')
    customerEditor: CustomerInfoComponent;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private customerService: CustomerService) {

    }

    ngOnInit(): void {

        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: "name", name: gT('customer.management.Name'), width: 250 },
            { prop: "address", name: gT('customer.management.Address'), width: 250 },
            { prop: "city", name: gT('customer.management.City'), width: 150 },
            { prop: "state", name: gT('customer.management.State'), width: 150 },
            { prop: "country", name: gT('customer.management.Country'), width: 100 }
           
        ];

        if (this.canManageUsers)
            this.columns.push({ name: '', width: 199, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

        this.loadData();
    }

    ngAfterViewInit(): void {
        this.customerEditor.changesSavedCallback = () => {
            this.addNewUserToList();
            this.editorModal.hide();
        }

        this.customerEditor.changesCancelledCallback = () => {
            this.editedCustomer = null;
            this.sourceCustomer = null;
            this.editorModal.hide();
        }
    }

    addNewUserToList() {
        if (this.sourceCustomer) {
            Object.assign(this.sourceCustomer, this.editedCustomer);
            this.editedCustomer = null;
            this.sourceCustomer = null;
        }
        else {
            let customer = new Customer();
            Object.assign(customer, this.editedCustomer);
            this.editedCustomer = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>customer).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, customer);
            this.rows.splice(0, 0, customer);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.customerService.getCustomers()
            .subscribe(_ => this.onDataLoadSuccesful(_), error => this.onDataLoadFailed(error));
    }

    onEditorModalHidden() {
        this.editingCustomerName = null;
        //this.customerEditor.resetForm(true);
    }

    newCustomer() {
        this.editingCustomerName = null;
        this.sourceCustomer = null;        
        this.editedCustomer = this.customerEditor.newCustomer();
        this.editorModal.show();
    }

    editCustomer(row: CustomerEdit) {
        this.editingCustomerName = { name: row.name };
        this.sourceCustomer = row;
        this.editedCustomer = this.customerEditor.editCustomer(row)
        this.editorModal.show();
    }

    deleteCustomer(row: CustomerEdit) {
        this.alertService.showDialog('Esta seguro que desea eliminar \"' + row.name + '\"?', DialogType.confirm, () => this.deleteCustomerHelper(row));    
    }

    deleteCustomerHelper(row: CustomerEdit) {
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;        

        this.customerService.deleteCustomer(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    onDataLoadSuccesful(customers: Customer[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        customers.forEach((customer, index, customers) => {            
            (<any>customer).index = index + 1;
        });

        this.rows = customers;
        this.rowsCache = [...customers];
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.address, r.city, r.state, r.country));
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(Permission.manageUsersPermission);
    }



}