import { Controller, Post, UseInterceptors, UploadedFiles, Body, Param, Get, Res, UseGuards} from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';
import { ServerMessages } from '../../utils/serverMessages.util';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';

var brandsPath = './storage/brands/';
var productsPath = './storage/products/';
var productsStickersPath = './storage/product-stickers/';

const jpgFileFilter = (req, file, callback) => {
    let ext = path.extname(file.originalname);

    if(ext !== '.jpg'){
        req.fileValidationError = 'Invalid file type';
        return callback(new Error('Invalid file type'), false);
    }
    return callback(null, true);
}

//Reasigna los valores para guardar la imagen (carpeta y si no existe la crea)
var storageBrand = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log({stringActual : dirCompany , stringdirectorio : dir});
        if (!fs.existsSync('./storage/') ){
            fs.mkdirSync('./storage/');
        }
        if (!fs.existsSync(brandsPath) ){
            fs.mkdirSync(brandsPath);
        }
        cb(null, brandsPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname );
    }
});

//Reasigna los valores para guardar la imagen de las canciones segun el nombre del archivo(carpeta y si no existe la crea)
var storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirProduct = file.originalname.toString().slice(0,file.originalname.toString().indexOf("-"));
        var dir = productsPath+dirProduct+'/';
        //console.log({stringActual : dirSong , stringdirectorio : dir});
        if (!fs.existsSync(productsPath)){
            fs.mkdirSync(productsPath);
        }
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        //Desde el nombre ya deberia de venir como se guardara la imagen (piano,guitar o bass)
        let name : String = file.originalname.toString().slice(
            file.originalname.toString().indexOf("-")+1,file.originalname.toString().lengt );
        //console.log("nombre del archivo de la cancion " + name);
        cb( null, name);
    }
});

var storageProductStickers = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirProduct = file.originalname.toString().slice(0,file.originalname.toString().indexOf("-"));
        var dir = productsStickersPath+dirProduct+'/';
        //console.log({stringActual : dirSong , stringdirectorio : dir});
        if (!fs.existsSync(productsStickersPath)){
            fs.mkdirSync(productsStickersPath);
        }
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        //Desde el nombre ya deberia de venir como se guardara la imagen (piano,guitar o bass)
        let name : String = file.originalname.toString().slice(
            file.originalname.toString().indexOf("-")+1,file.originalname.toString().lengt );
        //console.log("nombre del archivo de la cancion " + name);
        cb( null, name);
    }
});

@Controller('uploads')
export class UploadsController {
    constructor(private uploadsService : UploadsService){}
    //////////////////////////////////////MARCA/////////////////////////////////////////////////
    //Crea y guarda la imagen de la marca y su directorio
    @Post('brand-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageBrand
    }))
    async brandImageFileUpload(@UploadedFiles() images): Promise<any> {
        return await this.uploadsService.setBrandHaveImage(images[0].originalname);
    }

    //URL que proporciona las imagenes de las marcas 
    @Get('brand-image/:idBrand')
    /* @UseGuards(AuthGuard()) */
    async serveBrandImage(@Param('idBrand') idBrand : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idBrand+'.jpg' , { root: 'storage/brands/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Imagen de la marca "+ idBrand+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Imagen de la marca " + idBrand + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen de la marca "+ idBrand +" no encontrada.",error);
        }
        
    }
    //Elimina una imagen de una marca segun el id de la imagen
    @Get('brand-delete-image/:idBrand')
    @UseGuards(AuthGuard())
    async deleteBrandImage(@Param('idBrand') idBrand : string): Promise<any> {
        return await this.uploadsService.deleteImageBrand(idBrand );
    }

    //////////////////////////////////////PRODUCTOS IMAGENES/////////////////////////////////////////////////
    //Crea y guarda la imagen del producto y su directorio
    @Post('product-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageProduct
    }))
    async productImageFileUpload(@UploadedFiles() images): Promise<any> {
        return new ServerMessages(false , "Se subió correctamente la imagen del producto ",{});
    }

    //URL que proporciona las imágenes de los usuarios 
    @Get('product-image/:idProduct/:idProductImage')
    /* @UseGuards(AuthGuard()) */
    async serveProductImage(@Param('idProduct') idProduct : String,@Param('idProductImage') idProductImage : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idProductImage+'.jpg' , { root: 'storage/products/'+idProduct+'/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Imagen del producto "+ idProductImage+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Imagen del producto " + idProductImage + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen del producto "+ idProductImage +" no encontrada.",error);
        }
        
    }
    //Elimina uns imagen de un producto por id
    @Get('product-delete-image/:idProductImage')
    @UseGuards(AuthGuard())
    async deleteProductImage(@Param('idProductImage') idProductImage : string): Promise<any> {
        return await this.uploadsService.deleteProductImage(idProductImage );
    }

    //////////////////////////////////////PRODUCTOS STICKERS/////////////////////////////////////////////////
    //Crea y guarda la imagen del producto y su directorio
    @Post('product-sticker/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageProductStickers
    }))
    async productStickerFileUpload(@UploadedFiles() sticker): Promise<any> {
        return new ServerMessages(false , "Se subió correctamente el sticker del producto ",{});
    }

    //URL que proporciona las imágenes de los stickers 
    @Get('product-sticker/:idProduct/:idProductSticker')
    /* @UseGuards(AuthGuard()) */
    async serveProductSticker(@Param('idProduct') idProduct : String,@Param('idProductSticker') idProductSticker : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idProductSticker+'.jpg' , { root: 'storage/product-stickers/'+idProduct+'/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Sticker del producto "+ idProductSticker+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Sticker del producto " + idProductSticker + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Sticker del producto "+ idProduct +" no encontrada.",error);
        }
        
    }
    //Elimina un sticker de un producto por id
    @Get('product-delete-sticker/:idProductSticker')
    @UseGuards(AuthGuard())
    async deleteProductSticker(@Param('idProductSticker') idProductSticker : string): Promise<any> {
        return await this.uploadsService.deleteProductSticker(idProductSticker );
    }
}
