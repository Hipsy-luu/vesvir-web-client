import { ServerMessages } from './../../utils/serverMessages.util';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import * as fs from 'fs';
import { Direction } from '../../models/directions.entity';
import { Category } from '../../models/categories.entity';
import { Brand } from '../../models/brands.entity';
import { ProductImage } from '../../models/productImages.entity';
import { ProductStickers } from '../../models/productStickers.entity';

@Injectable()
export class UploadsService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('CategoriesRepository') private readonly categoriesRepository: typeof Category,
        @Inject('BrandRepository') private readonly brandRepository: typeof Brand,
        @Inject('ProductImageRepository') private readonly productImageRepository: typeof ProductImage,
        @Inject('ProductStickersRepository') private readonly productStickersRepository: typeof ProductStickers,
    ) { }

    async setBrandHaveImage(imageName: string) : Promise<any> {
        let idBrand = imageName.substr(0,imageName.indexOf(".jpg"));
        try {
            // Change haveImage to true to the user
            let bandForUpdated : Brand =  await this.brandRepository.findOne<Brand>({
                where: {
                    idBrand: idBrand,
                    deleted : false
                }
            });

            if(bandForUpdated == null){
                return new ServerMessages(true , "Error seteando imagen de la marca, la marca no existe",{});
            }
            bandForUpdated.haveImage = true;
            await bandForUpdated.save();
            
            return new ServerMessages(false , "Se subió correctamente la imagen de la marca "+ bandForUpdated.idBrand,bandForUpdated);
        } catch (error) {
            return new ServerMessages(true , "Error seteando imagen de la marca",error);
        }
    }

    async deleteImageBrand(idBrand: string) : Promise<any> {
        return new Promise(async (resolve,reject)=>{
            fs.unlink('storage/brands/'+idBrand+'.jpg' , async (error) => {
                if (error) {
                    resolve( new ServerMessages(true,"Imagen no existe.",{}) );
                }else{
                    try {
                        // Change haveImage to true to the user
                        let brandForUpdated : Brand =  await this.brandRepository.findOne<Brand>({
                            where: {
                                idBrand: idBrand,
                                deleted : false
                            }
                        });
            
                        if(brandForUpdated == null){
                            resolve( new ServerMessages(true , "Error seteando imagen de la marca, la marca no esta disponible",{}) );
                        }
                        brandForUpdated.haveImage = false;
                        let brand = await brandForUpdated.save();
                        
                        resolve( new ServerMessages(false , "Se elimino correctamente la imagen de la marca "+ brand.idBrand,brand) );
                    } catch (error) {
                        resolve( new ServerMessages(true , "Error seteando imagen de la marca",error) );
                    }
                };
            });
        })
    }

    async deleteProductImage(idProductImage: string) : Promise<any> {
        return new Promise(async (resolve,reject)=>{
            let imageForDelete : ProductImage =  await this.productImageRepository.findOne<ProductImage>({
                where: {
                    idProductImage: idProductImage
                }
            });

            if(imageForDelete == null){
                resolve( new ServerMessages(true , "La imagen no esta disponible",{}) );
            }
            
            fs.unlink('storage/products/'+imageForDelete.idProduct+'/'+idProductImage+'.jpg' , async (error) => {
                if (error) {
                    resolve( new ServerMessages(true,"Imagen no existe.",{}) );
                }else{
                    try {
                        let idProduct = imageForDelete.idProduct;

                        await imageForDelete.destroy();

                        let imagesForUpdate : ProductImage[] =  await this.productImageRepository.findAll<ProductImage>({
                            where: {
                                idProduct: idProduct
                            }
                        });


                        for (let index = 0; index < imagesForUpdate.length; index++) {
                            imagesForUpdate[index].position = index;
                            await imagesForUpdate[index].save();
                        }
            
                        resolve( new ServerMessages(false , "Se elimino correctamente la imagen del producto "+ imageForDelete.idProductImage,imagesForUpdate) );
                    } catch (error) {
                        resolve( new ServerMessages(true , "Error eliminando la imagen",error) );
                    }
                };
            });
        })
        
    }


    async deleteProductSticker(idProductSticker: string) : Promise<any> {
        return new Promise(async (resolve,reject)=>{
            let stickerForDelete : ProductStickers =  await this.productStickersRepository.findOne<ProductStickers>({
                where: {
                    idProductSticker: idProductSticker
                }
            });

            if(stickerForDelete == null){
                resolve( new ServerMessages(true , "El sticker no esta disponible",{}) );
            }
            
            fs.unlink('storage/product-stickers/'+stickerForDelete.idProduct+'/'+idProductSticker+'.jpg' , async (error) => {
                if (error) {
                    resolve( new ServerMessages(true,"El sticker no existe.",{}) );
                }else{
                    try {
                        let idProduct = stickerForDelete.idProduct;

                        await stickerForDelete.destroy();

                        let stickersForUpdate : ProductStickers[] =  await this.productStickersRepository.findAll<ProductStickers>({
                            where: {
                                idProduct: idProduct
                            }
                        });


                        for (let index = 0; index < stickersForUpdate.length; index++) {
                            stickersForUpdate[index].position = index;
                            await stickersForUpdate[index].save();
                        }
            
                        resolve( new ServerMessages(false , "Se elimino correctamente el sticker del producto "+ idProduct,stickersForUpdate) );
                    } catch (error) {
                        resolve( new ServerMessages(true , "Error eliminando el sticker",error) );
                    }
                };
            });
        })
        
    }

}
