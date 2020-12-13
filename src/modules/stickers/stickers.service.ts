import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { Category } from '../../models/categories.entity';
import { Product } from '../../models/products.entity';
import { Quantity } from '../../models/quantitys.entity';
import { ProductImage } from '../../models/productImages.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { ServerMessages } from '../../utils/serverMessages.util';
import { ProductStickers as ProductSticker, ProductStickers } from '../../models/productStickers.entity';

@Injectable()
export class StickersService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('CategoriesRepository') private readonly categoriesRepository: typeof Category,
        @Inject('ProductRepository') private readonly productRepository: typeof Product,
        @Inject('QuantityRepository') private readonly quantityRepository: typeof Quantity,
        @Inject('ProductImageRepository') private readonly productImageRepository: typeof ProductImage,
        @Inject('ProductStickersRepository') private readonly productStickerRepository: typeof ProductSticker,
        private mailCenterService: MailCenterService,
      ) { }

      async addProductSticker(newImageData: ProductSticker ): Promise<ServerMessages> {
        //return new ServerMessages(true, 'Petición incompleta', {});
        if (
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
            deleted: false
          }
        });
    
        if (!productFinded) {
          return new ServerMessages(true, 'El producto no esta disponible', {});
        }
    
    
        try {
          var stickerSaved: ProductStickers = await this.productStickerRepository.create<ProductStickers>({
            idProduct: newImageData.idProduct,
            name: newImageData.name,
            position: newImageData.position
          }, {});
    
          return new ServerMessages(false, 'Imagen añadida con éxito', stickerSaved);
        } catch (error) {
          return new ServerMessages(true, 'A ocurrido un error creando la imagen', error);
        }
      }

      async editProductStickers(newStickersData: ProductSticker[]): Promise<ServerMessages> {
        //return new ServerMessages(true, 'Petición incompleta', {});
        if (
          newStickersData == undefined ||
          newStickersData == null
        ) {
          return new ServerMessages(true, 'Petición incompleta', {});
        }
    
        let errorsData = [];
    
        if (newStickersData.length == 0) {
          errorsData.push(new ServerMessages(true, 'Sin cambios', 1));
        }
    
        if (errorsData.length != 0) {
          return new ServerMessages(true, 'Campos del sticker inválidos', errorsData);
        }
    
        try {
          for (let index = 0; index < newStickersData.length; index++) {
            var stickerFinded: ProductSticker = await this.productStickerRepository.findOne<ProductSticker>({
              where: {
                idProductSticker: newStickersData[index].idProductSticker,
              },
            });
        
            if (!stickerFinded) {
              errorsData.push(new ServerMessages( true, 'El sticker '+ newStickersData[index].idProductSticker +' no esta disponible', {} ) );
            }else{
                stickerFinded.position = newStickersData[index].position;
                await stickerFinded.save();
            }
          }
    
          if (errorsData.length != 0) {
            return new ServerMessages(true, 'Campos del sticker inválidos', errorsData);
          }
      
          return new ServerMessages(false, 'Stickers editados con éxito', {});
        } catch (error) {
          return new ServerMessages(true, 'A ocurrido un error editando los stickers', error);
        }
      }
}
