import { Brand } from './../brands.entity';

//provide es el nombre del esquema para la tabla de las categorías
//useValue es la identidad que se usara para el esquema que es la que nos define la estructura de la tabla
export const brandProviders = [
  {
    provide: 'BrandRepository',
    useValue: Brand,
  },
];
