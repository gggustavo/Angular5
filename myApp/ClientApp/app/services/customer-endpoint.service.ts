import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CustomerEndpoint extends EndpointFactory {

    private readonly _customerUrl: string = "/api/customer/customers";

    get customersUrl() { return this.configurations.baseUrl + this._customerUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getCustomersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {

        let endpointUrl = page && pageSize ? `${this.customersUrl}/${page}/${pageSize}` : this.customersUrl

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(_ => { return this.handleError(_, () => this.getCustomersEndpoint()); });
    }

}