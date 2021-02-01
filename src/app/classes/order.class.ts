export class Order {
    idOrder: number;
    idOrderConekta: string;
    idUser: number;
    needInvoice: boolean;
    invoiced: boolean;
    productsTotal: number;
    privateNote: string;
    amount: number;
    shippingCost: number;
    paymentStatus: string;
    createDate: Date;

    customer: User;
    shippingAddress: ShippingAddress;
    payments: Payment[];
    shippingPackages: ShippingPackage[];
    statusHistorys: StatusHistory[];

    constructor() {
        this.idOrder = -1;
        this.idOrderConekta = "";
        this.idUser = -1;
        this.needInvoice = false;
        this.invoiced = false;
        this.productsTotal = -1;
        this.privateNote = "";
        this.amount = -1;
        this.shippingCost = -1;
        this.paymentStatus = "";
        this.createDate = new Date();

        this.customer = new User();
        this.shippingAddress = new ShippingAddress();
        this.payments = [];
        this.shippingPackages = [];
        this.statusHistorys = [];
    }
}

class User {
    idUser: number;
    idClientFacturapi: string;
    name: string;
    surnames: string;
    email: string;
    password: string;
    passwordF: string;
    birthDay: Date;
    phone: string;
    gender: number;
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
    userFacebookImage: string;

    constructor() {
        this.idUser = -1;
        this.idClientFacturapi = "";
        this.name = "";
        this.surnames = "";
        this.email = "";
        this.password = "";
        this.passwordF = "";
        this.birthDay = new Date();
        this.phone = "";
        this.gender = -1;
        this.actualPreference = -1;
        this.userType = -1;
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
        this.active = false;
        this.conektaClientId = "";
        this.userFacebookImage = "";
    }
}

export class StatusHistory {
    idStatusHistory: number;
    idOrder: number;
    registerUserData: string;
    label: string;
    status: number;
    descriptionForUser: string;
    object: string;
    createdAt: Date;

    constructor() {
        this.idStatusHistory = -1;
        this.idOrder = -1;
        this.registerUserData = "";
        this.label = "";
        this.status = -1;
        this.descriptionForUser = "";
        this.object = "";
        this.createdAt = new Date();
    }
}

class ShippingAddress {
    idShippingAddress: number;
    idOrder: string;
    name: string;
    surnames: string;
    city: string;
    colony: string;
    extNumber: string;
    number: string;
    phone: string;
    postalCode: string;
    state: string;
    street: string;

    constructor() {
        this.idShippingAddress = -1;
        this.idOrder = "";;
        this.name = "";;
        this.surnames = "";;
        this.city = "";;
        this.colony = "";;
        this.extNumber = "";;
        this.number = "";;
        this.phone = "";;
        this.postalCode = "";;
        this.state = "";;
        this.street = "";;
    }
}

class Payment {
    idPayment: number;
    idOrder: string;
    idPaymentConekta: string;
    idPaymentMiEnvio: string;
    idPaymentMiEnvio2: string;
    amount: number;
    status: string;
    description: string;
    createDate: Date;

    constructor() {
        this.idPayment = -1;
        this.idOrder = "";
        this.idPaymentConekta = "";
        this.idPaymentMiEnvio = "";
        this.idPaymentMiEnvio2 = "";
        this.amount = -1;
        this.status = "";
        this.description = "";
        this.createDate = new Date();
    }
}

export class ShippingPackage {
    idShippingPackage: number;
    idMiEnvioPurchase: string;
    idMiEnvioPurchasePaymentId: string;
    idMiEnvioShipments: number;
    idProvider: number;
    idOrder: number;
    durationTerms: string;
    carrier: string;
    urlImageCarrier: string;
    trackingNumber: string;
    trackingUrl: string;
    trackingLabelUrl: string;
    height: number;
    length: number;
    width: number;
    weight: number;
    declaredValue: number;
    costDelivery: number;
    createDate: Date;
    idMiEnvioDirectionProvider: number;
    city: string;
    colony: string;
    name: string;
    surnames: string;
    number: string;
    phone: string;
    postalCode: string;
    state: string;
    street: string;

    provider: User;
    packageProducts: SoldProduct[];

    constructor() {
        this.idShippingPackage = -1;
        this.idMiEnvioPurchase = "";
        this.idMiEnvioPurchasePaymentId = "";
        this.idMiEnvioShipments = -1;
        this.idProvider = -1;
        this.idOrder = -1;
        this.durationTerms = "";
        this.carrier = "";
        this.urlImageCarrier = "";
        this.trackingNumber = "";
        this.trackingUrl = "";
        this.trackingLabelUrl = "";
        this.height = -1;
        this.length = -1;
        this.width = -1;
        this.weight = -1;
        this.declaredValue = -1;
        this.costDelivery = -1;
        this.createDate = new Date();
        this.idMiEnvioDirectionProvider = -1;
        this.city = "";
        this.colony = "";
        this.name = "";
        this.surnames = "";
        this.number = "";
        this.phone = "";
        this.postalCode = "";
        this.state = "";
        this.street = "";

        this.provider = new User();
        this.packageProducts = [];
    }
}

class SoldProduct {
    idSoldProduct: number;
    idProduct: number;
    idShippingPackage: number;
    name: string;
    color: string;
    size: string;
    description: string;
    price: number;
    quantity: number;
    brand: string;
    createdAt: Date;
    product: Product;

    constructor() {
        this.idSoldProduct = -1;
        this.idProduct = -1;
        this.idShippingPackage = -1;
        this.name = "";
        this.color = "";
        this.size = "";
        this.description = "";
        this.price = -1;
        this.quantity = -1;
        this.brand = "";
        this.createdAt = new Date();
        this.product = new Product();
    }
}

class Product {
    idProduct: number;
    idProvider: number;
    activated: boolean;
    name: string;
    referenceCode: string;
    unitKey: string;
    barCode: string;
    idBrand: number;
    gender: number;
    idCategory: number;
    material: string;
    shortDescription: string;
    description: string;
    specs: string;
    price: number;
    width: number;
    height: number;
    depth: number;
    weight: number;
    deleted: boolean;
    createDate: Date;
    images: ProductImage[];

    constructor() {
        this.idProduct = -1;
        this.idProvider = -1;
        this.activated = false;
        this.name = "";
        this.referenceCode = "";
        this.unitKey = "";
        this.barCode = "";
        this.idBrand = -1;
        this.gender = -1;
        this.idCategory = -1;
        this.material = "";
        this.shortDescription = "";
        this.description = "";
        this.specs = "";
        this.price = -1;
        this.width = -1;
        this.height = -1;
        this.depth = -1;
        this.weight = -1;
        this.deleted = false;
        this.createDate = new Date();
        this.images = [];
    }
}

class ProductImage {
    idProductImage: number;
    idProduct: number;
    name: string;
    position: number;

    constructor() {
        this.idProductImage = -1;
        this.idProduct = -1;
        this.name = "";
        this.position = -1;
    }
}
