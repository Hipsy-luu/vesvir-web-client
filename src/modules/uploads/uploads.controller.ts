import { Controller, Post, UseInterceptors, UploadedFiles, Body, Param, Get, Res, UseGuards} from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';
import { ServerMessages } from '../../utils/serverMessages.util';
import { AuthGuard } from '@nestjs/passport';

var usersPath = './storage/users/';
var bandsPath = './storage/bands/';
var setsPath = './storage/sets/';
var songsPath = './storage/songs/';

const jpgFileFilter = (req, file, callback) => {
    let ext = path.extname(file.originalname);

    if(ext !== '.jpg'){
        req.fileValidationError = 'Invalid file type';
        return callback(new Error('Invalid file type'), false);
    }
    return callback(null, true);
}

//Reasigna los valores para guardar la imagen (carpeta y si no existe la crea)
var storageUsers = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log({stringActual : dirCompany , stringdirectorio : dir});
        if (!fs.existsSync('./storage/') ){
            fs.mkdirSync('./storage/');
        }
        if (!fs.existsSync(usersPath) ){
            fs.mkdirSync(usersPath);
        }
        cb(null, usersPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname );
        
    }
});

var storageBands = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log({stringActual : dirCompany , stringdirectorio : dir});
        if (!fs.existsSync('./storage/') ){
            fs.mkdirSync('./storage/');
        }
        if (!fs.existsSync(bandsPath) ){
            fs.mkdirSync(bandsPath);
        }
        cb(null, bandsPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname );
        
    }
});

var storageSets = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log({stringActual : dirCompany , stringdirectorio : dir});
        if (!fs.existsSync('./storage/') ){
            fs.mkdirSync('./storage/');
        }
        if (!fs.existsSync(setsPath) ){
            fs.mkdirSync(setsPath);
        }
        cb(null, setsPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname );
        
    }
});

//Reasigna los valores para guardar la imagen de las canciones segun el nombre del archivo(carpeta y si no existe la crea)
var storageSongs = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirSong = file.originalname.toString().slice(0,file.originalname.toString().indexOf("-"));
        var dir = songsPath+dirSong+'/';
        //console.log({stringActual : dirSong , stringdirectorio : dir});
        if (!fs.existsSync(songsPath)){
            fs.mkdirSync(songsPath);
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
    constructor(){}
    //////////////////////////////////////USUARIOS/////////////////////////////////////////////////
    //Crea y guarda la imagen del usuario y su directorio
    @Post('user-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageUsers
    }))
    async userImageFileUpload(@UploadedFiles() images): Promise<any> {
        return new ServerMessages(false,"Imagen del usuario " + images[0].originalname + " subida.",{});
    }

    //URL que proporciona las imagenes de los usuarios 
    @Get('user-image/:idUser')
    @UseGuards(AuthGuard())
    async serveUserImage(@Param('idUser') idUser : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idUser+'.jpg' , { root: 'storage/users/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Imagen del usuaruo"+idUser+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Imagen del usuario " +idUser + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen del usuaruo"+idUser+" no encontrada.",error);
        }
        
    }
    //Elimina la imagen de un usuario
    @Get('user-delete-image/:idUser')
    @UseGuards(AuthGuard())
    async deleteUserImage(@Param('idUser') idUser : String): Promise<any> {
        return await this.deleteFile('storage/users/'+idUser+'.jpg');
    }

    //////////////////////////////////////BANDAS/////////////////////////////////////////////////
    //Crea y guarda la imagen de la BANDAS y su directorio
    @Post('band-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageBands
    }))
    async bandImageFileUpload(@UploadedFiles() images): Promise<any> {
        return new ServerMessages(false,"Imagen de la banda " + images[0].originalname + " subida.",{});
    }

    //URL que proporciona las imagenes de las BANDAS 
    @Get('band-image/:idBand')
    @UseGuards(AuthGuard())
    async serveBandImage(@Param('idBand') idBand : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idBand+'.jpg' , { root: 'storage/bands/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Imagen de la banda "+idBand+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Imagen de la banda " +idBand + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen de la banda "+idBand+" no encontrada.",error);
        }
    }
    //Elimina la imagen de una BANDAS
    @Get('band-delete-image/:idBand')
    @UseGuards(AuthGuard())
    async deleteBandImage(@Param('idBand') idBand : String): Promise<any> {
        return await this.deleteFile('storage/songs/'+idBand+'.jpg');
    }

    //////////////////////////////////////Sets/////////////////////////////////////////////////
    //Crea y guarda la imagen de un SET y su directorio
    @Post('set-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageSets
    }))
    async setImageFileUpload(@UploadedFiles() images): Promise<any> {
        return new ServerMessages(false,"Imagen del set " + images[0].originalname + " subida.",{});
    }

    //URL que proporciona las imagenes un SET
    @Get('set-image/:idSet')
    //@UseGuards(AuthGuard())
    async serveSetImage(@Param('idSet') idSet : String, @Res() res): Promise<any> {
        try {
            res.sendFile( idSet+'.jpg' , { root: 'storage/sets/'}, 
            (err) => {
                if (err) {
                    return new ServerMessages(true,"Imagen del set"+idSet+" no encontrada.",err);
                } else {
                    return new ServerMessages(false,"Imagen del set " +idSet + " enviada.",{});
                }
            }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen del set"+idSet+" no encontrada.",error);
        }
    }
    //Elimina la imagen un SET
    @Get('set-delete-image/:idSet')
    @UseGuards(AuthGuard())
    async deleteSetImage(@Param('idSet') idSet : String): Promise<any> {
        return await this.deleteFile('storage/sets/'+idSet+'.jpg');
    }
    //////////////////////////////////////CANCIONES/////////////////////////////////////////////////
    //Crea y guarda la imagen de la cancion y su directorio
    @Post('song-image/')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files[]', 1, {
        fileFilter: jpgFileFilter,
        storage: storageSongs
    }))
    async songImageFileUpload(@UploadedFiles() images): Promise<any> {
        return new ServerMessages(false,"Imagen " + images[0].originalname + " subida.",{});
    }

    //URL que proporciona las imagenes de los usuarios 
    @Get('song-image/:idSong/:nameFile')
    @UseGuards(AuthGuard())
    async serveSongImage(@Param('idSong') idSong : String,@Param('nameFile') nameFile : String, @Res() res): Promise<any> {
        try {
            res.sendFile( nameFile+'.jpg' , { root: 'storage/songs/'+idSong+'/'}, 
                (err) => {
                    if (err) {
                        return new ServerMessages(true,"Imagen del usuaruo"+idSong+" no encontrada.",err);
                    } else {
                        return new ServerMessages(false,"Imagen del usuario " +idSong + " enviada.",{});
                    }
                }
            );
        } catch (error) {
            return new ServerMessages(true,"Imagen de la cancion "+idSong+" no encontrada.",error);
        }
        
    }
    //Elimina alguna de las imagenes de la cancion segun su nombre de archivo
    @Get('song-delete-image/:idSong/:nameFile')
    @UseGuards(AuthGuard())
    async deleteSongImage(@Param('idSong') idSong : String,@Param('nameFile') nameFile : String): Promise<any> {
        return await this.deleteFile('storage/songs/'+idSong+'/'+nameFile+'.jpg');
    } 

    //Esta funcion ayuda a varios controladores a borrar los archivos solo debe recibir el path relativo con 
    //su nombre
    deleteFile(namePath : string) : Promise<any>{
        return new Promise((resolve,reject)=>{
            fs.unlink(namePath , (error) => {
                if (error) {
                    resolve( new ServerMessages(true,"Imagen no existe.",{}) );
                }else{
                    resolve( new ServerMessages(false,"Imagen eliminada.",{}));
                };
            });
        })
    }
}
