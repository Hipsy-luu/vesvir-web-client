//import { Sequelize, DataType } from 'sequelize';
import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  HasMany,
  CreatedAt,
} from 'sequelize-typescript';
import { Product } from './products.entity';
//import * as sequelize from 'sequelize'; // Este import tiene las operaciones extra que se pueden hacer para personalizar las consultas por ejemplo

@Table({
  tableName: 'brands',
  timestamps: false
})
export class Brand extends Model<Brand> {
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
    field: 'idBrand',
  })
  public idBrand: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'name',
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'active',
  })
  active: boolean;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'haveImage',
  })
  haveImage: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'deleted',
  })
  deleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(),
    field: 'createDate',
  })
  createDate: Date;


  @HasMany(() => Product, 'idBrand')
  products: Product[];
}
