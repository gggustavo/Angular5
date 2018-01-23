import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Utilities } from '../../services/utilities';
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { CustomerInfoComponent } from '../controls/customers-management.component';
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
    loadingIndicator: boolean;
    editedCustomer: CustomerEdit;
    editingCustomerName: { name: string };

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

    constructor(private alertService: AlertService, private accountService: AccountService, private customerService: CustomerService) {

    }

    ngOnInit(): void {
        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: "name", name: 'Nombre', width: 150 },
            { prop: "city", name: 'Ciudad', width: 50 },
            { prop: "address", name: 'Direccion', width: 150 },
            { prop: "country", name: 'Pais', width: 50 },
            { prop: "state", name: 'Provincia', width: 50 }
        ];

        if (this.canManageUsers)
            this.columns.push({ name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

        this.loadData();
    }

    ngAfterViewInit(): void {
       
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
        //..
    }

    editCustomer(row: CustomerEdit) {
        this.editingCustomerName = { name: row.name };
        //..
    }

    deleteCustomer(row: CustomerEdit) {
        this.alertService.showDialog('Are you sure you want to delete \"' + row.name + '\"?', DialogType.confirm, () => this.deleteCustomerHelper(row));    
    }

    deleteCustomerHelper(row: CustomerEdit) {
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        //...
    }

    onDataLoadSuccesful(customers: Customer[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        customers.forEach((customer, index, customers) => {
            (<any>customer).index = index + 1;
        });

        this.rows = customers;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(Permission.manageUsersPermission);
    }



}