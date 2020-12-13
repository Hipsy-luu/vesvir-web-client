export class UserModelClass {
  /* idUser: number; */
  name: string;
  surnames: string;
  email: string;
  password: string;
  passwordF: string;
  birthDay: Date;
  phone: string;
  genre: number;
  actualPreference: number;
  userType: number;
  createDate: Date;
  lastLogin: Date;
  businessName: string;
  rfc: string;
  phoneBilling: string;
  emailBilling: string;
  state: string;
  city: string;
  postalCode: string;
  colony: string;
  street: string;
  number: string;
  deleted: boolean;
  active: boolean;
  conektaClientId: string;
  userFacebookImage : string;
  constructor() {
    /* this.idUser = -1; */
    this.name = "";
    this.surnames = "";
    this.email = "";
    this.password = "";
    this.passwordF = "";
    this.birthDay = new Date();
    this.phone = "";
    this.genre = -1;
    this.actualPreference = -1;
    this.userType = 2;
    this.createDate = new Date();
    this.lastLogin = new Date();
    this.businessName = "";
    this.rfc = "";
    this.phoneBilling = "";
    this.emailBilling = "";
    this.state = "";
    this.city = "";
    this.postalCode = "";
    this.colony = "";
    this.street = "";
    this.number = "";
    this.deleted = false;
    this.active = true;
    this.conektaClientId = "";
    this.userFacebookImage  = "";
  }
}
