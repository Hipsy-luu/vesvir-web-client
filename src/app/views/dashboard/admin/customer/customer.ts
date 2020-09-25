/* 
  Niña = 3
  Niño = 2
  Mujer = 1
  Hombre = 0
*/
/* user types
    0 = admin
    1 = provider
    2 = customer 
*/
export const dataCustomer = 
  {
    idUser : 0,
    name: "Luismiguel",
    surnames : "Ortiz Alvarez",
    email : "luismi.luu@gmail.com",
    birthDay : new Date("01/18/1994"),
    phone : "6141252557",
    genre : 0,
    actualPreference : 2,
    userType : 2,
    createDate : new Date("01/18/2020"),
    lastLogin : new Date("05/20/2020"),
    billingInformation : {
      idBillingInformation : 2,
      businessName : "Equipos integrados de seguridad",
      rfc : "EIS981217B24",
      phone : "6394740742",
      email : "luismi.luu@gmail.com",
      state : "Chihuahua",
      city : "Delicias",
      postalCode : "33000",
      colony : "Magisterial",
      street : "Avenida 26 Poniente",
      number : "206",
    },
    directions : [{
      idDirection : 0,
      name : "Luismiguel",
      surnames : "Ortiz Alvarez",
      street : "Avenida 26 poniente",
      phone : "6141252557",
      number : "205",
      extNumber : "sin indicar",
      state : "Chihuahua",
      city : "Delicias",
      postalCode : "33000",
      colony : "Magistral",
      default : false,
    },{
      idDirection : 1,
      name : "Luis David",
      surnames : "Ortiz Alvarez",
      phone : "6391125478",
      street : "Calle Villa del sol",
      number : "9925",
      extNumber : "sin indicar",
      state : "Chihuahua",
      city : "Chihuahua",
      postalCode : "31125",
      colony : "Campo Bello",
      default : true,
    }],

  }