export class Customer {

    constructor(id?: number, name?:string, city?: string, address?:string, country?:string, state?:string)
    {
        this.id = id;
        this.name = name;
        this.city = city;
        this.address = address;
        this.country = country;
        this.state = state;
    }

    public id: number;
    public name: string;
    public city: string;
    public address: string;
    public country: string;
    public state: string;

}