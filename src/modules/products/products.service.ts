import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { Product } from '../../models/products.entity';
import { Quantity } from '../../models/quantitys.entity';
import { ProductImage } from '../../models/productImages.entity';
import { ServerMessages } from '../../utils/serverMessages.util';
import { Op } from 'sequelize';
import { Category } from '../../models/categories.entity';
/* import sequelize from 'sequelize'; */
import * as sequelize from 'sequelize';
import { ProductStickers } from '../../models/productStickers.entity';

@Injectable()
export class ProductsService {
  constructor(
    //Es una manera de dar de alta el repositorio de la tabla de usuarios
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
    @Inject('CategoriesRepository') private readonly categoriesRepository: typeof Category,
    @Inject('ProductRepository') private readonly productRepository: typeof Product,
    @Inject('QuantityRepository') private readonly quantityRepository: typeof Quantity,
    @Inject('ProductImageRepository') private readonly productImageRepository: typeof ProductImage,
    private mailCenterService: MailCenterService,
  ) { }

  async getProductsByCategoryAdmin(idCategory: number): Promise<ServerMessages> {
    try {
      var categoryFinded: Category = await this.categoriesRepository.findOne<Category>({
        where: {
          idCategory: idCategory,
          deleted: false,
        },
      });

      if (!categoryFinded) {
        return new ServerMessages(true, 'La categoría no esta disponible', {});
      }


      var productsList: Product[] = await this.productRepository.findAll<Product>({
        /* attributes: {
          exclude: ['password', 'deleted'],
          include: ['password','deleted']
        }, */
        where: {
          deleted: false,
          idCategory : idCategory
        },
        include: [
          {
            model: Category,
            as: "category",
            where: {
              deleted: false
            },
          },
          {
            model: Quantity,
            as: "quantities",
            /* where: {
              deleted: false
            }, */
          },
          {
            model: ProductImage,
            as: "images",
            limit: 1
            /* where: {
              deleted: false
            }, */
          },{
            model: ProductStickers,
            as: "stickers",
          },
        ],
        order : [
          [ 'idProduct', 'DESC'],
          /* [ { model: ProductImage, as: 'images' } , 'position', 'ASC'] */ 
        ]
      }).map(async (product: Product) => {

        let contQuantity = 0;
        for (let index = 0; index < product.quantities.length; index++) {
          contQuantity += product.quantities[index].quantity;
        }
        let urlImage = "";
        if (product.images.length != 0) {
          urlImage = 'uploads/product-image/' + product.idProduct + '/' + product.images[0].idProductImage;
        }
        let statusText = "";
        if (product.activated == true && contQuantity != 0) {
          statusText = "activado";
        }
        if (product.activated == true && contQuantity == 0) {
          statusText = "agotado";
        }
        if (product.activated == false) {
          statusText = "pausado";
        }
        return Object.assign(
          {
            idProduct: product.idProduct,
            image: urlImage,
            name: product.name,
            numArch: product.stickers.length,
            reference: product.referenceCode,
            category: product.category.name,
            price: product.price.toFixed(2),
            quantity: contQuantity,
            status: statusText
          });
      });;
      return new ServerMessages(false, 'Lista de productos obtenida', productsList);
    } catch (error) {
      return new ServerMessages(true, 'Error obteniendo lista de productos', {});
    }
  }

  async getProductsProvider(idProvider: number): Promise<ServerMessages> {
    try {
      var productsList: Product[] = await this.productRepository.findAll<Product>({
        /* attributes: {
          exclude: ['password', 'deleted'],
          include: ['password','deleted']
        }, */
        where: {
          deleted: false,
          idProvider: idProvider,
        },
        include: [
          {
            model: Category,
            as: "category",
            where: {
              deleted: false
            },
          },
          {
            model: Quantity,
            as: "quantities",
            /* where: {
              deleted: false
            }, */
          },
          {
            model: ProductImage,
            as: "images",
            limit: 1
            /* where: {
              deleted: false
            }, */
          },{
            model: ProductStickers,
            as: "stickers",
          },
        ],
        order : [
          [ 'idProduct', 'DESC'],
          /* [ { model: ProductImage, as: 'images' } , 'position', 'ASC'] */ 
        ]
      }).map(async (product: Product) => {

        let contQuantity = 0;
        for (let index = 0; index < product.quantities.length; index++) {
          contQuantity += product.quantities[index].quantity;
        }
        let urlImage = "";
        if (product.images.length != 0) {
          urlImage = 'uploads/product-image/' + product.idProduct + '/' + product.images[0].idProductImage;
        }
        let statusText = "";
        if (product.activated == true && contQuantity != 0) {
          statusText = "activado";
        }
        if (product.activated == true && contQuantity == 0) {
          statusText = "agotado";
        }
        if (product.activated == false) {
          statusText = "pausado";
        }
        return Object.assign(
          {
            idProduct: product.idProduct,
            image: urlImage,
            name: product.name,
            numArch: product.stickers.length,
            reference: product.referenceCode,
            category: product.category.name,
            price: product.price.toFixed(2),
            quantity: contQuantity,
            status: statusText
          });
      });;
      return new ServerMessages(false, 'Lista de productos obtenida', productsList);
    } catch (error) {
      return new ServerMessages(true, 'Error obteniendo lista de productos', {});
    }
  }

  async createProduct(newProduct: Product, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (
      newProduct.idProduct == undefined ||
      newProduct.idProduct == null ||
      /* newProduct.idProvider == undefined ||
      newProduct.idProvider == null || */
      idProvider == undefined ||
      idProvider == null ||
      newProduct.activated == undefined ||
      newProduct.activated == null ||
      newProduct.name == undefined ||
      newProduct.name == null ||
      newProduct.referenceCode == undefined ||
      newProduct.referenceCode == null ||
      newProduct.barCode == undefined ||
      newProduct.barCode == null ||
      newProduct.idBrand == undefined ||
      newProduct.idBrand == null ||
      newProduct.gender == undefined ||
      newProduct.gender == null ||
      newProduct.idCategory == undefined ||
      newProduct.idCategory == null ||
      newProduct.material == undefined ||
      newProduct.material == null ||
      newProduct.shortDescription == undefined ||
      newProduct.shortDescription == null ||
      newProduct.description == undefined ||
      newProduct.description == null ||
      newProduct.specs == undefined ||
      newProduct.specs == null ||
      newProduct.price == undefined ||
      newProduct.price == null ||
      newProduct.width == undefined ||
      newProduct.width == null ||
      newProduct.height == undefined ||
      newProduct.height == null ||
      newProduct.depth == undefined ||
      newProduct.depth == null ||
      newProduct.weight == undefined ||
      newProduct.weight == null ||
      newProduct.createDate == undefined ||
      newProduct.createDate == null ||
      newProduct.quantities == undefined ||
      newProduct.quantities == null ||
      newProduct.images == undefined ||
      newProduct.images == null
    ) {
      return new ServerMessages(true, 'Petición incompleta', newProduct);
    }

    let errorsData = [];
    const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePhone = /^[0-9]{10}$/;
    /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

    if (newProduct.name.length == 0) {
      errorsData.push(new ServerMessages(true, 'Nombre del producto invalido', 1));
    }
    if (newProduct.gender == -1) {
      errorsData.push(new ServerMessages(true, 'Genero invalido', 2));
    }
    if (newProduct.idCategory == -1) {
      errorsData.push(new ServerMessages(true, 'Categoría invalida', 3));
    }
    /* if (newProduct.idProvider == -1) {
      console.log(newProduct);
      
      errorsData.push(new ServerMessages(true, 'Proveedor invalido', 3));
    } */
    if (newProduct.material.length == 0) {
      errorsData.push(new ServerMessages(true, 'Material incompleto', 4));
    }
    if (newProduct.shortDescription.length == 0) {
      errorsData.push(new ServerMessages(true, 'Descripción corta del producto incompleta', 1));
    }
    if (newProduct.description.length == 0) {
      errorsData.push(new ServerMessages(true, 'Descripción del producto incompleta', 1));
    }
    if (newProduct.specs.length == 0) {
      errorsData.push(new ServerMessages(true, 'Especificaciones del producto incompletas', 1));
    }
    if (newProduct.price == 0) {
      errorsData.push(new ServerMessages(true, 'El producto no puede costar $0', 1));
    }
    if (newProduct.width == 0) {
      errorsData.push(new ServerMessages(true, 'Anchura invalida', 1));
    }
    if (newProduct.height == 0) {
      errorsData.push(new ServerMessages(true, 'Altura invalida', 1));
    }
    if (newProduct.depth == 0) {
      errorsData.push(new ServerMessages(true, 'Profundidad invalida', 1));
    }
    if (newProduct.weight == 0) {
      errorsData.push(new ServerMessages(true, 'Peso invalida', 1));
    }
    if (newProduct.quantities.length == 0) {
      errorsData.push(new ServerMessages(true, 'Ingrese al menos una cantidad', 1));
    }

    for (let index = 0; index < newProduct.quantities.length; index++) {
      if (newProduct.quantities[index].size.length == 0) {
        errorsData.push(new ServerMessages(true, 'Talla invalida', 1));
      }
      if (newProduct.quantities[index].color.length == 0) {
        errorsData.push(new ServerMessages(true, 'Debe especificar un color', 1));
      }
    }

    for (let index = 0; index < newProduct.images.length; index++) {
      if (newProduct.images[index].name.length == 0) {
        errorsData.push(new ServerMessages(true, 'Nombre de la imagen invalido', 1));
      }
    }


    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
    }

    try {
      var productSaved: Product = await this.productRepository.create<Product>({
        idProvider: idProvider,
        activated: newProduct.activated,
        name: newProduct.name,
        referenceCode: newProduct.referenceCode,
        barCode: newProduct.barCode,
        idBrand: newProduct.idBrand,
        gender: newProduct.gender,
        idCategory: newProduct.idCategory,
        material: newProduct.material,
        shortDescription: newProduct.shortDescription,
        description: newProduct.description,
        specs: newProduct.specs,
        price: newProduct.price,
        width: newProduct.width,
        height: newProduct.height,
        depth: newProduct.depth,
        weight: newProduct.weight,
        createDate: newProduct.createDate,
        deleted: false
      }, {});

      try {
        let newQuantitys = [];
        for (let index = 0; index < newProduct.quantities.length; index++) {
          var quantitySaved: Quantity = await this.quantityRepository.create<Quantity>({
            idProduct: productSaved.idProduct,
            quantity: newProduct.quantities[index].quantity,
            description: newProduct.quantities[index].description,
            size: newProduct.quantities[index].size,
            color: newProduct.quantities[index].color,
            deleted: false,
          }, {});

          newQuantitys.push(quantitySaved);
        }
        try {
          let newImages = [];
          for (let index = 0; index < newProduct.images.length; index++) {
            var imageSaved: ProductImage = await this.productImageRepository.create<ProductImage>({
              idProduct: productSaved.idProduct,
              name: newProduct.images[index].name,
              position: newProduct.images[index].position,
              deleted: false,
            }, {});

            newImages.push(imageSaved);
          }
          return new ServerMessages(false, 'Producto guardado con éxito', {
            productSaved: productSaved,
            quantities: newQuantitys,
            images: newImages,
          });
        } catch (error) {
          return new ServerMessages(true, 'A ocurrido un error creando las imágenes', error);
        }
      } catch (error) {
        return new ServerMessages(true, 'A ocurrido un error creando las cantidades', error);
      }
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error creando el producto', error);
    }
  }


  async getProductById(idProduct: string, idProviderOwner): Promise<ServerMessages> {
    try {
      var productFinded: Product = await this.productRepository.findOne<Product>({
        where: {
          idProduct: idProduct,
          idProvider: idProviderOwner,
          deleted: false,
        },
        include: [
          {
            model: Quantity,
            as: "quantities",
            where: {
              deleted: false
            },
          }, {
            model: ProductImage,
            as: "images",
          }
        ],

        order : [
          [ { model: ProductImage, as: 'images' }, 'position', 'ASC'], 
        ]
      });

      if (!productFinded) {
        return new ServerMessages(true, 'El producto no esta disponible', {});
      }

      return new ServerMessages(false, 'Datos del producto obtenidos', productFinded);
    } catch (error) {
      return new ServerMessages(true, 'Error obteniendo los datos del cliente', {});
    }
  }

  async getProductAdminById( idProduct: string ): Promise<ServerMessages> {
    try {
      var productFinded: Product = await this.productRepository.findOne<Product>({
        where: {
          idProduct: idProduct,
          deleted: false,
        },
        include: [
          {
            model: Category,
            as: "category",
            where: {
              deleted: false,
              active : true
            },
          },{
            model: Quantity,
            as: "quantities",
            where: {
              deleted: false
            },
          }, {
            model: ProductImage,
            as: "images",
          }, {
            model: ProductStickers,
            as: "stickers",
          }
        ],

        order : [
          [ { model: ProductImage, as: 'images' }, 'position', 'ASC'], 
          [ { model: ProductStickers, as: 'stickers' }, 'position', 'ASC'], 
        ]
      });

      if (!productFinded) {
        return new ServerMessages(true, 'El producto no esta disponible', {});
      }

      return new ServerMessages(false, 'Datos del producto obtenidos', productFinded);
    } catch (error) {
      return new ServerMessages(true, 'Error obteniendo los datos del cliente', {});
    }
  }


  async editProduct(updatedProduct: Product, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (
      updatedProduct.idProduct == undefined ||
      updatedProduct.idProduct == null ||
      /* updatedProduct.idProvider == undefined ||
      updatedProduct.idProvider == null || */
      idProvider == undefined ||
      idProvider == null ||
      updatedProduct.activated == undefined ||
      updatedProduct.activated == null ||
      updatedProduct.name == undefined ||
      updatedProduct.name == null ||
      updatedProduct.referenceCode == undefined ||
      updatedProduct.referenceCode == null ||
      updatedProduct.barCode == undefined ||
      updatedProduct.barCode == null ||
      updatedProduct.idBrand == undefined ||
      updatedProduct.idBrand == null ||
      updatedProduct.gender == undefined ||
      updatedProduct.gender == null ||
      updatedProduct.idCategory == undefined ||
      updatedProduct.idCategory == null ||
      updatedProduct.material == undefined ||
      updatedProduct.material == null ||
      updatedProduct.shortDescription == undefined ||
      updatedProduct.shortDescription == null ||
      updatedProduct.description == undefined ||
      updatedProduct.description == null ||
      updatedProduct.specs == undefined ||
      updatedProduct.specs == null ||
      updatedProduct.price == undefined ||
      updatedProduct.price == null ||
      updatedProduct.width == undefined ||
      updatedProduct.width == null ||
      updatedProduct.height == undefined ||
      updatedProduct.height == null ||
      updatedProduct.depth == undefined ||
      updatedProduct.depth == null ||
      updatedProduct.weight == undefined ||
      updatedProduct.weight == null ||
      updatedProduct.createDate == undefined ||
      updatedProduct.createDate == null /* ||
      updatedProduct.quantities == undefined ||
      updatedProduct.quantities == null ||
      updatedProduct.images == undefined ||
      updatedProduct.images == null */
    ) {
      return new ServerMessages(true, 'Petición incompleta', updatedProduct);
    }

    let errorsData = [];
    //const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //const rePhone = /^[0-9]{10}$/;
    /* const reRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/; */

    if (updatedProduct.name.length == 0) {
      errorsData.push(new ServerMessages(true, 'Nombre del producto invalido', 1));
    }
    if (updatedProduct.gender == -1) {
      errorsData.push(new ServerMessages(true, 'Genero invalido', 2));
    }
    if (updatedProduct.idCategory == -1) {
      errorsData.push(new ServerMessages(true, 'Categoría invalida', 3));
    }
    /* if (newProduct.idProvider == -1) {
      console.log(newProduct);
      
      errorsData.push(new ServerMessages(true, 'Proveedor invalido', 3));
    } */
    if (updatedProduct.material.length == 0) {
      errorsData.push(new ServerMessages(true, 'Material incompleto', 4));
    }
    if (updatedProduct.shortDescription.length == 0) {
      errorsData.push(new ServerMessages(true, 'Descripción corta del producto incompleta', 1));
    }
    if (updatedProduct.description.length == 0) {
      errorsData.push(new ServerMessages(true, 'Descripción del producto incompleta', 1));
    }
    if (updatedProduct.specs.length == 0) {
      errorsData.push(new ServerMessages(true, 'Especificaciones del producto incompletas', 1));
    }
    if (updatedProduct.price == 0) {
      errorsData.push(new ServerMessages(true, 'El producto no puede costar $0', 1));
    }
    if (updatedProduct.width == 0) {
      errorsData.push(new ServerMessages(true, 'Anchura invalida', 1));
    }
    if (updatedProduct.height == 0) {
      errorsData.push(new ServerMessages(true, 'Altura invalida', 1));
    }
    if (updatedProduct.depth == 0) {
      errorsData.push(new ServerMessages(true, 'Profundidad invalida', 1));
    }
    if (updatedProduct.weight == 0) {
      errorsData.push(new ServerMessages(true, 'Peso invalida', 1));
    }
    if (updatedProduct.quantities.length == 0) {
      errorsData.push(new ServerMessages(true, 'Ingrese al menos una cantidad', 1));
    }

    /* for (let index = 0; index < newProduct.quantities.length; index++) {
      if (newProduct.quantities[index].size.length == 0) {
        errorsData.push(new ServerMessages(true, 'Talla invalida', 1));
      }
      if (newProduct.quantities[index].color.length == 0) {
        errorsData.push(new ServerMessages(true, 'Debe especificar un color', 1));
      }
    } */

    /* for (let index = 0; index < newProduct.images.length; index++) {
      if (newProduct.images[index].name.length == 0) {
        errorsData.push(new ServerMessages(true, 'Nombre de la imagen invalido', 1));
      }
    } */


    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la cuenta inválidos', errorsData);
    }

    var productFinded: Product = await this.productRepository.findOne<Product>({
      where: {
        idProduct: updatedProduct.idProduct,
        idProvider: idProvider,
        deleted: false
      }
    });

    if (!productFinded) {
      return new ServerMessages(true, 'El producto no esta disponible', {});
    }

    try {
      productFinded.activated = updatedProduct.activated;
      productFinded.name = updatedProduct.name;
      productFinded.referenceCode = updatedProduct.referenceCode;
      productFinded.barCode = updatedProduct.barCode;
      productFinded.idBrand = updatedProduct.idBrand;
      productFinded.gender = updatedProduct.gender;
      productFinded.idCategory = updatedProduct.idCategory;
      productFinded.material = updatedProduct.material;
      productFinded.shortDescription = updatedProduct.shortDescription;
      productFinded.description = updatedProduct.description;
      productFinded.specs = updatedProduct.specs;
      productFinded.price = updatedProduct.price;
      productFinded.width = updatedProduct.width;
      productFinded.height = updatedProduct.height;
      productFinded.depth = updatedProduct.depth;
      productFinded.weight = updatedProduct.weight;
      productFinded.createDate = updatedProduct.createDate;
      productFinded.deleted = false;
      await productFinded.save();

      return new ServerMessages(false, 'Producto actualizado con éxito', productFinded);

      /* try {
        let newQuantitys = [];
        for (let index = 0; index < newProduct.quantities.length; index++) {
          var quantitySaved: Quantity = await this.quantityRepository.create<Quantity>({
            idProduct: productSaved.idProduct,
            quantity: newProduct.quantities[index].quantity,
            description: newProduct.quantities[index].description,
            size: newProduct.quantities[index].size,
            color: newProduct.quantities[index].color,
            deleted: false,
          }, {});

          newQuantitys.push(quantitySaved);
        }
      } catch (error) {
        return new ServerMessages(true, 'A ocurrido un error creando las cantidades', error);
      } */
      /* try {
        let newImages = [];
        for (let index = 0; index < newProduct.images.length; index++) {
          var imageSaved: ProductImage = await this.productImageRepository.create<ProductImage>({
            idProduct: productSaved.idProduct,
            name: newProduct.images[index].name,
            position: newProduct.images[index].position,
            deleted: false,
          }, {});

          newImages.push(imageSaved);
        }
        return new ServerMessages(false, 'Producto guardado con éxito', {
          productSaved: productSaved,
          quantities: newQuantitys,
          images: newImages,
        });
      } catch (error) {
        return new ServerMessages(true, 'A ocurrido un error creando las imágenes', error);
      } */

    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error actualizando el producto', error);
    }
  }


  async addProductQuantity(newQuantity: Quantity, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (

      idProvider == undefined ||
      idProvider == null ||
      newQuantity.idProduct == undefined ||
      newQuantity.idProduct == null ||
      newQuantity.quantity == undefined ||
      newQuantity.quantity == null ||
      newQuantity.size == undefined ||
      newQuantity.size == null ||
      newQuantity.color == undefined ||
      newQuantity.color == null ||
      newQuantity.description == undefined ||
      newQuantity.description == null ||
      newQuantity.deleted == undefined ||
      newQuantity.deleted == null
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let errorsData = [];


    if (newQuantity.size.length == 0) {
      errorsData.push(new ServerMessages(true, 'Talla invalida', 1));
    }
    if (newQuantity.color.length == 0) {
      errorsData.push(new ServerMessages(true, 'Debe especificar un color', 1));
    }


    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la cantidad inválidos', errorsData);
    }

    var productFinded: Product = await this.productRepository.findOne<Product>({
      where: {
        idProduct: newQuantity.idProduct,
        idProvider: idProvider,
        deleted: false
      }
    });

    if (!productFinded) {
      return new ServerMessages(true, 'El producto no esta disponible', {});
    }


    try {
      var quantitySaved: Quantity = await this.quantityRepository.create<Quantity>({
        idProduct: newQuantity.idProduct,
        quantity: newQuantity.quantity,
        description: newQuantity.description,
        size: newQuantity.size,
        color: newQuantity.color,
        deleted: false,
      }, {});

      return new ServerMessages(false, 'Cantidad añadida con éxito', quantitySaved);
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error creando las cantidad', error);
    }
  }

  async updateProductQuantity(updatedQuantity: Quantity, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (

      idProvider == undefined ||
      idProvider == null ||
      updatedQuantity.idProduct == undefined ||
      updatedQuantity.idProduct == null ||
      updatedQuantity.quantity == undefined ||
      updatedQuantity.quantity == null ||
      updatedQuantity.size == undefined ||
      updatedQuantity.size == null ||
      updatedQuantity.color == undefined ||
      updatedQuantity.color == null ||
      updatedQuantity.description == undefined ||
      updatedQuantity.description == null ||
      updatedQuantity.deleted == undefined ||
      updatedQuantity.deleted == null
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let errorsData = [];


    if (updatedQuantity.size.length == 0) {
      errorsData.push(new ServerMessages(true, 'Talla invalida', 1));
    }
    if (updatedQuantity.color.length == 0) {
      errorsData.push(new ServerMessages(true, 'Debe especificar un color', 1));
    }


    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la cantidad inválidos', errorsData);
    }

    var productFinded: Product = await this.productRepository.findOne<Product>({
      where: {
        idProduct: updatedQuantity.idProduct,
        idProvider: idProvider,
        deleted: false
      }
    });

    if (!productFinded) {
      return new ServerMessages(true, 'El producto no esta disponible', {});
    }

    var quantityFinded: Quantity = await this.quantityRepository.findOne<Quantity>({
      where: {
        idQuantity: updatedQuantity.idQuantity,
        idProduct: updatedQuantity.idProduct,
        deleted: false
      }
    });

    if (!quantityFinded) {
      return new ServerMessages(true, 'La cantidad no esta disponible', {});
    }


    try {
        quantityFinded.quantity = updatedQuantity.quantity;
        quantityFinded.description = updatedQuantity.description;
        quantityFinded.size = updatedQuantity.size;
        quantityFinded.color = updatedQuantity.color;
        quantityFinded.deleted = updatedQuantity.deleted;
      
        await quantityFinded.save();
      return new ServerMessages(false, 'Cantidad actualizada con éxito', quantityFinded);
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error actualizando la cantidad', error);
    }
  }

  async deleteProductQuantity(idQuantity: string, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (
      idProvider == undefined ||
      idProvider == null ||
      idQuantity == undefined ||
      idQuantity == null 
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    var quantityFinded: Quantity = await this.quantityRepository.findOne<Quantity>({
      where: {
        idQuantity: idQuantity,
        deleted: false
      },
      include : [{
        model : Product,
        as : "product",
        where: {
          idProvider: idProvider,
          deleted: false
        },
        include : [{
          model : Quantity,
          as : "quantities",
          where: {
            deleted: false
          },
        }]
      }]
    });

    if (!quantityFinded) {
      return new ServerMessages(true, 'La cantidad no esta disponible', {});
    }

    if (quantityFinded.product.quantities.length == 1) {
      return new ServerMessages(true, 'No se puede dejar sin cantidades el producto', {});
    }

    try {
        quantityFinded.deleted = true;
      
        await quantityFinded.save();
      return new ServerMessages(false, 'Cantidad borrada con éxito', quantityFinded);
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error borrando la cantidad', error);
    }
  }

  async addProductImage(newImageData: ProductImage, idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (
      idProvider == undefined ||
      idProvider == null ||
      newImageData.idProduct == undefined ||
      newImageData.idProduct == null ||
      newImageData.name == undefined ||
      newImageData.name == null ||
      newImageData.position == undefined ||
      newImageData.position == null
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let errorsData = [];

    if (newImageData.name.length == 0) {
      errorsData.push(new ServerMessages(true, 'Nombre invalido', 1));
    }

    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la imagen inválidos', errorsData);
    }

    var productFinded: Product = await this.productRepository.findOne<Product>({
      where: {
        idProduct: newImageData.idProduct,
        idProvider: idProvider,
        deleted: false
      }
    });

    if (!productFinded) {
      return new ServerMessages(true, 'El producto no esta disponible', {});
    }


    try {
      var imageSaved: ProductImage = await this.productImageRepository.create<ProductImage>({
        idProduct: newImageData.idProduct,
        name: newImageData.name,
        position: newImageData.position
      }, {});

      return new ServerMessages(false, 'Imagen añadida con éxito', imageSaved);
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error creando la imagen', error);
    }
  }

  async editProductImages(newImagesData: ProductImage[], idProvider: number): Promise<ServerMessages> {
    //return new ServerMessages(true, 'Petición incompleta', {});
    if (
      idProvider == undefined ||
      idProvider == null ||
      newImagesData == undefined ||
      newImagesData == null
    ) {
      return new ServerMessages(true, 'Petición incompleta', {});
    }

    let errorsData = [];

    if (newImagesData.length == 0) {
      errorsData.push(new ServerMessages(true, 'Sin cambios', 1));
    }

    if (errorsData.length != 0) {
      return new ServerMessages(true, 'Campos de la imagen inválidos', errorsData);
    }

    try {
      for (let index = 0; index < newImagesData.length; index++) {
        var imageFinded: ProductImage = await this.productImageRepository.findOne<ProductImage>({
          where: {
            idProductImage: newImagesData[index].idProductImage,
          }
        });
    
        if (!imageFinded) {
          errorsData.push(new ServerMessages( true, 'la imagen '+ newImagesData[index].idProductImage +' no esta disponible', {} ) );
        }else{
          imageFinded.position = newImagesData[index].position;
          await imageFinded.save();
        }
      }

      if (errorsData.length != 0) {
        return new ServerMessages(true, 'Campos de la imagen inválidos', errorsData);
      }
      
  
      return new ServerMessages(false, 'Imágenes editadas con éxito', {});
    } catch (error) {
      return new ServerMessages(true, 'A ocurrido un error editando las imágenes', error);
    }
  }
}
