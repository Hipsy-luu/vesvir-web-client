import { Category } from './../../models/categories.entity';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../models/users.entity';
import { Direction } from '../../models/directions.entity';
import { MailCenterService } from '../mail-center/mail-center.service';
import { ServerMessages } from '../../utils/serverMessages.util';
import { Product } from '../../models/products.entity';

@Injectable()
export class CategoriesService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DirectionRepository') private readonly directionRepository: typeof Direction,
        @Inject('CategoriesRepository') private readonly categoriesRepository: typeof Category,
        @Inject('ProductRepository') private readonly productRepository: typeof Product,
        private mailCenterService: MailCenterService,
    ) { }

    async getCategories(): Promise<ServerMessages> {
        try {
            var categoriesList: Category[] = await this.categoriesRepository.findAll<Category>({
                where: {
                    deleted: false,
                },
                /* include: [
                    {
                        model: Product,
                        as: "products",
                        where: { 
                            deleted: false
                        },
                    }
                ] */
            }).map(async (category: Category) => {
                var categoryProduct: Product[] = await this.productRepository.findAll<Product>({
                    attributes: {include : ["idProduct"]},
                    where: {
                        idCategory: category.idCategory,
                        deleted: false,
                    },
                });
                return Object.assign(
                    {
                        idCategory: category.idCategory,
                        name: category.name,
                        genre: category.genre,
                        noProducts: categoryProduct.length, 
                        active: category.active,
                        deleted: category.deleted,
                        createDate: category.createDate,
                    });
            });;
            return new ServerMessages(false, 'Lista de categorías obtenida', categoriesList);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de categorías', {});
        }
    }

    async createCategory(newCategory: Category): Promise<ServerMessages> {
        if (
            newCategory.name == undefined ||
            newCategory.name == undefined ||
            newCategory.genre == undefined ||
            newCategory.genre == undefined ||
            newCategory.active == undefined ||
            newCategory.active == undefined ||
            newCategory.deleted == undefined ||
            newCategory.deleted == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsValidationsData = [];

        //Directions Data Validations
        if (newCategory.name == "") {
            errorsValidationsData.push(new ServerMessages(true, 'Nombre de la categoría invalido', 1));
        }
        if (newCategory.genre == -1) {
            errorsValidationsData.push(new ServerMessages(true, 'Seleccione un genero valido', 2));
        }

        if (errorsValidationsData.length != 0) {
            return new ServerMessages(true, 'Campos de la categoría inválidos inválidos', errorsValidationsData);
        }

        //Validación categoría existente
        var categoryFunded: Category = await this.categoriesRepository.findOne<Category>({
            where: {
                name: newCategory.name,
                genre: newCategory.genre,
                deleted: false
            },
        });

        if (categoryFunded) {
            return new ServerMessages(true, 'Ya existe una categoría en el genero seleccionado con el nombre proporcionado', {});
        }

        try {
            var categoryCreated: Category = await this.categoriesRepository.create<Category>({
                name: newCategory.name,
                genre: newCategory.genre,
                active: newCategory.active,
                deleted: false,
            }, {});
            return new ServerMessages(false, 'Categoría creada con éxito', categoryCreated);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error creando la categoría', error);
        }
    }

    async editCategory(newCategory: Category): Promise<ServerMessages> {
        if (
            newCategory.idCategory == undefined ||
            newCategory.idCategory == undefined ||
            newCategory.name == undefined ||
            newCategory.name == undefined ||
            newCategory.genre == undefined ||
            newCategory.genre == undefined ||
            newCategory.active == undefined ||
            newCategory.active == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        let errorsValidationsData = [];

        //Directions Data Validations
        if (newCategory.name == "") {
            errorsValidationsData.push(new ServerMessages(true, 'Nombre de la categoría invalido', 1));
        }
        if (newCategory.genre == -1) {
            errorsValidationsData.push(new ServerMessages(true, 'Seleccione un genero valido', 2));
        }

        if (errorsValidationsData.length != 0) {
            return new ServerMessages(true, 'Campos de la categoría inválidos inválidos', errorsValidationsData);
        }

        try {
            var categoryFunded: Category = await this.categoriesRepository.findOne<Category>({
                where: {
                    idCategory: newCategory.idCategory,
                    deleted: false
                },
            });

            categoryFunded.name = newCategory.name;
            categoryFunded.genre = newCategory.genre;
            categoryFunded.active = newCategory.active;

            await categoryFunded.save();
            return new ServerMessages(false, 'Categoría editada con éxito', categoryFunded);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error editando la categoría', error);
        }
    }

    async deleteCategory(idCategory: string): Promise<ServerMessages> {
        if (
            idCategory == undefined ||
            idCategory == undefined
        ) {
            return new ServerMessages(true, 'Petición incompleta', {});
        }

        try {
            var categoryFunded: Category = await this.categoriesRepository.findOne<Category>({
                where: {
                    idCategory: idCategory,
                    deleted: false
                },
            });

            categoryFunded.deleted = true;
            await categoryFunded.save();
            return new ServerMessages(false, 'Categoría eliminada con éxito', categoryFunded);
        } catch (error) {
            return new ServerMessages(true, 'A ocurrido un error eliminando la categoría', error);
        }
    }

    async getMenuAdminCategories(): Promise<ServerMessages> {
        try {
            var categoriesList: Category[] = await this.categoriesRepository.findAll<Category>({
                where: {
                    active: true,
                    deleted: false,
                },
            }).map(async (category: Category) => {
                return Object.assign(
                    {
                        idCategory: category.idCategory,
                        name: category.name,
                        genre: category.genre,
                        active: category.active,
                        deleted: category.deleted,
                        createDate: category.createDate,
                    });
            });

            let menu = {
                mens: [],
                womens: [],
                boys: [],
                girls: []
            }
            for (let index = 0; index < categoriesList.length; index++) {
                /* 
                  3 = Niña
                  2 = Niño
                  1 = Mujer
                  0 = Hombre */
                let url = '/dashboard-admin/categorys/';
                if (categoriesList[index].genre == 0) {
                    url = url + 'mens/';
                } else if (categoriesList[index].genre == 1) {
                    url = url + 'womens/';
                } else if (categoriesList[index].genre == 2) {
                    url = url + 'boys/';
                } else if (categoriesList[index].genre == 3) {
                    url = url + 'girls/';
                }
                let fixedElement = {
                    path: url + categoriesList[index].idCategory,
                    title: categoriesList[index].name,
                    icon: '',
                    class: 'padding-submenu',
                    extralink: false,
                    submenu: []
                }

                if (categoriesList[index].genre == 0) {
                    menu.mens.push(fixedElement);
                } else if (categoriesList[index].genre == 1) {
                    menu.womens.push(fixedElement);
                } else if (categoriesList[index].genre == 2) {
                    menu.boys.push(fixedElement);
                } else if (categoriesList[index].genre == 3) {
                    menu.girls.push(fixedElement);
                }
            }

            //Contruccion sub menu

            let submenu = [];

            if (menu.mens.length != 0) {
                submenu.push({
                    path: '/dashboard-admin/categorys/mens',
                    title: 'Hombres',
                    icon: 'fas fa-male',
                    class: 'padding-submenu has-arrow',
                    extralink: false,
                    submenu: menu.mens
                });
            }
            if (menu.womens.length != 0) {
                submenu.push({
                    path: '/dashboard-admin/categorys/womens',
                    title: 'Mujeres',
                    icon: 'fas fa-female',
                    class: 'padding-submenu has-arrow',
                    extralink: false,
                    submenu: menu.womens
                });
            }
            if (menu.boys.length != 0) {
                submenu.push({
                    path: '/dashboard-admin/categorys/boys',
                    title: 'Niños',
                    icon: 'fas fa-child',
                    class: 'padding-submenu has-arrow',
                    extralink: false,
                    submenu: menu.boys
                });
            }
            if (menu.girls.length != 0) {
                submenu.push({
                    path: '/dashboard-admin/categorys/girls',
                    title: 'Niñas',
                    icon: 'fas fa-child',
                    class: 'padding-submenu has-arrow',
                    extralink: false,
                    submenu: menu.girls
                });
            }

            return new ServerMessages(false, 'Categorías del menu administrador obtenida', submenu);
        } catch (error) {
            return new ServerMessages(true, 'Error obteniendo lista de categorías del menu administrador', {});
        }
    }

    async getGenreCategories(): Promise<ServerMessages> {
        try {
            var categoriesList: Category[] = await this.categoriesRepository.findAll<Category>({
                where: {
                    active: true,
                    deleted: false,
                },
            }).map(async (category: Category) => {
                return Object.assign(
                    {
                        idCategory: category.idCategory,
                        name: category.name.toUpperCase(),
                        genre: category.genre,
                    });
            });

            let menu = {
                mens: [],
                womens: [],
                boys: [],
                girls: []
            }
            for (let index = 0; index < categoriesList.length; index++) {
                /* 
                  3 = Niña
                  2 = Niño
                  1 = Mujer
                  0 = Hombre */

                if (categoriesList[index].genre == 0) {
                    menu.mens.push(categoriesList[index]);
                } else if (categoriesList[index].genre == 1) {
                    menu.womens.push(categoriesList[index]);
                } else if (categoriesList[index].genre == 2) {
                    menu.boys.push(categoriesList[index]);
                } else if (categoriesList[index].genre == 3) {
                    menu.girls.push(categoriesList[index]);
                }
            }

            return new ServerMessages(false, 'Categorías del menu administrador obtenida', menu);
        } catch (error) {
            let menu = {
                mens: [],
                womens: [],
                boys: [],
                girls: []
            }
            return new ServerMessages(true, 'Error obteniendo lista de categorías del menu administrador', menu);
        }
    }

}
