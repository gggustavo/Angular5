import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";

@Component({
    selector: 'customer-info',
    templateUrl: './customers-management.component.html',
    styleUrls: ['./customers-management.component.css']
})
export class CustomerInfoComponent implements OnInit {

    @Input()
    isGeneralEditor = false;

    constructor(private alertService: AlertService, private accountService: AccountService) {
    }

    ngOnInit() {
        
    }

}