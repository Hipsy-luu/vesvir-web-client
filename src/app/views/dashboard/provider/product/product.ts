import { Product } from "../../../../classes/product.class";

export const dataProduct : Product =
{
    idProduct: 2,
    //Primera pestaña
    activated: true,
    name: "Johnson, Johnson and Partners, LLC CMP DDC",
    referenceCode: "codigo test",
    barCode : "codigo test 2",
    brand: "Zara",
    gender: 0,
    category: 0,
    material: "Algodón",
    shortDescription: "",
    description: "",
    specs: "",
    price: 200.00,
    //Segunda Pestaña
    width : 12.00,
    height : 5,
    depth : 15, 
    weight : 1.8, 
    //Tercera Pestaña
    quantities: [{
        idQuantity : 2,
        quantity : 25,
        size : "mediana",
        color : "Cafe",
        description : "Viene chido"
    },{
        idQuantity : 2,
        quantity : 25,
        size : "mediana",
        color : "Cafe",
        description : "Viene chido"
    }],
    images: [{
        "idProductImage": 0,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair.png",
        "name": "Tenis Naranjas",
        "position": 0,
        imageBlob : ""
    }, {
        "idProductImage": 1,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair2.png",
        "name": "Zapatos Rojos",
        "position": 1,
        imageBlob : ""
    }, {
        "idProductImage": 2,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair3.png",
        "name": "Bolsa Roja",
        "position": 2,
        imageBlob : ""
    }, {
        "idProductImage": 3,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair4.png",
        "name": "Playera Gris",
        "position": 3,
        imageBlob : ""
    }, {
        "idProductImage": 4,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair.png",
        "name": "Frontal",
        "position": 4,
        imageBlob : ""
    }, {
        "idProductImage": 5,
        "idProduct": 25,
        "urlImage": "assets/images/product/chair.png",
        "name": "Frontal",
        "position": 5,
        imageBlob : ""
    }]
}