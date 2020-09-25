
/* user types
    0 = admin
    1 = provider
    2 = customer 
*/
export class Customer{
    idUser : number;
    name: string;
    surnames : string;
    email : string;
    birthDay : Date;
    phone : string;
    genre : number;
    actualPreference : number;
    userType : number;
    createDate : Date;
    lastLogin : Date;
    billingInformation : BillingInformation;
    directions : Direction[];

    constructor(){
        this.idUser  = -1;
        this.name = "";
        this.surnames  = "";
        this.email  = "";
        this.birthDay = new Date();
        this.phone  = "";
        this.genre  = 0;
        this.actualPreference  = 0;
        this.userType  = 2;
        this.createDate = new Date();
        this.lastLogin =new Date();
        this.billingInformation = new BillingInformation();
        this.directions = [];
    }
}

export class Direction{
    idDirection : number;
    name: string;
    surnames : string;
    phone : string;
    street : string;
    number : string;
    extNumber : string;
    state : string;
    city : string;
    postalCode : string;
    colony : string;
    default : boolean;

    constructor(){
        this.idDirection = -1;
        this.name= "";
        this.surnames = "";
        this.phone = "";
        this.street = "";
        this.number = "";
        this.extNumber = "";
        this.state = "";
        this.city = "";
        this.postalCode = "";
        this.colony = "";
        this.default = false;
    }
}


export class BillingInformation{
    idBillingInformation : number;
    businessName : string;
    rfc : string;
    phone : string;
    email : string;
    state : string;
    city : string;
    postalCode : string;
    colony : string;
    street : string;
    number : string;

    constructor(){
        this.idBillingInformation = -1;
        this.businessName = "";
        this.rfc= "";
        this.phone = "";
        this.email = "";
        this.state = "";
        this.city = "";
        this.postalCode = "";
        this.colony = "";
        this.street = "";
        this.number = "";
    }
}