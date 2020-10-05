export const orderDetail = {
  idOrder: 1,
  dateOrder: new Date(),
  total: 2535.56,

  orderHistory: [{
    idOrderHistory: 1,
    status: 1,
    userUpdate: "Luismiguel Ortiz",
    date: new Date()
  }, {
    idOrderHistory: 12,
    status: 3,
    userUpdate: "Luismiguel Ortiz",
    date: new Date()
  }, {
    idOrderHistory: 54,
    status: 2,
    userUpdate: "Luismiguel Ortiz",
    date: new Date()
  }],
  shippingPackagesData : [{
    idShippingPackage : 0,
    date : new Date(),
    providerData : {
      idProvider : 12,
      nameProvider : "Vestidos Inc."
    },
    packageWeight : 12.12,
    costDelivery : 150.00,
    guideCode : "AD54325AFAD",

  }],
  productList: [{
    "idProduct": 0,
    "image": "assets/images/product/chair.png",
    "name": "Johnson, Johnson and Partners, LLC CMP DDC",
    "numArch": 0,
    "reference": 22,
    "category": "Pantalones",
    "price": 200.00,
    "quantity": 99,
    "status": "agotado"
  }, {
    "idProduct": 1,
    "image": "assets/images/product/chair2.png",
    "name": "Johnson, Johnson and Partners, LLC CMP DDC",
    "numArch": 3,
    "reference": 22,
    "category": "Pantalones",
    "price": 200.00,
    "quantity": 99,
    "status": "activado"
  }, {
    "idProduct": 2,
    "image": "assets/images/product/chair3.png",
    "name": "Johnson, Johnson and Partners, LLC CMP DDC",
    "numArch": 6,
    "reference": 22,
    "category": "Pantalones",
    "price": 200.00,
    "quantity": 99,
    "status": "pausado"
  }, {
    "idProduct": 3,
    "image": "assets/images/product/chair4.png",
    "name": "Johnson, Johnson and Partners, LLC CMP DDC",
    "numArch": 4,
    "reference": 22,
    "category": "Pantalones",
    "price": 200.00,
    "quantity": 99,
    "status": "pausado"
  }, {
    "idProduct": 4,
    "image": "assets/images/product/ipad.png",
    "name": "Johnson, Johnson and Partners, LLC CMP DDC",
    "numArch": 8,
    "reference": 22,
    "category": "Pantalones",
    "price": 200.00,
    "quantity": 99,
    "status": "agotado"
  },]
}