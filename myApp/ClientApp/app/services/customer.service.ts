import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';

import { CustomerEndpoint } from './customer-endpoint.service';
import { Customer } from '../models/customer.model';

@Injectable()
export class CustomerService {

    constructor(private router: Router, private http: HttpClient, private customerEndpoint: CustomerEndpoint) {

    }

    getCustomers(page?: number, pageSize?: number) {
        return this.customerEndpoint.getCustomersEndpoint<Customer[]>(page, pageSize);
    }

}