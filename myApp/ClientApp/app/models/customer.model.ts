export class Customer {

    constructor(customerid: string, name:string, city: string, address:string, country:string, state:string)
    {
        this.customerid = customerid;
        this.name = name;
        this.city = city;
        this.address = address;
        this.country = country;
        this.state = state;
    }

    public customerid: string;
    public name: string;
    public city: string;
    public address: string;
    public country: string;
    public state: string;

}