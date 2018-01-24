import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';

import { CustomerEndpoint } from './customer-endpoint.service';
import { Customer } from '../models/customer.model';
import { CustomerEdit } from '../models/customer-edit.model';

@Injectable()
export class CustomerService {

    constructor(private router: Router, private http: HttpClient, private customerEndpoint: CustomerEndpoint) {

    }

    getCustomers(page?: number, pageSize?: number) {
        return this.customerEndpoint.getCustomersEndpoint<Customer[]>(page, pageSize);
    }

    getCustomerById(customerId: number) {
        return this.customerEndpoint.getCustomerByIdEndpoint<Customer>(customerId);
    }

    newCustomer(customer: CustomerEdit) {
        return this.customerEndpoint.getNewCustomerEndpoint<Customer>(customer);
    }

    updateCustomer(customer: CustomerEdit) {
        return this.customerEndpoint.getUpdateCustomerEndpoint<Customer>(customer);
    }

    deleteCustomer(customer: CustomerEdit) {
        return this.customerEndpoint.getDeleteCustomerEndpoint<Customer>(customer.id)
    }


}