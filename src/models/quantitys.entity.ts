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
  tableName: 'quantitys',
  timestamps: false
})
export class Quantity extends Model<Quantity> {
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
    field: 'idQuantity',
  })
  public idQuantity: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'idProduct',
  })
  public idProduct: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    field: 'quantity',
  })
  public quantity: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'size',
  })
  size: string;
  
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'color',
  })
  color: string;
  
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    field: 'description',
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'deleted',
  })
  public deleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'createDate',
  })
  createDate: Date;

  @BelongsTo(() => Product, 'idProduct')
  product: Product;

  /* @HasMany(() => Direction, 'idUser')
  directions: Direction[]; */
}
