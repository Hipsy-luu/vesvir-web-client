import { Product } from './products.entity';
import { Category } from './categories.entity';
//import { Sequelize, DataType } from 'sequelize';

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  HasMany,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
//import * as sequelize from 'sequelize'; // Este import tiene las operaciones extra que se pueden hacer para personalizar las consultas por ejemplo


@Table({
  tableName: 'productStickers',
  timestamps: false
})
export class ProductStickers extends Model<ProductStickers> {
  //Ejemplo
  /* @Column({
    type: DataType.BOOLEAN, DataType.INTEGER({ length: 11 }), DataType.STRING(45), DataType.DATE,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    defaultValue: false,
    validate: { // DOC : https://sequelize.org/master/manual/validations-and-constraints.html
      notEmpty: {
        msg: 'Please enter your name'
      }
    }
    field: 'have_image',
    
  })
  haveImage: string; */

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'idProductSticker',
  })
  idProductSticker: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'idProduct',
  })
  idProduct: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
  })
  name: string;
  
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'position',
  })
  position: number;

  @BelongsTo(() => Product, 'idProduct')
  product: Product;

  /* @HasMany(() => Direction, 'idUser')
  directions: Direction[]; */
}
