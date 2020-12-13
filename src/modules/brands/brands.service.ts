import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { Category } from '../../models/categories.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { ServerMessages } from '../../utils/serverMessages.util';
import { Brand } from '../../models/brands.entity';
import { Product } from '../../models/products.entity';

@Injectable()
export class BrandsService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('CategoriesRepository') private readonly categoriesRepository: typeof Category,
        @Inject('BrandRepository') private readonly brandRepository: typeof Brand,
        @Inject('ProductRepository') private readonly productRepository: typeof Product,
        private mailCenterService: MailCenterService,
    ) { }

    async getBrands(): Promise<ServerMessages> {
        try {
            var brandsList: Brand[] = await this.brandRepository.findAll<Brand>({
                where: {
                    deleted: false,
                },
               /*  include: [
                    {
                        model: Product,
                        as: "products",
                        where: { 
                            deleted: false
                        },
                    }
                ] */
            }).map(async (brand: Brand) => {
                var brandsProduct: Product[] = await this.productRepository.findAll<Product>({
                    attributes: {include : ["idProduct"]},
                    where: {
                        idBrand: brand.idBrand,
                        deleted: false,
                    },
                });
                return Object.assign(
                    {
                        idBrand: brand.idBrand,
                        name: brand.name,
                        haveImage: brand.haveImage,
                        noProducts : brandsProduct.length,
                        active: brand.active,
                        deleted : brand.deleted,
                        createDate : brand.createDate,
                    });
            });;
            return new ServerMessages(false, 'Lista de marcas obtenida', brandsList);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de marcas', {});
        }
    }

    async getBrandsProduct(): Promise<ServerMessages> {
        try {
            var brandsList: Brand[] = await this.brandRepository.findAll<Brand>({
                where: {
                    active : true,
                    deleted: false,
                },
            }).map(async (brand: Brand) => {
                /* var brandsProduct: Product[] = await this.productRepository.findAll<Product>({
                    attributes: {include : ["idProduct"]},
                    where: {
                        idBrand: brand.idBrand,
                        deleted: false,
                    },
                }); */
                return Object.assign(
                    {
                        idBrand: brand.idBrand,
                        name: brand.name,
                        haveImage: brand.haveImage,
                        active: brand.active,
                        deleted : brand.deleted,
                        createDate : brand.createDate,
                    });
            });;
            return new ServerMessages(false, 'Lista de marcas obtenida', brandsList);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de marcas', {});
        }
    }

    async createBrand(newBrand: Brand): Promise<ServerMessages> {
        if (
            newBrand.name == undefined ||
            newBrand.name == undefined ||
            newBrand.haveImage == undefined ||
            newBrand.haveImage == undefined ||
            newBrand.active == undefined ||
            newBrand.active == undefined ||
            newBrand.deleted == undefined ||
            newBrand.deleted == undefined 
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsValidationsData = [];

        //Directions Data Validations
        if (newBrand.name == "") {
            errorsValidationsData.push(new ServerMessages(true, 'Nombre de la marca invalido', 1));
        }

        if (errorsValidationsData.length != 0) {
            return new ServerMessages(true, 'Campos de la marca inválidos', errorsValidationsData);
        }

        //Validación categoría existente
        var brandFunded: Brand = await this.brandRepository.findOne<Brand>({
            where: { 
                name: newBrand.name,
                deleted: false 
            },
        });

        if (brandFunded) {
            return new ServerMessages(true, 'Ya existe una marca con el nombre proporcionado', {});
        }

        try {
            var brandCreated : Brand = await this.brandRepository.create<Brand>({
                name: newBrand.name,
                haveImage: newBrand.haveImage,
                active: newBrand.active,
                deleted: false,
            }, {});
            return new ServerMessages(false, 'Marca creada con éxito', brandCreated);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error creando la Marca', error);
        }
    }

    async editBrand(updatedBrand: Brand): Promise<ServerMessages> {
        if (
            updatedBrand.idBrand == undefined ||
            updatedBrand.idBrand == undefined ||
            updatedBrand.name == undefined ||
            updatedBrand.name == undefined ||
            updatedBrand.haveImage == undefined ||
            updatedBrand.haveImage == undefined ||
            updatedBrand.active == undefined ||
            updatedBrand.active == undefined ||
            updatedBrand.deleted == undefined ||
            updatedBrand.deleted == undefined 
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsValidationsData = [];

        //Directions Data Validations
        if (updatedBrand.name == "") {
            errorsValidationsData.push(new ServerMessages(true, 'Nombre de la marca invalido', 1));
        }

        if (errorsValidationsData.length != 0) {
            return new ServerMessages(true, 'Campos de la marca inválidos', errorsValidationsData);
        }

        //Validación categoría existente
        var brandFunded: Brand = await this.brandRepository.findOne<Brand>({
            where: { 
                idBrand: updatedBrand.idBrand,
                deleted: false 
            },
        });

        if (!brandFunded) {
            return new ServerMessages(true, 'La marca no esta disponible', {});
        }

        try {
            brandFunded.name = updatedBrand.name;
            brandFunded.haveImage = updatedBrand.haveImage;
            brandFunded.active = updatedBrand.active;
            brandFunded.deleted = updatedBrand.deleted;
            brandFunded.name = updatedBrand.name;
            
            await brandFunded.save();

            return new ServerMessages(false, 'Marca editada con éxito', brandFunded);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error editando la Marca', error);
        }
    }

    async deleteBrandById(idBrand: string): Promise<ServerMessages> {
        if (
            idBrand == undefined ||
            idBrand == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        try {
            var brandFunded : Brand = await this.brandRepository.findOne<Brand>({
                where: { 
                    idBrand : idBrand,
                    deleted: false 
                },
            });

            brandFunded.deleted = true;
            await brandFunded.save();
            return new ServerMessages(false, 'Marca eliminada con éxito', brandFunded);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error eliminando la marca', error);
        }
    }
}
