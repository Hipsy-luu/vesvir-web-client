import { SafeUrl } from '@angular/platform-browser';

export class Product {
    idProduct: number;
    //Primera pestaña
    activated: boolean;
    name: string;
    referenceCode: string;
    barCode: string;
    brand: string;
    gender:number;
    category: number;
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
    //Tercera Pestaña
    quantities: Quantity[];
    images: ProductImage[];

    constructor() {
        this.idProduct = -1;
        //Primera pestaña
        this.activated = false;
        this.name = "";
        this.referenceCode = "";
        this.barCode = "";
        this.brand = "";
        this.gender = -1;
        this.category = -1;
        this.material = "";
        this.shortDescription = "";
        this.description = "";
        this.specs = "";
        this.price = 0;
        //Segunda Pestaña
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.weight = 0;
        //Tercera Pestaña
        this.quantities = [];
        this.images = [];
    }
}

export class Quantity{
    idQuantity: number;
    quantity: number;
    size: string;
    color: string;
    description: string;

    constructor(){
        this.idQuantity = -1;
        this.quantity = 0;
        this.size = "";
        this.color = "";
        this.description = "";
    }
}

export class ProductImage{
    idProductImage: number;
    idProduct : number;
    urlImage : string;
    name : string;
    position : number;
    imageBlob: SafeUrl;

    constructor(){
        this.idProductImage = -1;
        this.idProduct = -1;
        this.urlImage = "";
        this.name = "";
        this.position = 0;
        this.imageBlob = "";
    }
}

