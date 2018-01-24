import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CustomerEndpoint extends EndpointFactory {

    private readonly _customerUrl: string = "/api/customer/customers";
    private readonly _customerByIdUrl: string = "/api/customer/customersById";

    get customersUrl() { return this.configurations.baseUrl + this._customerUrl; }
    get customersByIdUrl() { return this.configurations.baseUrl + this._customerByIdUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getCustomersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {

        let endpointUrl = page && pageSize ? `${this.customersUrl}/${page}/${pageSize}` : this.customersUrl

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(_ => { return this.handleError(_, () => this.getCustomersEndpoint()); });
    }

    getCustomerByIdEndpoint<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this.customersByIdUrl}/${customerId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCustomerByIdEndpoint(customerId));
            });
    }

    getNewCustomerEndpoint<T>(customerObject: any): Observable<T> {

        return this.http.post<T>(this.customersUrl, JSON.stringify(customerObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewCustomerEndpoint(customerObject));
            });
    }

    getUpdateCustomerEndpoint<T>(customerObject: any): Observable<T> {

        return this.http.put<T>(this.customersUrl, JSON.stringify(customerObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateCustomerEndpoint(customerObject));
            });
    }

    getDeleteCustomerEndpoint<T>(id: number): Observable<T> {
        let endpointUrl = `${this._customerUrl}/${id}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteCustomerEndpoint(id));
            });
    }
}