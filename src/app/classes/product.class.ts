import { SafeUrl } from '@angular/platform-browser';

export class Product {
    idProduct: number;
    idProvider: number;
    //Primera pestaña
    activated: boolean;
    name: string;
    referenceCode: string; // Producto SAT
    unitKey: string; // Unidad de medida Sat
    barCode: string;
    idBrand: number;
    gender: number;
    idCategory: number;
    material: string;
    shortDescription: string;
    description: string;
    specs: string;
    price: number;
    //Segunda Pestaña
    width: number;
    height: number;
    depth: number;
    weight: number;

    createDate: Date;

    category : any = { name : "" };

    //Tercera Pestaña
    quantities: Quantity[];
    images: ProductImage[];
    stickers : ProductStickers[];

    constructor() {
        this.idProduct = -1;//this.idProduct = -1
        this.idProvider = -1;//this.idProvider = -1
        //Primera pestaña////Primera pestaña
        this.activated = false;//this.activated = false
        this.name = "";//this.name = "zapatos"
        this.referenceCode = "";//this.referenceCode = "15653"
        this.unitKey = "";
        this.barCode = "";//this.barCode = "ds151"
        this.idBrand = -1;//this.idBrand = 7
        this.gender = -1;//this.gender = 0
        this.idCategory = -1;//this.idCategory = 5
        this.material = "";//this.material = "piel"
        this.shortDescription = "";//this.shortDescription = "es zapato"
        this.description = "";//this.description = "es un zapato muy chido"
        this.specs = "";//this.specs = "todo brilla"
        this.price = 0;//this.price = 1556.00
        //Segunda Pestaña////Segunda Pestaña
        this.width = 0;//this.width = 15
        this.height = 0;//this.height = 2
        this.depth = 0;//        this.depth = 6
        this.weight = 0;//this.weight = 0.85
        this.createDate = new Date();//this.createDate = new Date()
        //Tercera Pestaña////Tercera Pestaña
        this.quantities = [];/*this.quantities = [{
            idQuantity: -1,
            idProduct: -1,
            quantity: 10,
            size: "mediano",
            color: "morado",
            description: "descrip",
            deleted: false,
            createDate: new Date(),
        }]*/
        this.images = [];//this.images = []
        this.stickers = [];
    }
}

export class Quantity {
    idQuantity: number;
    idProduct: number;
    quantity: number;
    size: string;
    color: string;
    description: string;
    deleted: boolean;
    createDate: Date;

    constructor() {
        this.idQuantity = -1;
        this.idProduct = -1;
        this.quantity = 0;
        this.size = "";
        this.color = "";
        this.description = "";
        this.deleted = false;
        this.createDate = new Date();
    }
}

export class ProductImage {
    idProductImage: number;
    idProduct: number;
    name: string;
    position: number;
    source: string;
    imageBlob: SafeUrl;
    selectedFile: any;

    constructor() {
        this.idProductImage = -1;
        this.idProduct = -1;
        this.name = "";
        this.position = 0;
        this.imageBlob = "";
        this.source = "";
    }
}

export class ProductStickers {
    idProductSticker: number;
    idProduct: number;
    name: string;
    position: number;
    source: string;
    imageBlob: SafeUrl;
    selectedFile: any;

    constructor() {
        this.idProductSticker = -1;
        this.idProduct = -1;
        this.name = "";
        this.position = 0;
        this.imageBlob = "";
        this.source = "";
    }
}

